// miniprogram/pages/mySheet/mySheet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sheets: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onShow() {
    console.log('onShow')
    wx.showLoading({
      title: '加载中'
    })

    this.setData({
      sheets: []
    })

    try {

      const db = wx.cloud.database()
      const _ = db.command
      const userId = await wx.cloud.callFunction({ // 通过add函数获取openid（为啥是add这个奇怪的名字）
        name: 'getOpenId',
      })

      const sheets = await db.collection('sheet')
        .where({
          _openid: userId.result.OPENID
        })
        .orderBy('updateDate', 'desc')
        .get()

      if (sheets.data.length === 0) {
        wx.showToast({
          title: '暂无数据',
          icon: 'error',
          success: setTimeout(() => {
            wx.navigateBack({})
          }, 1500)
        })
      }

      else {

        this.setData({
          sheets: sheets.data
        })

        // 存入storage
        wx.setStorage({
          key: 'sheets',
          data: JSON.stringify(sheets.data)
        })

        wx.hideLoading()
      }


    } catch (err) {
      console.log(err)
    }
  },
  onShareAppMessage() {
  },
  onShareTimeline() {
  },
})