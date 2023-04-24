// info.js
const config = require('../../config.js')
const app = getApp();
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

    if (token) {
      wx.switchTab({
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
    console.log(this.data.send)
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
      success: function (res) {}
    })
    this.setData({
      alreadySend: true,
      send: false
    })
    this.timer()
  },

  timer: function () { //等待时间
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
        }, 1000)
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
  },

  // 按钮
  activeButton: function () {
    let {
      phoneNum,
      code
    } = this.data
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
		let _this = this;
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
				_this.setLogin(res);
      },
      fail: function (res) {
        wx.showToast({
          title: res,
        })
      }
    })
  },
	setLogin(res){
		if(res.data.code && res.data.code != 0){
			app.Toast(res.data.msg);
			return
		}
		else if(res.statusCode != 200){
			app.Toast(res.errMsg);
			return
		}

		if (res.data && res.data.access_token) {
		  wx.setStorageSync('access_token', res.data.access_token);
		  wx.setStorageSync('refresh_token', res.data.refresh_token);
		  config.service.token = res.data.access_token;
		  wx.switchTab({
		    url: '../home/home',
		    success: function (e) { //解决不刷新问题
		      var page = getCurrentPages().pop();
		      if (page == undefined || page == null) return;
		      page.onLoad();
		    }
		  })
		} else {
		}
	},
  getPhoneNumber(e) {
		let _this = this;
    console.log(e.detail.code)
		wx.request({
		  method: 'POST',
		  data: {
		    code: e.detail.code,
		    grant_type: 'wx_code',
		    //smsCode: code
		  },
		  url: config.service.login,
		  header: {
		    "Content-Type": "application/x-www-form-urlencoded",
		    // "Cookie": sessionId,
		    "Accpet": "application/json",
		    'Authorization': 'Basic dGVzdDp0ZXN0'
		  },
		  success: res => {
		    // 获取到用户的 openid
		    console.log("用户的openid:" + res.data.openid);
				_this.setLogin(res);
		  },fail: function (res) {
        wx.showToast({
          title: res,
        })
      }
		});
  }
})