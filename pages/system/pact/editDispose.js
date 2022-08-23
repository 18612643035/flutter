var config = require('../../../config')
import toast from '../../../dist/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    log:'',
    contractPlanId:'',
    curpage:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if(_this.data.contractPlanId == ""){
      let id = JSON.parse(options.id);
      _this.setData({
        contractPlanId:id
      })
    }
    
    wx.request({
        url: config.service.pshowLog,    
        method:"GET",    
        header:{
          "content-type":"application/x-www-form-urlencoded",
          'Authorization': 'Bearer '+config.service.token,
        },
        data:{
          content:_this.data.log,
          contractPlanId:_this.data.contractPlanId,
          current:_this.data.curpage,
        },       
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              _this.setData({
                curpage:res.data.data.current,
                allData:_this.data.allData.concat(res.data.data.records),
              })
              console.log(_this.data.logData)
            }else{
              toast.fail('查询失败');
            }
        }
      });
  },
  formSubmit:function(e){
      console.log(e.detail);
      const _this = this;
      if(e.detail.value.content == ""){
        toast.fail('内容不能为空');
        return 
      }
      let data = {};
      data["content"] = e.detail.value.content;
      data["createTime"] = e.detail.value.createTime;
      data["contractPlanId"] = _this.data.contractPlanId;
      data["id"] = e.detail.value.contractPlanId;
      console.log(JSON.stringify(data));  
      wx.request({
        url: config.service.plog,  
        data: JSON.stringify(data),   
        method:"PUT",    
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
      },   
        success:function(res){ 
            console.log(res) 
            if(res?.data?.code == 0){
              toast.success('修改成功');
              _this.onLoad();
            }
            else{
              toast.fail(res.data.msg);
            } 
        }
      })
  },
  onReachBottom: function () { //下拉刷新
    app.onReach(this);
  },
})