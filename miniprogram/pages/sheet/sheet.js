// pages/learn/laern.js

const app = getApp()
const db = wx.cloud.database()

const text_zh = {
  title: '飞盘精神评分表',
  gameName: '赛事名',
  gameDate: '比赛日期',
  myTeam: '我方队伍',
  enemyTeam: '对方队伍',
  totalScore: '总分',
  yourComment: '你的评论',
  submit: '提交',
  formIncomplete: '表单未完成'
}

const text_en = {
  title: 'Spirit of the Game Score Sheet',
  gameName: 'Game Name',
  gameDate: 'Date',
  myTeam: 'Your Team\'s Name',
  enemyTeam: 'Opponent',
  totalScore: 'Total',
  yourComment: 'Your Comment',
  submit: 'Submit',
  formIncomplete: 'Form Incomplete'
}

const rules_zh = [{
  title: '规则的理解与使用',
  detail: "他们是否故意违反了规则。\r\n他们是否遵守时间规则。\r\n当他们不清楚规则时是否愿意去了解学习。",
  score: 2,
},
{
  title: '犯规和身体接触',
  detail: "他们是否避免了犯规，身体接触和危险动作。",
  score: 2,
},
{
  title: '公平竞争的意识',
  detail: "他们是否在合适的场景下提醒队友取消错误/非必要的Call并为之道歉。\r\n他们是否只Call必要的Call。",
  score: 2,
},
{
  title: '积极的态度与自我控制',
  detail: "他们是否礼貌。\r\n他们是否无论比分多少都保持着合适的比赛强度。\r\n他们是否在比赛前中后都留下了积极的印象。",
  score: 2,
},
{
  title: '交流',
  detail: "他们是否尊敬有礼地与我们沟通。\r\n他们是否认真倾听我们的陈述。\r\n他们是否遵守讨论限时。",
  score: 2,
}
]


const rules_en = [{
  title: 'Rules Knowledge and Use',
  detail: "They did not purposefully misinterpret the rules. They kept to time limits. When they didn't know the rules they showed a real willingness to learn.",
  score: 2,
},
{
  title: 'Fouls and Body Contact',
  detail: "They avoided fouling, contact, and dangerous plays.",
  score: 2,
},
{
  title: 'Fair-Mindedness',
  detail: "They apologized in situations where it was appropriate, informed teammates about wrong/unnecessary calls. Only called significant breaches.",
  score: 2,
},
{
  title: 'Positive Attitude and Self-Control',
  detail: "They were polite. They played with appropriate intensity irrespective of the score. They left an overall positive impression during and after the game.",
  score: 2,
},
{
  title: 'Communication',
  detail: "They communicated respectfully. They listened. They kept to discussion time limits.",
  score: 2,
}
]

Page({


  data: {
    date: '2021-01-01', // 原来字符串才是正确的实现方式，而不是Date
  },

  async onSubmit2() { // 还不能由 <form bindsubmit='onSubmit'> 发起。。
    if (!this.data.profile) {
      wx.getUserProfile({ // getUserProfile不能作为回调，要第一个调用，否则不认他是通过user tap出发
        desc: (this.data.lang === 'zh' ? '获取昵称' : 'obtain your nickname'),
        success: res => {
          this.setData({ profile: res.userInfo })
          wx.showModal({
            title: (this.data.lang === 'zh' ? '授权成功' : 'Authorization success'),
            showCancel: false,
            content: (this.data.lang === 'zh' ? '请再点一次“提交”' : 'please submit again.')
          })
        },
        fail: () => {
          wx.showToast({
            icon: 'error',
            title: (this.data.lang === 'zh' ? '用户取消授权' : 'authorization denied.')
          })
        }
      })
    }
  },

  // 正确实现onSubmit，但由于小程序有bug，使用了另一种trick
  // async onSubmit(e) {
  //   try {



  //     // 表单验证
  //     let mode = 'add'

  //     // 是否填写赛事名及双方队伍
  //     if (e.detail.value.myTeam === '' || e.detail.value.enemyTeam === '' || e.detail.value.gameName === '') {
  //       throw { passive: true, message: (this.data.lang === 'zh' ? '未填写赛事名及双方队伍' : 'game name & team name incompleted.') }
  //       // throw new Error( '未填写赛事名及双方队伍' )
  //     }

  //     // 若打分不为2，需要10字以上评论

  //     for (const index of [0, 1, 2, 3, 4]) {
  //       if (this.data.rules[index].score !== 2 &&
  //         e.detail.value['comment' + index].length < 10) {
  //         throw {
  //           passive: true, message: (this.data.lang === 'zh' ? `“${index + 1}. ${this.data.rules[index].title}”评分不为2，需要10字以上评论`
  //             : `"${index + 1}. ${this.data.rules[index].title}" is not scored at 2, comment more than 5 words needed.`)
  //         }
  //         // throw new Error( `“${index + 1}. ${this.data.rules[index].title}”评分为${this.data.rules[index].score}，需要10字以上评论`)
  //       }
  //     }

  //     // 获取用户信息
  //     if (!this.data.profile) { // 若还未有用户数据
  //       // console.log("wx.getUserProfile: ", !!wx.getUserProfile)
  //       const userProfile = await wx.getUserProfile({ desc: this.data.lang === 'zh' ? '获取昵称' : 'obtain your nickname' })
  //       // 若getUserProfile拒绝 会自动 throw，不用if
  //       this.setData({ profile: userProfile.userInfo })
  //       console.log(userProfile)
  //     }

  //     // 是否曾经上传过同一场比赛的评分（相同赛事名、日期、双方队伍）
  //     const sameSheet = await db.collection('sheet')
  //       .where({
  //         enemyTeam: e.detail.value.enemyTeam,
  //         myTeam: e.detail.value.myTeam,
  //         gameName: e.detail.value.gameName,
  //         date: e.detail.value.date
  //       })
  //       .get()

  //     if (sameSheet.data.length > 0) {    // 是否已经上传过该场比赛的评价
  //       const isConfirm = await wx.showModal({
  //         title: (this.data.lang === 'zh' ? '已评价该场比赛' : 'Game\'ve been Scored'),
  //         content: (this.data.lang === 'zh' ? '您已经评价过该场比赛，是否更新评价' : 'you\'ve scored this game, would you like to update your score?'),
  //       })

  //       if (isConfirm.cancel) {    // 不上传重复表单
  //         throw { passive: false, message: this.data.lang === 'zh' ? '不重复评价比赛' : 'update canceled' }
  //         // throw new Error('用户不上传重复表单')
  //       }
  //       else {
  //         mode = 'update'
  //       }
  //     }









  //     // 上传数据
  //     const formData = {
  //       enemyTeam: e.detail.value.enemyTeam,
  //       myTeam: e.detail.value.myTeam,
  //       gameName: e.detail.value.gameName,
  //       date: e.detail.value.date,
  //       totalScore: this.data.rules[0].score + this.data.rules[1].score + this.data.rules[2].score + this.data.rules[3].score + this.data.rules[4].score,
  //       nickName: this.data.profile.nickName,
  //       updateDate: new Date(),
  //       scores: this.data.rules.map(obj => obj.score),
  //       comments: [e.detail.value.comment0, e.detail.value.comment1, e.detail.value.comment2, e.detail.value.comment3, e.detail.value.comment4]
  //     }

  //     if (mode === 'update') {
  //       const remove = await db.collection('sheet')
  //         .where({
  //           enemyTeam: e.detail.value.enemyTeam,
  //           myTeam: e.detail.value.myTeam,
  //           gameName: e.detail.value.gameName,
  //           date: e.detail.value.date
  //         })
  //         .remove()

  //       console.log('更新记录数：', remove.stats.removed)
  //     }

  //     await db.collection('sheet')
  //       .add({
  //         data: formData
  //       })

  //     wx.showToast({
  //       title: mode === 'add' ? (this.data.lang === 'zh' ? '提交成功' : 'Submit Success') : (this.data.lang === 'zh' ? '更新成功' : 'Update Success'),
  //     })

  //     setTimeout(() => {
  //       wx.switchTab({
  //         url: '/pages/index/index'
  //       })
  //     }, 1500)


  //   } catch (err) {
  //     console.log(err.message || err)

  //     if (err.passive) { // 用户预料外的err
  //       wx.showModal({
  //         // cancelColor: 'cancelColor',
  //         showCancel: false,
  //         title: (this.data.lang === 'zh' ? '表单未完成' : 'Form Incomplete'),
  //         content: err.message || err.errMsg || (this.data.lang === 'zh' ? '提交失败' : 'Submit Fail'),
  //       })
  //     } else { // 主动选择的err
  //       wx.showToast({
  //         icon: 'error',
  //         title: err.message || err.errMsg || (this.data.lang === 'zh' ? '提交失败' : 'Submit Failed'),
  //       })
  //     }
  //   }
  // },
  
  // trick 方式实现 onSubmit, 此时还需要使用 onSubmit2
  async onSubmit(e) {
    if (!this.data.profile) {
      return
    }

    try {


      let mode = 'add'

      // 是否填写赛事名及双方队伍
      if (e.detail.value.myTeam === '' || e.detail.value.enemyTeam === '' || e.detail.value.gameName === '') {
        throw { passive: true, message: (this.data.lang === 'zh' ? '未填写赛事名及双方队伍' : 'game name & team name incompleted.') }
        // throw new Error( '未填写赛事名及双方队伍' )
      }

      // 若打分为0，需要10字以上评论

      for (const index of [0, 1, 2, 3, 4]) {
        if (this.data.rules[index].score !== 2 &&
          e.detail.value['comment' + index].length < 10) {
          throw {
            passive: true, message: (this.data.lang === 'zh' ? `“${index + 1}. ${this.data.rules[index].title}”评分不为2，需要10字以上评论`
              : `"${index + 1}. ${this.data.rules[index].title}" is not scored at 2, comment more than 5 words needed.`)
          }
          // throw new Error( `“${index + 1}. ${this.data.rules[index].title}”评分为${this.data.rules[index].score}，需要10字以上评论`)
        }
      }

      // 是否曾经上传过同一场比赛的评分（相同赛事名、日期、双方队伍）
      const sameSheet = await db.collection('sheet')
        .where({
          enemyTeam: e.detail.value.enemyTeam,
          myTeam: e.detail.value.myTeam,
          gameName: e.detail.value.gameName,
          date: e.detail.value.date
        })
        .get()

      if (sameSheet.data.length > 0) {    // 是否已经上传过该场比赛的评价
        const isConfirm = await wx.showModal({
          title: (this.data.lang === 'zh' ? '已评价该场比赛' : 'Game\'ve been Scored'),
          content: (this.data.lang === 'zh' ? '您已经评价过该场比赛，是否更新评价' : 'you\'ve scored this game, would you like to update your score?'),
        })

        if (isConfirm.cancel) {    // 不上传重复表单
          throw { passive: false, message: (this.data.lang === 'zh' ? '已评价该场比赛' : 'update canceled') }
          // throw new Error('用户不上传重复表单')
        }
        else {
          mode = 'update'
        }
      }









      // 上传数据
      const formData = {
        enemyTeam: e.detail.value.enemyTeam,
        myTeam: e.detail.value.myTeam,
        gameName: e.detail.value.gameName,
        date: e.detail.value.date,
        totalScore: this.data.rules[0].score + this.data.rules[1].score + this.data.rules[2].score + this.data.rules[3].score + this.data.rules[4].score,
        nickName: this.data.profile.nickName,
        updateDate: new Date(),
        scores: this.data.rules.map(obj => obj.score),
        comments: [e.detail.value.comment0, e.detail.value.comment1, e.detail.value.comment2, e.detail.value.comment3, e.detail.value.comment4]
      }

      if (mode === 'update') {
        const remove = await db.collection('sheet')
          .where({
            enemyTeam: e.detail.value.enemyTeam,
            myTeam: e.detail.value.myTeam,
            gameName: e.detail.value.gameName,
            date: e.detail.value.date
          })
          .remove()

        console.log('更新记录数：', remove.stats.removed)
      }



      await db.collection('sheet')
        .add({
          data: formData
        })


      // if (mode === 'add') {
      //   await db.collection('sheet')
      //     .add({
      //       data: formData
      //     })
      // } else {  // 好像update不对
      //   await db.collection('sheet')
      //     .where({ 
      //       enemyTeam: e.detail.value.enemyTeam,
      //       myTeam: e.detail.value.myTeam,
      //       gameName: e.detail.value.gameName,
      //       date: e.detail.value.date
      //     })
      //     .update({
      //       data: formData
      //     })
      // }



      wx.showToast({
        title: mode === 'add' ? (this.data.lang === 'zh' ? '提交成功' : 'Submit Success') : (this.data.lang === 'zh' ? '更新成功' : 'Update Success'),
      })

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }, 1500)


    } catch (err) {
      console.log(err.message || err)

      if (err.passive) { // 用户预料外的err
        wx.showModal({
          // cancelColor: 'cancelColor',
          showCancel: false,
          title: (this.data.lang === 'zh' ? '表单未完成' : 'Form Incomplete'),
          content: err.message || err.errMsg || (this.data.lang === 'zh' ? '提交失败' : 'Submit Fail'),
        })
      } else { // 主动选择的err
        wx.showToast({
          icon: 'error',
          title: err.message || err.errMsg || (this.data.lang === 'zh' ? '提交失败' : 'Submit Failed'),
        })
      }
    }
  },

  bindDateChange(event) { // 从form可以一起提交。但没法显示“总分"
    // console.log(event.detail.value) 
    this.setData({
      date: event.detail.value, // 格式不太一样 是不是用Date Object更好
    })
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





  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const systemInfo = await wx.getSystemInfo()
    const lang = systemInfo.language.slice(0, 2)
    this.setData({
      lang: lang, // zh or en
    })
    if (this.data.lang == 'zh') {
      this.setData({
        text: text_zh,
        rules: rules_zh
      })
    }
    else {
      this.setData({
        text: text_en,
        rules: rules_en
      })
    }

    // let str = 'rules[1].score'
    // app.watch(this, {
    //   [str]: function (newVal) {
    //     console.log(newVal)
    //   }
    // })

  },

  onShareAppMessage() {
  },
  onShareTimeline() {
  },
})