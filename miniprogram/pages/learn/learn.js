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
  async onLoad(options) {
    const db = wx.cloud.database()

    const titles = await db.collection('learn')
      .doc('titles')
      .get()
      .catch(err => {
        console.log(err)
      })

    this.setData({
      titles: titles.data.titles
    })



  },

  onShareAppMessage() {
  },
  onShareTimeline(){

  },
})