// miniprogram/pages/wanhuatongPublish/wanhuatongPublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    place: ['北京市', '北京市', '东城区'], // 这5个是picker，需要显式改变
    startDate: '2021-01-01',
    startTime: '00:00',
    endDate: '2021-01-01',
    endTime: '00:00',
  },

  changePlace(e) {
    this.setData({
      place: e.detail.value
    })
  },
  changeStartDate(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  changeStartTime(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  changeEndDate(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  changeEndTime(e) {
    this.setData({
      endTime: e.detail.value
    })
  },

  async onSubmit(e) { // 1. 不存在空项 2. 结束时间 > 开始时间
    try {

      const value = e.detail.value
      // console.log(value)
      for (const item in value) {
        // console.log(value[item])
        if (!value[item]) {
          wx.showToast({
            title: '存在未填项目！',
            icon: 'error'
          })
          return
        }
      }

      if (value.startDate > value.endDate || value.startDate === value.endDate && value.startTime > value.endTime) {
        wx.showToast({
          title: '起止时间错误',
          icon: 'error'
        })
        return
      }


      // const profile = await wx.getUserProfile({ // getUserProfile不能作为回调，要第一个调用，否则不认他是通过user tap出发
      //   desc: '获取昵称',
      // })
      //   .catch(console.log)

      const db = wx.cloud.database()
      await db.collection('activity').add({
        data: {
          name: value.name,
          place: value.place,
          placeDetail: value.placeDetail,
          introduction: value.introduction,
          contact: value.contact,
          startDate: value.startDate,
          startTime: value.startTime,
          endDate: value.endDate,
          endTime: value.endTime,
          // nickName: profile.nickName,
          updateDate: new Date(),
          legal: false,
        },
      })

      wx.showToast({
        title: '等待审核~',
        duration: 2000,
      })

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }, 2000)
    }
    catch (err) {
      console.log(err)

      wx.showModal({
        // cancelColor: 'cancelColor',
        showCancel: false,
        title: '表单未完成',
        content: err.message || err.errMsg || '提交失败',
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShareAppMessage() {
  },
  onShareTimeline(){
  },
})