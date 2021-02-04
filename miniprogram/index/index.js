//index.js
const app = getApp()

const translateBlessing = (blessings, newV) => {
  return blessings.map((item) => {
    return { key: item.key, name: item.name, count: newV[item.key].count }
  })
}

const findNewBlessingName = (blessings, newKey) => {
  const abcd = blessings.find(el => el.key === newKey)
  return abcd ? abcd.name : ''
}

Page({
  data: {
    newBlessingName: '',
    message: '',
    drawing: false,
    blessings: [
      { key: 'a', name: '信任福', count: 0 },
      { key: 'b', name: '担当福', count: 0 },
      { key: 'c', name: '坦诚福', count: 0 },
      { key: 'd', name: '创新福', count: 0 },
    ],
    allGot: false,
    authState: false,
    userinfo: null,
    settinginfo: false,
    id: '',
    name: '',
    gettingBlessing: false,
    isFromScan: false,
    scene: ''
  },
  inputId: function (e) {
    this.setData({
      id: e.detail.value,
    })
  },
  inputName: function (e) {
    this.setData({
      name: e.detail.value,
    })
  },
  saveUserInfo: function () {
    const userinfo = { id: this.data.id, name: this.data.name }
    if (userinfo.id && userinfo.name) {
      this.setData({ settinginfo: true })
      wx.cloud.callFunction({
        name: 'saveuserinfo',
        data: userinfo,
        success: _ => {
          this.setData({ userinfo, settinginfo: false })
        }
      })
    }
  },
  onShow: function () {
    console.log('on show')
    const that = this
    const isFromScan = [1017, 1011, 1047, 1001].includes(wx.getLaunchOptionsSync().scene)
    console.log(wx.getLaunchOptionsSync().scene)
    this.setData({
      drawing: isFromScan,
      isFromScan,
      scene: wx.getLaunchOptionsSync().scene
    })
    if (isFromScan) {
      setTimeout(() => {
        wx.cloud.callFunction({
          name: 'lotterydraw',
          success: res => {
            const blessings = translateBlessing(that.data.blessings, res.result.hasBlessings)
            const newBlessingName = res.result.newBlessingName === 'e' ? '普通福' : findNewBlessingName(this.data.blessings, res.result.newBlessingName)
            that.setData({
              newBlessingKey: res.result.newBlessingName,
              newBlessingName,
              message: res.result.message,
              blessings,
              allGot: blessings.every(el => !!el.count),
              drawing: false,
              userinfo: res.result.userinfo || false
            })
          }
        })
      }, 1000);
    } else {
      this.setData({
        gettingBlessing: true
      })
      wx.cloud.callFunction({
        name: 'getblessings',
        success: res => {
          const blessings = translateBlessing(that.data.blessings, res.result.hasBlessings)
          that.setData({
            gettingBlessing: false,
            newBlessingKey: '',
            newBlessingName: '',
            blessings,
            allGot: blessings.every(el => !!el.count),
            userinfo: res.result.userinfo || false
          })
        }
      })
    }
  },
  onLoad: function () {
    console.log('on load')
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

  },
})
