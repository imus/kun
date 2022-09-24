/*
 * @Description: 
 * @Author: sunsh
 * @Date: 2022-09-23 18:50:42
 * @LastEditors: sunsh
 * @LastEditTime: 2022-09-23 22:12:55
 */

// vuepress 2.x 的配置

import { defaultTheme } from '@vuepress/theme-default'
module.exports = {
  theme: defaultTheme({
    title:"Element3",
    description:"vuepress搭建的Element3文档",
    logo:"/element3.svg",
    navbar:[
      {
        link:"/",
        text:"首页"
      },{
        link:"/install",
        text:"安装"
      },
    ],
    
    sidebar:[
      {
        text:'安装',
        link:'/install'
      },
      {
        text:'按钮',
        link:'/button'
      },
    ]
  })
}