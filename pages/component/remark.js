// pages/component/remark.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:''
  },
  inputChange: function (e) {//值改变时的赋值操作
    var val = e.detail.value
    this.setData({
      inputValue: val
    })
    this.triggerEvent('text', { textData: val })//子组件把实时的值传递给父组件
  },
})