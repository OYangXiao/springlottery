// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const openid = cloud.getWXContext().OPENID
  if (!openid) {
    return false
  }
  const dbUser = await cloud.database().collection("records").where({
    openid
  })
    .field({
      openid: true,
      blessings: true,
      userinfo: true
    })
    .get() //获取根据查询条件筛选后的集合数据

  if (Array.isArray(dbUser.data) && dbUser.data[0]) {
    const user = dbUser.data[0]
    return { hasBlessings: user.blessings, userinfo: user.userinfo }
  } else {
    return {
      hasBlessings: {
        a: { count: 0, time: undefined },
        b: { count: 0, time: undefined },
        c: { count: 0, time: undefined },
        d: { count: 0, time: undefined },
        e: { count: 0, time: undefined }
      }
    }
  }

}