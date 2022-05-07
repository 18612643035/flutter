var config = require('.././config');

/**
 * function: 封装网络请求
 * @url     URL地址
 * @params  请求参数
 * @method  GET/POST（请求方式）
 * @resolve 成功回调
 * @reject  失败回调
 */
function request(url, params, method, header, resolve, reject) {
  wx.showLoading({
    title: "加载中...",
    mask:true
  })
  wx.request({
    url: url, // 接口地址
    data: dealParams(params), // 請求參數
    method: method, // 請求方式
    header: header, // 請求頭
    success: (res) =>{
      wx.hideLoading(); // 關閉加載提示
      if (res.data) {
        // 判斷請求成功的狀態碼
        if (res.data.code == 0) {
          resolve(res);
        }else if(res.data.code == 401){
          rToken();
        }else {
          reject(res);
        }
      }
    },
    fail: function(error) {
      reject("");
    }
  })
}
 function rToken() { //刷新TOKEN
  let token = wx.getStorageSync('refresh_token');
  wx.request({
    url: `${config.service.login}`,
    data: {
      username: '',
      grant_type: 'refresh_token',
      smsCode: '',
      refresh_token: token
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
          title: 'token验证成功',
        })
      } else {
        wx.showToast({
          title: 'token验证失败',
        })
        wx.removeStorageSync('access_token');
        wx.navigateTo({
          url: '../login/login'
        })
      }

    },
    fail: function (res) {
      console.log(res)
    }
  })
}
/**
 * function: 請求時添加必帶的固定參數，沒有需求無需添加
 * @params   请求参数
*/
function dealParams(params) {
  return params = Object.assign({}, params, {
    // id: '666',
  })
}

// const apiService = {
//   //請求
//   REQUEST(url, params, method, header) {
//     return new Promise((resolve,reject) => {
//       request(url, params, method, header, resolve, reject);
//     })
//   }
// }

// 外部調用接口
module.exports = {
  goRequest: (e) => { // 获取首頁接口
    return new Promise((resolve,reject)=> {
     request(e.url, e.params, e.method, e.header, resolve, reject)
    })
  },
}