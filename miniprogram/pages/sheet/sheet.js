// pages/learn/laern.js

const app = getApp()
const db = wx.cloud.database()

Page({


  data: {
    rules: [{
        title: '规则的理解与使用',
        detail: "他们是否故意违反了规则。\r\n他们是否遵守时间规则。\r\n当他们不清楚规则时是否愿意去了解学习。",
        score: 0,
      },
      {
        title: '犯规和身体接触',
        detail: "他们是否避免了犯规，身体接触和危险动作。",
        score: 0,
      },
      {
        title: '公平竞争的意识',
        detail: "他们是否在合适的场景下提醒队友取消错误/非必要的Call并为之道歉。\r\n他们是否只Call必要的Call。",
        score: 0,
      },
      {
        title: '积极的态度与自我控制',
        detail: "他们是否礼貌。\r\n他们是否无论比分多少都保持着合适的比赛强度。\r\n他们是否在比赛前中后都留下了积极的印象。",
        score: 0,
      },
      {
        title: '交流',
        detail: "他们是否尊敬有礼地与我们沟通。\r\n他们是否认真倾听我们的陈述。\r\n他们是否遵守讨论限时。",
        score: 0,
      }
    ],
    date: '2021-01-01' // 原来字符串才是正确的实现方式，而不是Date
  },

  bindDateChange(event) { // 从form可以一起提交。但没法显示“总分"
    // console.log(event.detail.value) 
    this.setData({
      date: event.detail.value // 格式不太一样 是不是用Date Object更好
    })
    // console.log(typeof( this.data.date))
  },

  onSubmit(e) {


    // 表单验证  // 遍历e.detail.value好一些？ 

    // 是否填写赛事名及双方队伍
    if (e.detail.value.myTeam === '' || e.detail.value.enemyTeam === '' || e.detail.value.gameName === '') {
      wx.showModal({
        title: '表单未完成',
        content: '请填写赛事名及双方队伍',
        showCancel: false
      })
      return
    }

    // 是否曾经上传过同一场比赛的评分（相同赛事名、日期、双方队伍）
    // db.collection('sheet')
    //   .where({
    //     enemyTeam: e.detail.value.enemyTeam,
    //     myTeam: e.detail.value.myTeam,
    //     gameName: e.detail.value.gameName,
    //     date: e.detail.value.date
    //   })
    //   .get()
    //   .then(res => {
    //     // console.log(res)
    //     if (res.data.length > 0) {
    //       let response = false
    //       wx.showModal({
    //           title: '已评价该场比赛',
    //           content: '您已经评价过该场比赛，是否更新评价',
    //         })
    //         .then(res => {
    //           if (res.confirm) {
    //             response = true
    //           } else if (res.cancel) {
    //             response = false
    //           }
    //         })
    //     }
    //     return Promise.resolve(1)

    //   })
    // 等价于 return Promise.resolve(1)
    // then(onFulfilled, onRejected) 
    // onFullfilled若不是函数，替换为 x => return x  return可省略
    // onRejected  若不是函数，替换为 x => throw x

    // promise的reject与否，只影响下一个then
    // http://liubin.org/promises-book/#not-throw-use-reject 使用reject而不是throw

    // Promise.resolve(42); 可以认为是以下代码的语法糖。

    // new Promise(function(resolve){
    //     resolve(42);
    // });





    // .then((res) => {
    // console.log(res)
    // 若打分为0，需要15字以上评论
    let state = true;

    [0, 1, 2, 3, 4].forEach(index => {
      if ((this.data.rules[index].score === 0 || this.data.rules[index].score === 4) &&
        e.detail.value['comment' + index].length < 15) {
        wx.showToast({
          title: `“${index + 1}. ${this.data.rules[index].title}”评分为${this.data.rules[index].score}，需要10字以上评论`,
          duration: 2000,
          icon: 'none'
        })
        state = false
        // return Promise.reject('未输入评论!')
      }
    })

    if (state === false) {
      return
    //   console.log('未输入评论')
    //   return Promise.reject('未输入评论!')
    }



    // 上传数据
    wx.getUserProfile({
        desc: '获取昵称'
      })
      .then(res => {
        let nickName = res.userInfo.nickName
        // console.log(res.userInfo)

        db.collection('sheet')
          .add({
            data: {
              enemyTeam: e.detail.value.enemyTeam,
              myTeam: e.detail.value.myTeam,
              gameName: e.detail.value.gameName,
              date: e.detail.value.date,
              totalScore: this.data.rules[0].score + this.data.rules[1].score + this.data.rules[2].score + this.data.rules[3].score + this.data.rules[4].score,
              nickName: nickName,
              updateDate: new Date(),
              scores: this.data.rules.map(obj => obj.score),
              comments: [e.detail.value.comment0, e.detail.value.comment1, e.detail.value.comment2, e.detail.value.comment3, e.detail.value.comment4]
            }
          })
      })
      .then(() => {
        wx.showToast({
            title: '提交成功！',
            duration: 2000,
          })
          .then(() => {
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }, 2000)

          })

        // console.log(res) // e.detail.value
        // console.log(e.detail.value) // e.detail.value
      })

    // })
    // .catch(err => {
    //   if (err === '未输入评论') {

    //   } else {

    //   }
    //   console.log(err)
    //   wx.showToast({
    //     title: '提交失败！',
    //     duration: 2000,
    //     icon: 'error'
    //   })
    // })




  },

  sliderChange(event) {
    // console.log(event.detail)

    let str = `rules[${event.detail.nameId}].score`
    this.setData({
      [str]: event.detail.value // 不需要反映到data，直接submit就好 // 但就算不了总分嘹
    })

    // wx.vibrateShort({
    //   type: "medium"
    // })
  },

  showmodal() {
    wx.showModal({
      title: this.properties.title,
      content: this.properties.detail,
      showCancel: false
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // let str = 'rules[1].score'
    // app.watch(this, {
    //   [str]: function (newVal) {
    //     console.log(newVal)
    //   }
    // })

  },
})