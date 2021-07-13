// miniprogram/pages/wanhuatongActivity/wanhuatongActivity.js

const db = wx.cloud.database()
const _ = db.command



Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: [],
    mode: ''
  },

  onLoad(options) { // 改成onload才有 option
    // console.log('onLoad')
    this.setData({
      mode: options.mode
    })
  },
  async onShow() {
    wx.showLoading({
      title: '加载中'
    })


    this.setData({
      activities: []
    })

    try {

      let activities

      const userId = await wx.cloud.callFunction({ // 通过add函数获取openid（为啥是add这个奇怪的名字）
        name: 'getOpenId',
      })


      if (this.data.mode === 'onlyMine') {
        activities = await db.collection('activity').where({
          _openid: userId.result.OPENID
        })

          .orderBy('updateDate', 'desc')
          .get()

      } else if (this.data.mode === 'onlyIntrest') {
        let favorActivity = await db.collection('favorActivity').where({ // 需要更改
          _openid: userId.result.OPENID
        })
          .get()

        let favorActivityId = favorActivity.data.map(item => item.activityId)
        // console.log(favorActivityId)

        activities = await db.collection('activity').where({ // 需要更改
          _id: _.in(favorActivityId)
        })
          .orderBy('updateDate', 'desc')
          .get()
      }
      else {
        activities = await db.collection('activity')
          .orderBy('updateDate', 'desc')
          .get()
      }

      if (activities.data.length === 0) {
        wx.hideLoading()
        wx.showToast({
          title: '暂无数据',
          icon: 'error',
          success: setTimeout(() => {
            wx.navigateBack({})
          }, 2000)
        })
      }
      else { // 原来没有else

        this.setData({
          activities: activities.data
        })

        // 存入storage
        wx.setStorage({
          key: 'activities',
          data: JSON.stringify(activities.data)
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