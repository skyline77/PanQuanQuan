// pages/learn/learn.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles: []
  },

  navigateTo(index) {
    console.log('navigate to ' + index)
    wx.navigateTo({
      url: `/pages/learnPage/learnPage?index=${index}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()

    db.collection('learn')
      .doc('titles')
      .get()
      .then(res => {
        this.setData({
          titles: res.data.titles
        })
      })
      .catch(err => {
        console.log(err)
      })



  },
})