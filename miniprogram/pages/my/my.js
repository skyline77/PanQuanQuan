// pages/my/my.js

// import * as echarts from 'echarts';

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  navToMySheet() {
    wx.navigateTo({
      url: '/pages/mySheet/mySheet',
    })
  },

  navToMyRadio() {
    wx.navigateTo({
      url: '/pages/myRadio/myRadio',
    })
  },
})