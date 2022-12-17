// miniprogram/pages/myRadio/myRadio.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioContents: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: async function () {
    this.setData({ // 关键な一步
      radioContents: [],
    })

    wx.showLoading({
      title: '加载中'
    })

    const db = wx.cloud.database()
    const _ = db.command
    const that = this



    try {
      const userId = await wx.cloud.callFunction({
        name: 'getOpenId',
      })


      const res = await db.collection('favorRadio')
        .where({
          _openid: userId.result.OPENID
        })
        .get()

      if (res.data.length > 0) {
        let radioIds = res.data.map(item => item.radioId)

        const radioContent = await db.collection('radio')
          .where({
            _id: _.in(radioIds)
          })
          .get()

        that.setData({
          radioContents: radioContent.data
        })
        wx.hideLoading()

      } else {
        throw new Error('没有收藏的电台')
      }

    } catch (error) {

      // console.log(error)

      wx.showToast({
        title: '没有收藏的电台',
        icon: 'error',
        success: setTimeout(() => {
          wx.navigateBack({})
        }, 2000)
      })


    }



    // second version
    // wx.cloud.callFunction({
    //   name: 'openId',
    // })
    //   .then(fromIdToRadio)
    //   .then(fromRadioToContent)
    //   .catch(err => {
    //     // console.log(err)
    //     wx.showToast({
    //       title: err,
    //       icon: 'error',
    //       success: setTimeout(() => {
    //         wx.navigateBack({})
    //       }, 2000)
    //     })
    //   })

    // function fromIdToRadio(userId) {
    //   return db.collection('favorRadio')
    //     .where({
    //       _openid: userId.result.OPENID
    //     })
    //     .get()
    // }

    // async function fromRadioToContent(res) {
    //   if (res.data.length > 0) {
    //     let radioIds = res.data.map(item => item.radioId)

    //     const res_1 = await db.collection('radio')
    //       .where({
    //         _id: _.in(radioIds)
    //       })
    //       .get() // 用await代替then

    //     that.setData({
    //       radioContents: res_1.data
    //     })
    //     wx.hideLoading()
    //   } else {
    //     return Promise.reject('没有收藏的电台')
    //   }
    // }

    // first version
    // wx.cloud.callFunction({
    //     name: 'openId',
    //   })
    //   .then(fromIdToRadio
    //     // userId => { // 1. 得到用户的openId
    //     //   return db.collection('favorRadio')
    //     //     .where({
    //     //       _openid: userId.result.OPENID
    //     //     })
    //     //     .get()
    //     // }
    //   )

    //   .then(res => { // 2. 得到收藏电台的id

    //     if (res.data.length > 0) { // 2.a. 如果有收藏的电台
    //       let radioIds = res.data.map(item => item.radioId)
    //       // console.log(radioIds) // id数组

    //       db.collection('radio')
    //         .where({
    //           _id: _.in(radioIds)
    //         })
    //         .get()
    //         .then(res => { // // 3. 得到收藏电台的内容
    //           this.setData({
    //             radioContents: res.data
    //           })
    //           wx.hideLoading()
    //           // console.log(this.data.radioContents)
    //         })

    //     } else { // 2.b. 如果没有收藏的电台
    //       wx.showToast({
    //         title: '没有收藏的电台',
    //         icon: 'error',
    //         success: setTimeout(() => {
    //           wx.navigateBack({})
    //         }, 2000)
    //       })

    //     }

    //   })

  },
  onShareAppMessage() {
  },
  onShareTimeline() {
  },
})