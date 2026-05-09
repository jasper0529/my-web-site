---
title: 构建生产级 Linux LVM 磁盘自动扩容
date: 2026-03-19
tags: ['Linux']
description: 在当今的云和虚拟化环境中，动态调整服务器资源已是常态。然而，手动扩展磁盘分区，尤其是在使用了 LVM (Logical Volume Manager) 的 Linux 系统上，仍然是一项繁琐且有风险的任务。一个错误的命令就可能导致数据丢失。 那么，如何实现“即插即用”的磁盘扩容，让服务器在检测到新磁...
---

在当今的云和虚拟化环境中，动态调整服务器资源已是常态。然而，手动扩展磁盘分区，尤其是在使用了 LVM (Logical Volume Manager) 的 Linux 系统上，仍然是一项繁琐且有风险的任务。一个错误的命令就可能导致数据丢失。

那么，如何实现“即插即用”的磁盘扩容，让服务器在检测到新磁盘或现有磁盘扩容后，自动完成所有 LVM 操作呢？

# **目标**
我们的目标非常明确：创建一个全自动的解决方案，以应对以下两种常见的扩容场景：

1. **添加新磁盘**：为服务器挂载一块全新的虚拟磁盘。
2. **扩容现有磁盘**：在虚拟化平台（如 VMware, Proxmox）上直接调大一块已有磁盘的容量。

脚本需要自动完成以下任务：

+ **识别变更**：自动检测到新加入的磁盘或已扩容的磁盘。
+ **LVM 操作**：安全地将这些新空间纳入指定的 LVM 卷组 (Volume Group)。
+ **按比分配**：将新增的空间，按照预设的百分比（例如：`root` 40%, `data` 40%, `log` 20%）精确地分配给不同的逻辑卷 (Logical Volume)。
+ **文件系统扩容**：最后，自动扩展逻辑卷上的文件系统（支持 `ext4` 和 `xfs`），使操作系统能够真正使用这些新空间。
+ **核心要求**：整个过程必须是**安全**、**幂等**（重复运行无副作用）且拥有**详细日志**的

# **核心武器：扩容脚本**
下面是一个`auto_expand_disk.sh` 脚本。它不仅能处理新磁盘，还能智能地刷新现有磁盘的大小，并精确地分配空间。

注意：

+ 确保这些命令能够执行：`lsblk pvcreate vgextend lvextend resize2fs xfs_growfs blkid tee vgs pvs pvresize`
+ 需要使用root用户执行

```bash
#!/bin/bash

# 日志文件路径
LOG_FILE="/var/log/auto_expand_disk.log"
# 记录已处理过的磁盘设备，防止重复操作 (幂等性关键)
PROCESSED_DISKS_FILE="/var/log/auto_expand_disk.processed"
# 需要扩展的卷组 (Volume Group) 名称
VG_NAME="xxx"
# 定义需要扩展的逻辑卷 (Logical Volumes) 及其扩容比例。
# 这是一个关联数组，键 (key) 是逻辑卷的名称，值 (value) 是分配的百分比。
# 注意：所有百分比的总和建议等于 100，以用满所有新空间。
declare -A LV_EXTEND_RULES=(
    ["xxx-root"]="40"
    ["xxx-data"]="40"
    ["xxx-log"]="20"
)

# 定义逻辑卷的处理顺序
LV_PROCESSING_ORDER=(
    "xxx-log"
    "xxx-data"
    "xxx-root"
)

# 日志记录函数
log_message() {
    local level="$1"
    local message="$2"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - [${level}] - ${message}" | tee -a "${LOG_FILE}"
}

main() {
    log_message "INFO" "--- 开始执行磁盘自动扩容脚本 ---"

    # --- 阶段一: 检查并刷新已存在的物理卷 ---
    log_message "INFO" "正在扫描卷组 '${VG_NAME}' 中的现有物理卷以检测大小变化..."
    local existing_pvs
    # 获取属于指定 VG 的所有 PV 设备名称
    existing_pvs=$(pvs --noheadings -o pv_name -S "vg_name=${VG_NAME}" 2>/dev/null | xargs)

    if [[ -n "${existing_pvs}" ]]; then
        local resize_output
        # 遍历找到的每一个 PV
        for pv_device in ${existing_pvs}; do
            log_message "DEBUG" "正在检查并刷新 ${pv_device} 的大小..."
            # `pvresize` 是一个幂等且安全的操作。如果磁盘大小没有变化，它什么也不做。
            # 如果磁盘大小增大了，它会自动更新 LVM 元数据以识别新增的空间。
            resize_output=$(pvresize "${pv_device}" 2>&1)
            if [[ $? -ne 0 ]]; then
                # 即使有警告，pvresize 通常也会成功，但记录下来以备排查
                log_message "WARNING" "在刷新 ${pv_device} 大小时出现警告或错误。输出: ${resize_output}"
            fi
        done
        log_message "INFO" "完成对现有物理卷的扫描。"
    else
        log_message "INFO" "在卷组 '${VG_NAME}' 中未发现需要扫描的现有物理卷。"
    fi

    # 确保已处理磁盘的记录文件存在
    touch "${PROCESSED_DISKS_FILE}"

    # --- 阶段二: 查找并初始化新磁盘 ---

    # 查找新的、未被处理的磁盘
    local new_disks_found=0
    local all_disks=$(lsblk -d -n -o NAME,TYPE | awk '$2=="disk" {print "/dev/"$1}')

    # 遍历系统中找到的所有磁盘
    for disk in ${all_disks}; do
        # 1. 检查这个磁盘是否在“已处理”列表中。如果是，则跳过。
        if grep -q "${disk}" "${PROCESSED_DISKS_FILE}"; then
            log_message "DEBUG" "磁盘 ${disk} 已被处理过，跳过。"
            continue
        fi

        # 2. 检查磁盘是否有分区 (新磁盘不应该有分区)
        if lsblk "${disk}" | grep -q "part"; then
            log_message "DEBUG" "磁盘 ${disk} 已存在分区，跳过。"
            continue
        fi

        # 3. 检查磁盘是否已经是物理卷 (PV)
        if pvs "${disk}" &> /dev/null; then
            log_message "DEBUG" "磁盘 ${disk} 已是物理卷，跳过。"
            continue
        fi

        log_message "INFO" "发现新的、未处理的磁盘: ${disk}"
        new_disks_found=1

        # --- 开始处理新磁盘 ---
        log_message "INFO" "正在处理磁盘: ${disk}"

        # 步骤 1: 创建物理卷 (PV)
        log_message "INFO" "步骤 1/3: 在 ${disk} 上创建物理卷..."
        pvcreate "${disk}"
        if [[ $? -ne 0 ]]; then
            log_message "ERROR" "在 ${disk} 上创建物理卷失败。请手动检查。中止处理此磁盘。"
            continue
        fi
        log_message "INFO" "成功在 ${disk} 上创建物理卷。"

        # 步骤 2: 将 PV 添加到卷组 (VG)
        log_message "INFO" "步骤 2/3: 使用 ${disk} 扩展卷组 '${VG_NAME}'..."
        vgextend "${VG_NAME}" "${disk}"
        if [[ $? -ne 0 ]]; then
            log_message "ERROR" "扩展卷组 '${VG_NAME}' 失败。请手动检查。中止处理此磁盘。"
            # 尝试回滚 pvcreate
            pvremove "${disk}"
            continue
        fi
        log_message "INFO" "成功扩展卷组 '${VG_NAME}'。"

        # 步骤 3: 记录已处理的磁盘，以确保幂等性
        log_message "INFO" "步骤 3/3: 将 ${disk} 记录为已处理。"
        echo "${disk}" >> "${PROCESSED_DISKS_FILE}"
    done

    # 如果整个循环结束都没有找到新磁盘，则记录并准备退出。
    if [[ ${new_disks_found} -eq 0 ]]; then
        log_message "INFO" "未发现需要处理的新磁盘。"
    fi

    # --- 阶段三: 检查并按比例扩展逻辑卷 ---

    local total_free_pe
     # 使用 vgs 命令获取卷组中可用的总 PE (Physical Extent) 数量。PE 是 LVM 的最小分配单元。
    # --units e 表示以 PE 为单位，-o vg_free_count 只输出可用PE数。
    total_free_pe=$(vgs --noheadings --units e -o vg_free_count "${VG_NAME}" 2>/dev/null | xargs)
    total_free_pe=${total_free_pe%.*} # 转换为整数

    # 如果没有可用空间，则没有必要进行后续操作。
    if [[ -z "${total_free_pe}" || "${total_free_pe}" -le 0 ]]; then
        log_message "INFO" "卷组 '${VG_NAME}' 中无可用空间。无需扩展逻辑卷。"
        log_message "INFO" "--- 脚本执行完毕 ---"
        exit 0
    fi

    log_message "INFO" "卷组 '${VG_NAME}' 中总可用空间为: ${total_free_pe} PEs。正在计算分配方案。"

    # 存储每个LV应分配到的PE数量
    declare -A pes_to_allocate
    local total_pes_calculated=0
    local num_lvs=${#LV_PROCESSING_ORDER[@]}
    local last_lv_name="${LV_PROCESSING_ORDER[num_lvs-1]}"

    # 步骤 1: 按照预设顺序循环计算每个 LV 应得的 PE 数量
    for lv_name in "${LV_PROCESSING_ORDER[@]}"; do
        if [[ -z "${LV_EXTEND_RULES[$lv_name]}" ]]; then
             log_message "WARNING" "逻辑卷 ${lv_name} 在处理顺序中，但未定义规则。跳过。"
            continue
        fi

        local percentage=${LV_EXTEND_RULES[$lv_name]}
        local lv_path="/dev/mapper/${lv_name}"

        if ! lvs "${lv_path}" &> /dev/null; then
            log_message "WARNING" "逻辑卷 ${lv_name} 不存在。跳过。"
            continue
        fi

         # 核心计算：总可用PE * 百分比 / 100
        local pes_for_lv=$(( total_free_pe * percentage / 100 ))
        pes_to_allocate["$lv_name"]=$pes_for_lv # 存入待分配数组
        total_pes_calculated=$(( total_pes_calculated + pes_for_lv )) # 累加已计算的PE
        log_message "DEBUG" "为 ${lv_name} 计算的待分配空间: ${pes_for_lv} PEs。"
    done

    # 步骤 2: 处理计算过程中的取整误差，将余下的 PE 全部分给最后一个 LV
    local remainder=$(( total_free_pe - total_pes_calculated ))
    if [[ ${remainder} -gt 0 && -n "${last_lv_name}" ]]; then
        if [[ -v pes_to_allocate["$last_lv_name"] ]]; then
             log_message "DEBUG" "将剩余的 ${remainder} PEs (因取整产生) 添加到最后一个逻辑卷 (${last_lv_name})。"
             pes_to_allocate["$last_lv_name"]=$(( ${pes_to_allocate["$last_lv_name"]} + remainder ))
        fi
    fi

    # 步骤 3: 再次按照预设顺序循环，按计算好的 PE 数量精确扩展 LV 和文件系统
    for lv_name in "${LV_PROCESSING_ORDER[@]}"; do
        if [[ -z "${pes_to_allocate[$lv_name]}" ]]; then
            # 如果这个LV没有分配到PE（例如无效或无规则），则跳过。
            continue
        fi

        local pes_to_add=${pes_to_allocate[$lv_name]}
        local lv_path="/dev/mapper/${lv_name}"

        if [[ ${pes_to_add} -le 0 ]]; then
            log_message "INFO" "没有空间需要分配给逻辑卷 '${lv_name}'。跳过。"
            continue
        fi

        log_message "INFO" "正在为逻辑卷 '${lv_name}' 精确扩展 ${pes_to_add} PEs..."
        # 使用 -l 选项可以直接指定增加的 PE 数量。
        lvextend -l "+${pes_to_add}" "${lv_path}"
        if [[ $? -ne 0 ]]; then
            log_message "ERROR" "扩展逻辑卷 '${lv_name}' 失败。请手动检查。"
            continue
        fi
        log_message "INFO" "成功扩展逻辑卷 '${lv_name}'。"

        # 扩展文件系统
        log_message "INFO" "正在调整 ${lv_name} 上的文件系统大小..."
        local fs_type
        # 获取逻辑卷上的文件系统类型
        fs_type=$(lsblk -f -n -o FSTYPE "${lv_path}")

        case "${fs_type}" in
            ext2|ext3|ext4)
                resize2fs "${lv_path}"
                ;;
            xfs)
                xfs_growfs "${lv_path}"
                ;;
            *)
                log_message "WARNING" "逻辑卷 ${lv_name} 上的文件系统类型 '${fs_type}' 不支持自动调整。需要手动操作。"
                continue
                ;;
        esac

        if [[ $? -ne 0 ]]; then
            log_message "ERROR" "调整 ${lv_name} 上的文件系统大小失败。"
        else
            log_message "INFO" "成功调整 ${lv_name} 上的文件系统大小。"
        fi
    done

    log_message "INFO" "--- 脚本执行完毕 ---"
}

# 执行主函数
main "$@"
```

# **脚本逻辑深度解析**
这个脚本的核心设计思想是“分阶段、多检查、保安全”。

## **阶段一：刷新现有物理卷 (PV)**
这是脚本健壮性的关键一步。幂等性检查（记录已处理磁盘）。

```bash
# ...
existing_pvs=$(pvs --noheadings -o pv_name -S "vg_name=${VG_NAME}" 2>/dev/null | xargs)
for pv_device in ${existing_pvs}; do
    pvresize "${pv_device}"
done
# ...
```

脚本首先会遍历卷组中所有的物理卷，并对每一个执行 `pvresize` 命令。这是一个安全且幂等的操作：如果磁盘大小没有变化，它什么也不做；如果磁盘在外部被调大了，它会更新 LVM 的元数据，让 LVM “看到”这些新增的空间。

## **阶段二：发现并初始化新磁盘**
接下来，脚本会像一个巡警一样，检查系统中的所有块设备，并进行一系列严格的“盘问”：

1. **是否已处理过？** (`grep -q "${disk}" "${PROCESSED_DISKS_FILE}"`)
2. **是否已有分区？** (`lsblk "${disk}" | grep -q "part"`)
3. **是否已是物理卷？** (`pvs "${disk}"`)

只有通过全部三项检查的“全新”磁盘，才会被选中进行处理。处理流程遵循 LVM 的标准三部曲：

1. `pvcreate /dev/sdX`：创建物理卷。
2. `vgextend ${VG_NAME} /dev/sdX`：扩展卷组。
3. `echo "/dev/sdX" >> ${PROCESSED_DISKS_FILE}`：登记在案，下次不再处理。

## **阶段三：空间分配**
这是脚本最核心的所在。一个常见的误区是直接使用 `lvextend -l +40%FREE` 这样的命令。但这会导致一个“递减基数”问题：第一个 LV 分配了总空间的 40%，第二个 LV 只能分配 **剩余空间** 的 40%，依此类推，导致空间无法完全利用。

我们的解决方案是“先计算，再分配”：

1. **获取总可用空间**：通过 `vgs` 命令获取卷组中总的可用 PE (Physical Extent，LVM的最小分配单元) 数量。
2. **精确计算**：遍历 `LV_PROCESSING_ORDER` 数组，根据百分比计算每个 LV **应得的 PE 数量**。
3. **处理余数**：由于整数除法会产生误差，脚本会将所有计算后的零头余数全部加到处理列表中的最后一个 LV 上，确保 100% 的空间都被计划在内。
4. **执行分配**：最后，再次遍历列表，使用 `lvextend -l +<计算好的PE数>` 将精确的空间分配给每个 LV。

## **阶段四：扩展文件系统**
完成了 `lvextend` 只是完成了 LVM 层面的操作。为了让操作系统使用这些空间，我们必须扩展文件系统。脚本通过 `lsblk -f` 获取文件系统类型，并智能地选择 `resize2fs` (用于 ext2/3/4) 或 `xfs_growfs` (用于 xfs) 来完成这最后一步。

# **让脚本“活”起来：部署为 systemd 服务**
一个脚本只有自动化运行才有意义。我们使用 `systemd` 服务管理器，来确保脚本在每次开机时都能可靠执行。

这分为三个简单的步骤

1. **放置脚本**：将 `auto_expand_disk.sh` 脚本放在 `/usr/local/sbin/` 目录下并赋予执行权限（`chmod +x /usr/local/sbin/auto_expand_disk.sh`）。
2. **创建服务文件**：在 `/etc/systemd/system/` 目录下创建一个 `auto-expand-disk.service` 文件，内容如下：

```bash
[Unit]
Description=Automated LVM Disk Expansion Service
# 确保在本地文件系统挂载完成后执行
After=local-fs.target

[Service]
# 类型为 oneshot，表示该服务只执行一次然后退出
Type=oneshot
# 指定要执行的脚本
ExecStart=/usr/local/sbin/auto_expand_disk.sh
# 即使脚本执行完毕，服务状态也保持 active，方便查询
RemainAfterExit=yes
# 以 root 用户运行
User=root
Group=root

[Install]
# 定义服务在哪个 target 下启用，multi-user.target 是标准的多用户运行级别
WantedBy=multi-user.target
```

3. **启用服务**：执行 `systemctl daemon-reload` 和 `systemctl enable auto-expand-disk.service`。

# **安全第一：全面的测试是关键**
对于一个操作磁盘的自动化脚本，怎么强调测试的重要性都不为过。在部署到生产环境前，请务必在虚拟机中，利用快照功能进行充分的测试。比如：

+ **核心功能**：添加新盘、扩容旧盘。
+ **幂等性**：无变更时重复运行、扩容后重启。
+ **边界与异常**：一次添加多个磁盘、添加有分区或已是PV的磁盘。
+ **配置错误**：故意写错 VG 或 LV 名称，观察脚本的容错能力。

# **结语**
通过结合 LVM 的灵活性和 `systemd` 的可靠性，构建了一个强大且智能的磁盘自动扩容解决方案。它将运维人员从重复性的手动操作中解放出来，不仅提升了效率，更重要的是，通过标准化的流程和详尽的日志，极大地降低了人为失误的风险，为服务器的稳定运行提供了坚实的保障。

