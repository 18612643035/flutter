// info.js
const config = require('../../config.js')
 
Page({
  data: {
    send: false,
    alreadySend: false,
    second: 60,
    disabled: true,
    buttonType: 'default',
    phoneNum: '',
    code: '',
  },
  onShow: function () {
    let token = wx.getStorageSync('access_token');
    console.log(token);
    if(token){
      wx.navigateTo({
        url: '../home/home'
      })  
    }
  },
// 手机号部分
  inputPhoneNum: function (e) {
    let phoneNum = e.detail.value
    if (phoneNum.length === 11) {
      let checkedNum = this.checkPhoneNum(phoneNum)
      if (checkedNum) {
        this.setData({
          phoneNum: phoneNum
        })
        console.log('phoneNum' + this.data.phoneNum)
        this.showSendMsg()
        this.activeButton()
      }
    } else {
      this.setData({
        phoneNum: ''
      })
      this.hideSendMsg()
    }
  },
 
  checkPhoneNum: function (phoneNum) {
    let str = /^1\d{10}$/
    if (str.test(phoneNum)) {
      return true
    } else {
      wx.showToast({
        title: '手机号不正确',
      })
      return false
    }
  },
 
  showSendMsg: function () {
    if (!this.data.alreadySend) {
      this.setData({
        send: true,
      })
    }
  },
 
  hideSendMsg: function () {
    this.setData({
      send: false,
      disabled: true,
      buttonType: 'default'
    })
  },
 
  sendMsg: function () {
    var phoneNum = this.data.phoneNum;
    wx.request({
      url: `${config.service.phone}`,
      data: {
        phone: phoneNum
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
      }
    })
    this.setData({
      alreadySend: true,
      send: false
    })
    this.timer()
  },
 
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
 
// 验证码
  addCode: function (e) {
    this.setData({
      code: e.detail.value
    })
    this.activeButton()
    console.log('code' + this.data.code)
  },
 
 // 按钮
  activeButton: function () {
    let {phoneNum, code} = this.data
    console.log(code)
    if (phoneNum && code) {
      this.setData({
        disabled: false,
        buttonType: 'primary'
      })
    } else {
      this.setData({
        disabled: true,
        buttonType: 'default'
      })
    }
  },
 
  onSubmit: function () {
    var phoneNum = this.data.phoneNum;
    var code = this.data.code;
   // var sessionId = wx.getStorageSync('sessionId');
    wx.request({
      url: `${config.service.login}`,
      data: {
        username: phoneNum,
        grant_type: 'sms_code',
        smsCode: code
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
       // "Cookie": sessionId,
        "Accpet": "application/json",
        'Authorization': 'Basic dGVzdDp0ZXN0'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
 
        if (res.data && res.data.access_token) {
          wx.setStorageSync('access_token', res.data.access_token);
          wx.setStorageSync('refresh_token', res.data.refresh_token);
          config.service.token = res.data.access_token;
          wx.showToast({
            title: '验证成功',
            icon: 'success'
          });
          wx.switchTab({
            url: '../home/home'
          })  
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})