var config = require('../../../config')
import toast from '../../../dist/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData: [],
    log: '',
    maintenanceId: '',
    curpage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if (_this.data.maintenanceId == "") {
      let id = JSON.parse(options.id);
      _this.setData({
        maintenanceId: id
      })
    }
    wx.request({
      url: config.service.showLog,
      method: "GET",
      header: {
        "content-type": "application/x-www-form-urlencoded",
        'Authorization': 'Bearer ' + config.service.token,
      },
      data: {
        content: _this.data.log,
        maintenanceId: id,
        size: 20,
        current: _this.data.curpage,
      },
      success: function (res) {
        console.log(res)
        if (res.data?.data?.records) {
          _this.setData({
            curpage: res.data.data.current,
            allData: _this.data.allData.concat(res.data.data.records),
          })
          console.log(_this.data.logData)
        } else {
          toast.fail('查询失败');
        }
      }
    });
  },
  formSubmit: function (e) {
    console.log(e.detail);
    const _this = this;
    if (_this.data.content == "") {
      toast.fail('内容不能为空');
      return
    }
    let data = {};
    data["content"] = e.detail.value.content;
    data["createTime"] = e.detail.value.createTime;
    data["maintenanceId"] = _this.data.maintenanceId;
    data["id"] = e.detail.value.maintenanceId;
    console.log(JSON.stringify(data));
    wx.request({
      url: config.service.log,
      data: JSON.stringify(data),
      method: "PUT",
      header: {
        "content-type": "application/json",
        'Authorization': 'Bearer ' + config.service.token,
      },
      success: function (res) {
        console.log(res)
        if (res?.data?.code == 0) {
          toast.success('修改成功');
        } else {
          toast.fail(res.data.msg);
        }
      }
    })
  },
  onReachBottom: function () { //下拉刷新
    app.onReach(this);
  },
})