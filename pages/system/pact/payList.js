var config = require('../../../config')
import toast from '../../../dist/toast/toast';
var util = require('../../../utils/util');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    show:false,
    details:[],
    status:'0',
    columns: [{"text":"未付款","status":0},{"text":"已付款","status":1}],
    minHour: 10,
    maxHour: 20,
    minDate: new Date(2000, 10, 1).getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    remarks:'',
    options:'',
    curpage:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let db;
    if(options){
      _this.setData({
        options:options,
      })
      db = options;
    }
    else{
      db = _this.data.options
    }
    let id = JSON.parse(db.list);
    wx.request({
      url: config.service.pay,    
      method:"GET",
      data:{
        current:_this.data.curpage,
      },     
      header:{
        "content-type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer '+config.service.token,
      },
      data:{
        contractId:id
      },     
      success:function(res){ 
        if(res.data?.data?.records){
            toast.success('查询成功');
            let db =  app.filter(res.data.data.records);
            _this.setData({
              curpage:res.data.data.current,
              allData:_this.data.allData.concat(db),
          })
        }
        else{
          toast.fail(res.data.msg);
        }  
      }
    })
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  onChange(event) {
    this.setData({
      status:event.detail,
    })
    console.log(event.detail)
  },
  showPopup:function(e){
    let index = e.target.dataset.index;
    console.log(e.target)
    this.setData({
        details:this.data.allData[index],
        show:true,
        status:''+this.data.allData[index].status,
    })
    // let picker = this.selectComponent(".picker");
    // picker.setColumnIndex(0,this.data.allData[index].status); //设置默认索引
    console.log(this.data.status)
  },
  inputChange: function (e) {
    var val = e.detail.value
    this.setData({
      remarks: val
    })
  },
  edit:function(e){
    let _this = this;
    // if(_this.data.remarks == ""){
    //   toast.fail('内容不能为空');
		// 	return
    // }
    wx.request({
      url: config.service.updatePayStatus,    
      method:"POST",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },
      data:{
        id:_this.data.details.id,
        status:_this.data.status,
        amount:_this.data.details.amount,
        contractId:_this.data.details.contractId,
        createBy:_this.data.createBy,
        createTime:_this.data.details.createTime,
        planTime:_this.data.details.planTime,
        updateBy:_this.data.updateBy,
        updateTime:_this.data.details.updateTime == "无" ? "": _this.data.details.updateTime,
        actualTime:util.formatTime(new Date(_this.data.currentDate)),
        remarks:_this.data.remarks,

      },    
      success:function(res){ 
          console.log(res) 
          if(res.data.code == 0){
            toast.success('成功');
            setTimeout(() => {
              _this.onLoad(); 
            },1000);
          }
      }
    })
  },
  onReachBottom: function () { //下拉刷新
    app.onReach(this);
  }
})