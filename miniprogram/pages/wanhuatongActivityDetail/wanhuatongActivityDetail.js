// miniprogram/pages/wanhuatongActivityDetail/wanhuatongActivityDetail.js

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: [],
    intrestUser: [],
    isIntrest: false,
    avatarUrl: '',
    userId: ''

  },

  async delete(e) {
    console.log('delete')

    const res = await wx.showModal({
      title: '删除活动',
      content: '是否删除你发布的活动',
    })

    if (res.confirm) {
      await db.collection('activity')
        .doc(this.data.activity._id)
        .remove()

        wx.showToast({
          title: '删除成功！',
        })
    
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1500);
    }
    else {
      wx.showToast({
        icon: 'error',
        title: '取消删除',
      })
    }




  },

  async notIntrest() {



    await db.collection('favorActivity')
      .where({
        _openid: this.data.userId,
        activityId: this.data.activity._id
      })
      .remove()

    this.setData({
      isIntrest: false,
      // intrestUser: this.data.intrestUser.filter(item => item._openid !== this.data.userId)
    })

    wx.showToast({
      title: '操作成功！',
    })

  },

  async intrest(e) {
    // console.log(JSON.parse(await e.detail.rawData).nickName)
    // console.log(JSON.parse(await e.detail.rawData).avatarUrl)

    await db.collection('favorActivity').add({
      data: {
        nickName: JSON.parse(await e.detail.rawData).nickName,
        avatarUrl: JSON.parse(await e.detail.rawData).avatarUrl,
        activityId: this.data.activity._id
      }
    })


    this.setData({
      isIntrest: true,
    })


    wx.showToast({
      title: '操作成功',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const userId = await wx.cloud.callFunction({ // 通过add函数获取openid（为啥是add这个奇怪的名字）
      name: 'getOpenId',
    })

    this.setData({
      userId: userId.result.OPENID
    })

    const activities = await wx.getStorage({
      key: 'activities',
    })
      .catch(err => console.log(err))

    // console.log(res.data)
    this.setData({
      activity: JSON.parse(activities.data)[options.index]
    })

    const intrestUser = await db.collection('favorActivity').where({
      activityId: this.data.activity._id
    })
      .get()


    // console.log(intrestUser.data.map(item => item._openid))
    // console.log(userId.result.OPENID)
    this.setData({
      intrestUser: intrestUser.data.filter(item => item._openid !== this.data.userId),
      isIntrest: intrestUser.data.map(item => item._openid).indexOf(this.data.userId) !== -1,
    })



  },

  onShareAppMessage() {
  },
  onShareTimeline() {
  },
})