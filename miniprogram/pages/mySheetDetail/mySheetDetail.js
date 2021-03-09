// miniprogram/pages/mySheetDetail/mySheetDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sheet: {},
    rules: [
      '规则的理解与使用',
      '犯规和身体接触',
      '公平竞争的意识',
      '积极的态度与自我控制',
      '交流',
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
        key: 'sheets',
      })
      .then(res => {
        // console.log(res.data)
        this.setData({
          sheet: JSON.parse(res.data)[options.index]
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
})