// 全线拦截在路由跳转 导航守卫

import router from '@/router'
import store from '@/store' // store实例和组件中的this.$store是一回事
import nProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css'
// 不需要导出 因为只需要让代码执行 main.js已经引入了
// 导航前置守卫 to到哪里去 from从哪里来 next是前置守卫必须执行的钩子,必须执行，不执行页面就死了
// next()放过 next(false)跳转终止 next(地址)跳转到某个地址
const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
router.beforeEach(async(to, from, next) => {
  nProgress.start() // 开启进度条
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      // 如果要访问的是登入页面
      next('/') // 跳转到主页  有token不用处理
    } else {
      // 只有放过采取获取用户资料
      if (!store.getters.userId) {
        // 如果没有id表示当前用户资料没有获取过
        await store.dispatch('user/getUserInfo')
        // 如果说后续 需要根据用户资料获取数据的话 这里必须改成 同步
      }
      next()
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单
      next()
    } else {
      next('login')
    }
  }
  nProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 导航后置守卫
router.afterEach(() => {
  nProgress.done() // 关闭进度条
})
