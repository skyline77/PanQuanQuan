// components/radioTimeline/radioTimeline.js

const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.loop = false
innerAudioContext.obeyMuteSwitch = false // 2.3.0以下版本



Component({
  lifetimes: { // 还有pageLifeTime
    ready: function () {


      innerAudioContext.src = this.data.audioUrl
      // console.log('组件得到的url：' + this.data.audioUrl + '来自audioTimeline')
      
      // setTimeout(() => {
      // }, 1) // 延时问题，但更好的解决办法是页面取完数据后通知组件

      innerAudioContext.onTimeUpdate(() => {
        // console.log('current time: ' + this.data.currentTime)
        // console.log('duration: ' + this.data.duration)
        // console.log('duration: ' + this.findIndexOfItem(this.data.times, this.data.currentTime))
        this.setData({
          timeString: this.fromSecondToHMS(innerAudioContext.currentTime),
          duration: innerAudioContext.duration,
          currentTime: innerAudioContext.currentTime,
          currentIndex: this.findIndexOfItem(this.data.times, this.data.currentTime)
        })



      })

      // console.log(this.properties.timeline)
      let times = this.properties.timeline.map(item => {
        let [minute, second] = item.time.split(':')
        let sec = Number(minute) * 60 + Number(second)
        // console.log('sec ' + sec)
        return sec
      })
      this.setData({
        times: times
      })


      // console.log(this.data.times)

    },
    detached: function () {
      this.pause()
      // console.log('detached')
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

    timeline: {
      type: Array
    },
    audioUrl: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    play_pause_src: '/images/play.png', //pause
    duration: 0,
    currentTime: 0,
    times: [],
    timeString: '0:0:0',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 若item介于数组arr的第i个元素和第i+1个元素，则返回i。或者说item大于arr第几个元素 // 默认大于第一个元素
    fromSecondToHMS(sec) {
      const min = Math.floor(sec % 3600)
      const HMS = Math.floor(sec / 3600) + ":" + Math.floor(min / 60) + ":" + Math.floor(sec % 60)
      return HMS
    },

    findIndexOfItem(arr, item) {
      for (let i = 0; i < arr.length; i++) {
        if (item < arr[i]) {
          return i
        }
      }
      return arr.length
    },

    play() {
      innerAudioContext.play();
      this.setData({
        play_pause_src: '/images/pause.png'
      })
      // console.log('audioContext.paused', innerAudioContext.paused)

    },

    pause() {
      innerAudioContext.pause();
      this.setData({
        play_pause_src: '/images/play.png'
      })
      // console.log('audioContext.paused', innerAudioContext.paused)
    },

    playAudio() {
      if (innerAudioContext.paused) {
        this.play()
      } else {
        this.pause()
      }
    },

    change(e) {
      innerAudioContext.seek(e.detail.value)
      // this.pause()
      this.play()
    },
  }
})