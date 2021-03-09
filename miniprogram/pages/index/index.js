// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    dailyQuestion: {},
    answerText: "点我看答案",
    swiperCurrent: 0,
    radios: [],

    kaleidoscopesCovers: [{
      image: "/images/kaleidoscope/item1.png"
    }, {
      image: "/images/kaleidoscope/item2.png"
    }, {
      image: "/images/kaleidoscope/item3.png"
    }, {
      image: "/images/kaleidoscope/item4.png"
    }, {
      image: "/images/kaleidoscope/item5.png"
    }, {
      image: "/images/kaleidoscope/item6.png"
    }, ]
  },

  showAnswer: function () {
    this.setData({
      isShowAnswer: true
    })
    // console.log(this.data.dailyQuestion)
    setTimeout(() => this.setData({
      answerText: `${this.data.dailyQuestion.chinese}（${this.data.dailyQuestion.english}）`
    }), 500)
  },

  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },


  swipernav: function () {
    wx.navigateTo({
      url: `/pages/radio/radio?radioId=${this.data.radios[this.data.swiperCurrent].radioId}`
    })
  },




  onLoad() {



    const db = wx.cloud.database()
    db.collection('dailyQuestion')
      .doc(String(fromDateToNumberBetween23()))
      .get()
      .then(res => {
        // console.log(res.data) // doc 只返回一个元素，而非数组
        this.setData({
          dailyQuestion: res.data, // 要this=this才生效 // 是否需要select title，防止获取多余数据 
        })
        // console.log(this.data.dailyQuestion)
      })
      .catch(err => {
        console.log(err)
      })



    // console.log(this.data.radios)
    db.collection('push') // 仅得到了 radio的ID
      .doc('pushRadio')
      .get()
      .then(ids => {
        // console.log(ids)
        let radioIds = ids.data.pushRadio.map(item => {
          return {
            radioId: item
          }
        })

        // console.log(radioIds)

        radioIds.forEach((id, index) => { // 通过 radio的ID 获得coverImage
          db.collection('radio')
            .doc(id.radioId)
            .get()
            .then(radio => {
              let image = radio.data.coverImage
              let str = `radios[${index}]` // 相当丑陋的语法
              this.setData({
                [str]: {
                  image,
                  radioId: id.radioId
                },
              })
            })
        })

      })
      .catch(err => {
        console.log(err)
      })


    function fromDateToNumberBetween23() { // 每23天循环23个手势
      const now = new Date()
      const numberBetween23 = Math.floor(now.getTime() / (60 * 60 * 24 * 1000)) % 23
      // getTime返回 1970/01/01 至今的毫秒 // 每天有60 * 60 * 24 * 1000毫秒
      // 考虑下时区？
      // console.log(numberBetween23)
      return numberBetween23
    }


  },
})