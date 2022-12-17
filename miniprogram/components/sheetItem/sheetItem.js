// components/sheetItem/sheetItem.js
Component({
  /**
   * 组件的属性列表
   */
  behaviors: ['wx://form-field-group'], // 救命啊555
  properties: {

    nameId: {
      type: Number
    },
    title: {
      type: String
    },
    detail: {
      type: String
    },
    lang: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: ''
  },

  /**
   * 组件的方法列表
   */
  
  methods: {
    sliderChange(e) {
      this.triggerEvent('sliderChange', {
        value: e.detail.value,
        nameId: this.properties.nameId,
      })
    },

    showmodal() {
      wx.showModal({
        title: this.properties.title,
        content: this.properties.detail,
        showCancel: false
      })
    },

  }
})