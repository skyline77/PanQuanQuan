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
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })

    const db = wx.cloud.database()
    const _ = db.command
    wx.cloud.callFunction({ // 通过add函数获取openid（为啥是add这个奇怪的名字）
        name: 'add',
      })
      .then(userId => {
        db.collection('sheet')
          .where({
            _openid: userId.result.OPENID
          })
          .get()
          .then((res) => {
            // console.log(res)
            this.setData({
              sheets: res.data
            })
            // console.log(res.data)

            // 存入storage
            wx.setStorage({
              key: 'sheets',
              data: JSON.stringify(res.data)
            })
            wx.hideLoading()

          })
      })


  }
})