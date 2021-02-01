// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const openid = cloud.getWXContext().OPENID

  const dbUser = await cloud.database().collection("records").where({
    openid
  })
    .field({
      openid: true,
      blessings: true
    })
    .get() //获取根据查询条件筛选后的集合数据

  if (Array.isArray(dbUser.data) && dbUser.data[0]) {
    return { hasBlessings: dbUser.data[0].blessings }
  } else {
    return {
      hasBlessings: []
    }
  }

}