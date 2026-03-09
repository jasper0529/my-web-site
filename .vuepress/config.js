module.exports = {
  title: 'my blog',
  description: 'my blog record',
  themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { 
                text: '我的 博客', 
                items: [
                ]
            }
        ],


sidebar: [
            {
                title: '欢迎学习',
                path: '/',
                collapsable: false, // 不折叠
                children: [
                    { title: "学前必读", path: "/" }
                ]
            },
            {
              title: "基础学习",
              path: '/handbook/ConditionalTypes',
              collapsable: false, // 不折叠
              children: [
                { title: "条件类型", path: "/handbook/ConditionalTypes" },
                { title: "泛型", path: "/handbook/Generics" }
              ],
            }
          ]
    }
}
