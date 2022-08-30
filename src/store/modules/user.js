import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 状态
const state = {
  token: getToken(), // 设置token为共享状态,初始化vuex就先从缓存中读取
  userInfo: {} // 定义一个空对象 为什么要定义空对象
}
// 修改状态
const mutations = {
  // 设置Token
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    // 同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null // 将vuex置空
    removeToken() // 将缓存置空
  },
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result // 这样是响应式
    // state.userInfo = [...result] // 这样也是响应式 属于浅拷贝
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }

}
// 执行异步
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    // 如果为true 表示登入成功
    context.commit('setToken', result) // 设置token
    // 拿到token说明登入成功
    setTimeStamp() // 设置当前时间戳
  },
  async getUserInfo(context) {
    // 调用getuserinfo
    const result = await getUserInfo() // 获取返回值
    // 获取用户详情
    const baseInfo = await getUserDetailById(result.userId)
    // 将两个接口结果合并
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 将整个的个人信息设置到用户的vuex数据中 提交mutation
    return result // 这里为什么要返回 为后面做权限埋下伏笔
  },
  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken') // 不仅删除vuex中的，还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
