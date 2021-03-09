// miniprogram/pages/radio/radio.js
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.loop = false

const db = wx.cloud.database()

var app = getApp()
Page({

  data: {
    radioId: "",
    radiodata: {},
    favored: false,
    _openid: "",
    isReady: false



  },

  favor() {
    db.collection('favorRadio')
      .add({ // 先知道该用户有没有事收藏这篇radio
        data: {
          updateDate: new Date(),
          // _openid: this.data._openid, // 自动设置的
          radioId: this.data.radioId
        }
      })
      .then(() => {
        this.setData({
          favored: true
        })
        wx.showToast({
          title: '已收藏该电台',
          icon: 'success',
          duration: 2000
        })
      })
      .catch(() => {
        wx.showToast({
          title: '收藏失败',
          icon: 'error',
          duration: 2000
        })
      })


  },

  disfavor() {
    // console.log('取消收藏') // 应该showToast
    db.collection('favorRadio')
      .where({ // 同时有两个满足，为何只删除一个
        _openid: this.data._openid,
        radioId: this.data.radioId
      })
      .remove()
      .then(() => {
        this.setData({
          favored: false
        })
        wx.showToast({
          title: '取消收藏',
          icon: 'success',
          duration: 2000
        })
      })
      .catch(() => {
        wx.showToast({
          title: '收藏失败',
          icon: 'error',
          duration: 2000
        })
      })
    // .then(res => console.log(`已删除记录数：${res.stats.removed}`)) // 小程序端只能删除一条 


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 设置radioId
    this.setData({
      radioId: options.radioId
    })
    // console.log(options.radioId)

    wx.showLoading({
      title: '加载中'
    })

    // 1.1 获得openId
    let promise1 = wx.cloud.callFunction({
        name: 'add',
      })
      .then(res => {
        this.setData({
          _openid: res.result.OPENID
        })
        // console.log('getted openId: ' + res.result.OPENID) // 3 

        return db.collection('favorRadio')
          .where({ // 同时有两个满足，为何只删除一个 // 客户端只能删除一个
            _openid: this.data._openid,
            radioId: this.data.radioId
          })
          .get()
      })

      // 1.2 查询是否收藏
      .then(res => {
        this.setData({
          favored: res.data.length > 0 ? true : false
        })
        // console.log('1. 获得openId并查询是否收藏')
        // console.log('querying openId: ' + this.data._openid)
      })



    // 2. 通过radioId获得radio内容
    let promise2 = db.collection('radio').doc(this.data.radioId) // 应该作为组件http 参数
      .get()
      .then((res) => {
        this.setData({
          radiodata: res.data // data坑死我
        });
        // console.log('2. 通过radioId获得radio内容')
      })

    Promise.all([promise1, promise2])
      .then(() => {
        // console.log(values);
        // console.log('1 2 都已完成');
        wx.hideLoading()
        this.setData({
          isReady: true
        })
      })
      .catch(err => {
        console.log(err)
      })


    // console.log(res)
    // console.log(this.data.radiodata.timeline) // 数据库权限坑死我。that坑死我
  },




})