// miniprogram/pages/mySheetDetail/mySheetDetail.js

const db = wx.cloud.database()
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
  async onLoad(options) {

    const sheets = await wx.getStorage({
      key: 'sheets',
    })
      .catch(err => console.log(err))

    // console.log(res.data)
    this.setData({
      sheet: JSON.parse(sheets.data)[options.index]
    })
  },

  async delete() {
    const isDelete = await wx.showModal({
      title: '是否删除该评价',
    })

    if (isDelete.confirm) {
      const userId = await wx.cloud.callFunction({ // 通过add函数获取openid（为啥是add这个奇怪的名字）
        name: 'getOpenId',
      })

      await db.collection('sheet')
        .where({
          _openid: userId.result.OPENID,
          date: this.data.sheet.date,
          myTeam: this.data.sheet.myTeam,
          enemyTeam: this.data.sheet.enemyTeam,
        })
        .remove()

      wx.showToast({
        title: '删除成功！',
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 2000)


    }
  },
  onShareAppMessage() {
  },
  onShareTimeline(){
  },
})