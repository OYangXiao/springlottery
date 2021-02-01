//index.js
const app = getApp()

Page({
  data: {
    newBlessingName: '',
    hasBlessings: [],
    fromScene: 0
  },

  onLoad: function () {
    const isFromScan = wx.getLaunchOptionsSync().scene === 1017
    this.setData({
      fromScene: wx.getLaunchOptionsSync().scene
    })
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    const that = this
    wx.login({
      success(res) {
        if (res.code) {
          if (isFromScan) {
            wx.cloud.callFunction({
              name: 'lotterydraw',
              success: res => {
                console.log(res.result)
                that.setData({
                  newBlessingName: res.result.newBlessingName,
                  hasBlessings: JSON.stringify(res.result.hasBlessings)
                })
              }
            })
          } else {
            wx.cloud.callFunction({
              name: 'getblessings',
              success: res => {
                console.log(res.result)
                that.setData({
                  newBlessingName: res.result.newBlessingName,
                  hasBlessings: JSON.stringify(res.result.hasBlessings)
                })
              }
            })
          }
          console.log('登录成功', res)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
})
