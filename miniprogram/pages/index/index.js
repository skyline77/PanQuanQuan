// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    dailyQuestion: {},
    answerText: "点我看答案",
    swiperCurrent: 0,
    radios: [],

    wanhuatong: [],

    kaleidoscopesCovers: [{
      image: "../../images/wanhuatong/wanhuatong-a.png",
      wanhuatongId: "equipment"
    }, {
      image: "../../images/wanhuatong/wanhuatong-a.png",
      wanhuatongId: "equipment"
    }
    ]
  },

  showAnswer() {
    this.setData({
      isShowAnswer: true
    })
    // console.log(this.data.dailyQuestion)
    setTimeout(() => this.setData({
      answerText: `${this.data.dailyQuestion.chinese}（${this.data.dailyQuestion.english}）`
    }), 500)
  },

  swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  navToActivity() {
    wx.navigateTo({
      url: '../wanhuatongActivity/wanhuatongActivity'
    })
  },

  navToPublish() {
    wx.navigateTo({
      url: '../wanhuatongPublish/wanhuatongPublish'
    })
  },

  swipernav: function () {
    wx.navigateTo({
      url: `/pages/radio/radio?radioId=${this.data.radios[this.data.swiperCurrent].radioId}`
    })
  },

  onShareAppMessage() {
    // const promise = new Promise(resolve => {
    //   setTimeout(() => {
    //     resolve({
    //       title: '自定义转发标题'
    //     })
    //   }, 2000)
    // })
    // return {
    //   title: '自定义转发标题',
    //   path: '/page/index/index',
    //   promise 
    // }
  },
  onShareTimeline() {

  },


  async onLoad() {
    const db = wx.cloud.database()
    const _ = db.command




    try {
      const pushWanhuatong = await db.collection('push')
        .doc('pushWanhuatong')
        .get()

      this.setData({
        wanhuatong: pushWanhuatong.data.pushWanhuatong
      })

      const question = await db.collection('dailyQuestion')
        .doc(String(this.fromDateToNumberBetween23()))
        .get()

      // console.log(res.data) // doc 只返回一个元素，而非数组
      this.setData({
        dailyQuestion: question.data, // 要this=this才生效 // 是否需要select title，防止获取多余数据 
      })
      // console.log(this.data.dailyQuestion)
      // .catch(err => {
      //   console.log(err)
      // })



      // console.log(this.data.radios)
      const ids = await db.collection('push') // 仅得到了 radio的ID
        .doc('pushRadio')
        .get()
      // console.log(ids)

      let radioIds = ids.data.pushRadio.map(item => {
        return {
          radioId: item
        }
      })

      // console.log(radioIds)

      radioIds.forEach(async (id, index) => { // 通过 radio的ID 获得coverImage
        const radio = await db.collection('radio')
          .doc(id.radioId)
          .get()

        let image = radio.data.coverImage
        let str = `radios[${index}]` // 相当丑陋的语法
        this.setData({
          [str]: {
            image,
            radioId: id.radioId
          },
        })
      })
    } catch (error) {
      console.log(error)
    }

    // .catch(console.log) // console.log 是个函数





  },

  fromDateToNumberBetween23() { // 每23天循环23个手势
    const now = new Date()
    const numberBetween23 = Math.floor(now.getTime() / (60 * 60 * 24 * 1000)) % 23 + 1
    // getTime返回 1970/01/01 至今的毫秒 // 每天有60 * 60 * 24 * 1000毫秒
    // 考虑下时区？
    // console.log(numberBetween23)
    return numberBetween23
  }
})