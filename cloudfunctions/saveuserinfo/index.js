// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const openid = cloud.getWXContext().OPENID
  if (!openid) {
    return false
  }
  const collection = cloud.database().collection("records")
  const dbUser = await collection.where({
    openid
  })
    .field({
      userinfo: true
    })
    .get() //获取根据查询条件筛选后的集合数据

  if (Array.isArray(dbUser.data) && dbUser.data[0]) {
    collection.doc(dbUser.data[0]._id).update({
      data: {
        userinfo: { id: event.id, name: event.name }
      }
    })
    return true
  } else {
    return false
  }

}