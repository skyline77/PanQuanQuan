//app.js


// 重要！
// 检查是否已经提交过了 正确实现promise


// sheet页 v.s. 居中
// myRadio mySheet 当数据大于20条，多次取回




/////////////////////////////////////////////////////////////////////
// 已解决

// 首页的每日手势，在iPad上比例不对

// 获取昵称并上传，openid比较抽象

// 电台显示 分:秒。 // 有computed多好啊
// 根据已经播放的时间，高亮时间轴。很帅
// 退出页面后，停止播音

// 中间两页，底部留空。 // iOS最后一个元素无法设置margin-bottom，真垃圾

// 先获得radioId（push的或favor的），再获得coverImage
// 统一导航栏图标大小 且切换到时会有颜色

// 通过promise，使learnPage 标题和内容同步更新，且显示wx.showLoading

// 如何保证宽度为100%width的情况下，等比例设置高度？ object-fit？ 上传图片 提供 width 100% 75% 50%
// https://zihua.li/2013/12/keep-height-relevant-to-width-using-css/
// 妈的小程序用CSS方式解决不了，用image的mode解决

// 滑动会有震动反馈  // 不能像vue深度监听，算了

// 判断是否登录，获取授权 // 不用登陆即可获得用户id 最佳实践：在真正需要使用授权接口时，才向用户发起授权申请

// 优化promise，链式 // return最后一项就行，但似乎还没有之前好看

// radioText 应该用template。 // triggerEvent 和 behaviors: ['wx://form-field-group'] 太麻烦 不过组件也麻烦
// 表单验证：若1分及以下，给出20字以上理由 不存在空值（赛事名称可以）  // WxValidate 这个太麻烦了，自己写验证

// 页面取到数据后，通知组件更新audio.url // 似乎不用通知，直接拿就行？


// 提交完后跳转回首页吧

// swiper 鬼畜

// 减少不必要的 var that = this 箭头函数不会创建自己的this,它只会从自己的作用域链的上一层继承this，因此不需要var that = this

// 统一 radioText和learnPage

App({
  onLaunch: function () {
    wx.setInnerAudioOption({
        obeyMuteSwitch: false
      })
      .catch(e => {
        console.log(e)
        console.log('↑不用管他')
      }) // 开发者工具暂时不支持此 API 调试，请使用真机进行开发  ← 妈的我以为是什么bug

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}
  },

  // watch: function (ctx, obj) {
  //   Object.keys(obj).forEach(key => {
  //     this.observer(ctx.data, key, ctx.data[key], function (value) {
  //       obj[key].call(ctx, value)
  //     })
  //   })
  // },
  // // 监听属性，并执行监听函数
  // observer: function (data, key, val, fn) {
  //   Object.defineProperty(data, key, {
  //     configurable: true,
  //     enumerable: true,
  //     get: function () {
  //       return val
  //     },
  //     set: function (newVal) {
  //       if (newVal === val) return
  //       fn && fn(newVal)
  //       val = newVal
  //     },
  //   })
  // }
})