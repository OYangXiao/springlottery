const blessingList = [
  {
    name: 'a',
    percent: 1
  }, {
    name: 'b',
    percent: 1
  }, {
    name: 'c',
    percent: 1
  }, {
    name: 'd',
    percent: 1
  }, {
    name: 'e',
    percent: 6
  }
]
// 从数组中按概率随机生成成员
const getRandomBlessing = function () {
  let total = 0;
  let [i, j, percent] = [null, null, null];
  let index = new Array();
  for (i = 0; i < blessingList.length; i++) {
    percent = 'undefined' != typeof (blessingList[i].percent) ? parseInt(blessingList[i].percent * 100) : 0;
    for (j = 0; j < percent; j++) {
      index.push(i);
    }
    total += percent;
  }
  var rand = Math.floor(Math.random() * total);
  return blessingList[index[rand]];
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()



// 云函数入口函数
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID

  const db = cloud.database()
  const collection = db.collection("records")

  const dbUser = await collection.where({
    openid
  })
    .field({
      openid: true,
      blessings: true
    })
    .get() //获取根据查询条件筛选后的集合数据
  //获取根据查询条件筛选后的集合数据

  let user = undefined
  // 判断数据库是否有该用户的记录
  if (dbUser.data.length == 0) {
    // 不存在，即写入该用户信息
    user = {
      openid,
      blessings: {
        a: null,
        b: null,
        c: null,
        d: null,
        e: null
      }
    }
  } else {
    user = dbUser.data[0]
  }
  let newBlessingName = false
  if (user.blessings.a && user.blessings.b && user.blessings.c && user.blessings.d) {
    // 如果四个福都有了，就返回成功
  } else {
    newBlessing = getRandomBlessing()
    user.blessings[newBlessing.name] = Date.now()
    newBlessingName = newBlessing.name
    if (!user._id) {
      collection.add({ data: user })
    } else {
      console.log(user)
      collection.doc(user._id).set({ data: { openid: user.openid, blessings: user.blessings } })
    }
  }
  return {
    hasBlessings: Object.entries(user.blessings).map(([key, value]) => value ? key : undefined).filter(Boolean),
    newBlessingName
  }
}