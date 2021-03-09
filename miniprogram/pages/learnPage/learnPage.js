// pages/learnPage/learnPage.js

const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    titles: [],
    content: {},

  },

  nextPage(e) {
    this.renewContent(this.data.index + 1)
  },

  prevPage(e) {
    this.renewContent(this.data.index - 1)
  },

  renewContent(index) { // 输入index更新内容
    // console.log(index)
    wx.showLoading({
      title: '加载中'
    })
    db.collection('learn')
      .doc(String(index)) // Number 自动转 String // 不行，要主动转
      .get()
      .then(res => {
        this.setData({
          content: res.data.content,
          index: index
        })
        wx.hideLoading()
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // 获取index
    this.setData({
      index: Number(options.index)
    })

    // 获取内容
    this.renewContent(this.data.index)

    // 获取titles
    db.collection('learn')
      .doc('titles')
      .get()
      // .then(setTitles)
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