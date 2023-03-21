// pages/system/pact/toPending.js
var config = require('../../../config');
var util = require('../../../utils/util');
import toast from '../../../dist/toast/toast';
let app = getApp();
Page({
  onShareAppMessage() {
    return {
      title: 'radio',
      path: 'page/component/pages/radio/radio'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    details:[],
    finish:{
      infoDeptContact: '',
      infoDeptPhone: '',
      deptName: '',
      deptContact: '',
      deptPhone: '',
      finishTime: '',
    },
    addData:{
      number:"",
      remarks:"",
    },
    editData:{},
    isShow:false,
    show:false,
    show3:false,
    installShow:false,
    finishShow:false,
    pshow:false,
    finishContent:'',
    finishTime:'',
    status:0,
    log:'',
    input:"",
    input2:"",
    input3:"",
    time:'',
    time2:'',
    time3:'',
    curpage:1,
    device_type:'',
    minHour: 10,
    maxHour: 20,
    minDate: new Date(2000, 10, 1).getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    }
  },
  onInput(event) {
    this.setData({
      input: event.detail,
    });
    console.log(util.formatTime(new Date(event.detail)));
  },
  onInput3(event) {
    this.setData({
      input3: event.detail,
    });
    console.log(util.formatTime(new Date(event.detail)));
  },
  onInput2(event) {
    this.setData({
      input2: event.detail,
    });
    console.log(util.formatTime(new Date(event.detail)));
  },
  cmtTime(e){
    if(this.data.show3){
      this.setData({
        'editData.setupTime':util.formatTime2(new Date(this.data.input))
      })
    }else{
      this.setData({
        time:util.formatTime2(new Date(this.data.input))
      })
    }
  },
  cmtTime3(e){
    this.setData({
      time3:util.formatTime2(new Date(this.data.input3))
    })
  },
  cmtTime2(e){
    if(this.data.show3){
      this.setData({
        'editData.trainTime':util.formatTime2(new Date(this.data.input2))
      })
    }else{
      this.setData({
        time2:util.formatTime2(new Date(this.data.input2))
      })
    }
  },
  onTime(e){
    this.setData({
      installShow:true
    })
  },
  onTime2(e){
    this.setData({
      show:true
    })
  },
  onTime3(e){
    this.setData({
      finishShow:true
    })
  },
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.pactPending,    
        method:"GET",
        data:{
          current:_this.data.curpage,
        },     
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              res.data.data.records.length?toast.success('查询成功'):toast.success('暂无更多数据');
              let db =  app.filter(res.data.data.records);
              _this.setData({
                  curpage:res.data.data.current,
                  allData:_this.data.allData.concat(db),
                  device_type:config.device_type
              })
              console.log(_this.data)
            }
            else{
              toast.fail(res.data.msg);
            }  
        }
      })
  },
  getUserInfo: function(e){//完成合同
    let _this = this;
    let data = {};
    data["id"] = Number(_this.data.details.id);
    data["address"] = _this.data.finish.address ? _this.data.finish.address : _this.data.details.address;
    data["infoDeptContact"] = _this.data.finish.infoDeptContact ? _this.data.finish.infoDeptContact : _this.data.details.infoDeptContact;
    data["infoDeptPhone"] = _this.data.finish.infoDeptPhone ? _this.data.finish.infoDeptPhone : _this.data.details.infoDeptPhone;
    data["deptName"] = _this.data.finish.deptName ? _this.data.finish.deptName : _this.data.details.deptName;
    data["deptContact"] = _this.data.finish.deptContact ? _this.data.finish.deptContact : _this.data.details.deptContact;
    data["deptPhone"] = _this.data.finish.deptPhone ? _this.data.finish.deptPhone : _this.data.details.deptPhone;
    data["finishTime"] = _this.data.time3;
    const db =[{text:'地址',value:data.address,},{text:'完成时间',value:data.finishTime}];
    let isCheck =  config.check.verify(db);
    if(!isCheck) return;
    
    wx.request({
        url: config.service.contractPlan,    
        method:"POST", 
        data:JSON.stringify(data),   
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res?.data?.code == 0){
              toast.success('完成');
              setTimeout(() => {
                _this.onLoad(); 
              },1000);
            }
            else{
              toast.fail(res.data.msg);
            }  
        }
      })
  },
  inputSetData(e){
      let db = this.data.finish;
      db[e.target.dataset.name] = e.detail.value
      this.setData({
        finish:db
      })
  },
  inputSetData2(e){
    let db = this.data.addData;
    db[e.target.dataset.name] = e.detail.value
    this.setData({
      addData: db
    })
},
  inputSetData3(e){
    let db = this.data.editData;
    db[e.target.dataset.name] = e.detail.value
    this.setData({
      editData: db
    })
  },
  inputChange: function (e) {
    var val = e.detail.value
    this.setData({
      finishContent: val
    })
  },
  // showPopup:function(e){
  //   let index = e.target.dataset.index;
  //   this.setData({
  //       details:this.data.allData[index],
  //       show:true,
  //   })
  // },
  showPopup2:function(e){
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        show2:true,
        time:'',
        time2:''
    })
  },
  showLog2:function(e){ //查询设备
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
    })
    let _this = this;
    wx.request({
        url: config.service.showDev,    
        method:"GET",    
        header:{
          "content-type":"application/x-www-form-urlencoded",
          'Authorization': 'Bearer '+config.service.token,
        },
        data:{
          current:1,
          installId:_this.data.details.id,
          size:200
        },       
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              _this.setData({
                LOG:res.data.data.records,
                showLog2:true
              })
              console.log(_this.data.logData)
            }else{
              toast.fail('查询失败');
            }
        }
      });
  },
   //新增设备
   addLog2:function(e){
    let _this = this;
    const db =[{text:'设备编号',value:_this.data.addData.number,},{text:'安装时间',value:_this.data.time},{text:'培训时间',value:_this.data.time2}];
    let isCheck =  config.check.verify(db);
    if(!isCheck) return;
    wx.request({
      url: config.service.deleteDev,    
      method:"POST",
      data:{
        installId:_this.data.details.id,
        type:_this.data.details.type,
        number:_this.data.addData.number,
        notes:_this.data.addData.remarks,
        setupTime: util.formatTime2(new Date(_this.data.time)),
        trainTime: util.formatTime2(new Date(_this.data.time2)),
        contractId:_this.data.details.contractId
      },   
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          if(res.code == 0){
            toast.success('新增成功');
            _this.setData({show2:false})
           }
           else{
            toast.fail(res.data.msg);
          }
     }
    })
  },
  onEditClose:function(e){
      this.setData({ show3: false });
  },
  //提交编辑
  cmtEdit:function(e) {
    let _this = this;
    const db =[{text:'设备编号',value:_this.data.editData.number},{text:'安装时间',value:_this.data.editData.setupTime},{text:'培训时间',value:_this.data.editData.trainTime}];
    let isCheck =  config.check.verify(db);
    if(!isCheck) return;
    wx.request({
      url: config.service.deleteDev,    
      method:"PUT",
      data:{
        contractId:_this.data.editData.contractId,
        notes:_this.data.editData.notes,
        number:_this.data.editData.number,
        setupTime:_this.data.editData.setupTime,
        trainTime:_this.data.editData.trainTime,
        type:_this.data.editData.type,
        installId:_this.data.editData.installId,
        id:_this.data.editData.id
      }, 
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      }, 
      success:function(res){ 
          console.log(res) 
          if(res.data.code == 0){
            toast.success('编辑成功');
          }
          else{
            toast.fail(res.data.msg);
          }
          _this.setData({ show3: false });
      }
    })
  },
  //编辑设备
  editDevice:function(e){
    let _this = this;
    let index = e.target.dataset.index;
    console.log(this.data.LOG[index])
    this.setData({
        editData: this.data.LOG[index],
        showLog2:false,
        show3:true
    })
  },
  delete2:function(e){ //删除设备
    let _this = this;
    let id = e.target.dataset.id;
    wx.request({
      url: config.service.deleteDev+'/'+id,    
      method:"DELETE", 
      header:{
        "content-type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          if(res.data.code == 0){
            toast.success('删除成功');
            _this.setData({ showLog2: false });
          }
          else{
            toast.fail(res.data.msg);
          }
      }
    })
  },
  //新增弹框组件传递的值
  // onLog:function(e){
  //   e.detail.textData
  //   this.setData({
  //     log:e.detail.textData,
  //   })
  // },
  showPop(e) {//完成任务
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        pshow:true,
    })
  },
  onReachBottom: function () { //下拉刷新
    app.onReach(this);
  }
})