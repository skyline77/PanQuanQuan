// miniprogram/pages/wanhuatong/wanhuatong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [],
    isReady: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    wx.showLoading({
      title: '加载中'
    })


    const db = wx.cloud.database()
    const wanhuatongId = options.wanhuatongId
    // console.log(wanhuatongId)

    const wanhuatong = await db.collection('wanhuatong').doc(wanhuatongId).get()
    this.setData({
      content: wanhuatong.data.content,
      isReady: true
    })

    wx.hideLoading()



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onShareTimeline(){
  },
})