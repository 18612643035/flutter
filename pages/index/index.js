// pages/index/index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var upFiles = require('../../utils/upFiles.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
      upFilesBtn:true,
      upFilesProgress:false,
      maxUploadLen:19,
      context:'',
      id:0,
      columns: ['1','2','3'],
  },
  onLoad: function () {
    const _this = this;
    wx.request({ 
      url: config.service.dict,  //获取客户信息  
      method:"GET",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          let col = [];
          for(let i=0;i<res.data.data.length;i++){
            col.push({"text":res.data.data[i].name,"id":res.data.data[i].id});
          }
            _this.setData({
                columns:col,
                id:col[0].id
            })
      }
    })
  },
  // 预览图片
  previewImg: function (e) {
      let imgsrc = e.currentTarget.dataset.presrc;
      let _this = this;
      let arr = _this.data.upImgArr;
      let preArr = [];
      arr.map(function(v,i){
          preArr.push(v.path)
      })
    //   console.log(preArr)
      wx.previewImage({
          current: imgsrc,
          urls: preArr
      })
  },
    // 删除上传图片 或者视频
  delFile:function(e){
     let _this = this;
     wx.showModal({
         title: '提示',
         content: '您确认删除嘛？',
         success: function (res) {
             if (res.confirm) {
                 let delNum = e.currentTarget.dataset.index;
                 let delType = e.currentTarget.dataset.type;
                 let upImgArr = _this.data.upImgArr;
                 let upVideoArr = _this.data.upVideoArr;
                 if (delType == 'image') {
                     upImgArr.splice(delNum, 1)
                     _this.setData({
                         upImgArr: upImgArr,
                     })
                 } else if (delType == 'video') {
                     upVideoArr.splice(delNum, 1)
                     _this.setData({
                         upVideoArr: upVideoArr,
                     })
                 }
                 let upFilesArr = upFiles.getPathArr(_this);
                 if (upFilesArr.length < _this.data.maxUploadLen) {
                     _this.setData({
                         upFilesBtn: true,
                     })
                 }
             } else if (res.cancel) {
                 console.log('用户点击取消')
             }
         }
     })
     
     
  },
  // 选择图片或者视频
  uploadFiles: function (e) {
      var _this = this;
      wx.showActionSheet({
          itemList: ['选择图片', '选择视频'],
          success: function (res) {
            //   console.log(res.tapIndex)
              let xindex = res.tapIndex;
              if (xindex == 0){
                  upFiles.chooseImage(_this, _this.data.maxUploadLen)
              } else if (xindex == 1){
                  upFiles.chooseVideo(_this, _this.data.maxUploadLen)
              }
              
          },
          fail: function (res) {
              console.log(res.errMsg)
          }
      })
  },
  bzInput:function(e){
    let _this = this;
    _this.setData({
        context:e.detail.value,
    })
  },
  onChange(event) {
    const { value } = event.detail;
    this.setData({
      id:value.id,
    })
  },
  // 上传文件
  subFormData:function(){
      let _this = this;
      let upData = {};
      let upImgArr = _this.data.upImgArr;
      let upVideoArr = _this.data.upVideoArr;
      _this.setData({
          upFilesProgress:true,
      })
      console.log("开始上传");
      if(!upImgArr  && !upVideoArr && _this.data.context == ""){
        wx.showToast({
            title: '不能上传空内容',
        })
        return;
      }
      wx.setStorageSync('time', new Date()); //测试本地存储
      console.log(wx.getStorageInfoSync("time"));
      upData['url'] = config.service;
      
      wx.request({
        url: upData.url.conText+"?customerId="+_this.data.id+"&content="+_this.data.context,  
        data:{'name':'admin','content':_this.data.context},   
        method:"POST",    
        header:{
            "Content-Type":"application/x-www-from-urlencoded",
            'Authorization': 'Bearer '+config.service.token,
        }, 
        success:function(res){ 
            console.log(res) 
            if(res.data.code == 0){
                if(res.data && res.data.data){
                    upData['formData'] = {"id":res.data.data};
                    upFiles.upFilesFun(_this, upData,function(res){
                        if (res.index < upImgArr.length){
                            upImgArr[res.index]['progress'] = res.progress
                            
                            _this.setData({
                                upImgArr: upImgArr,
                            })
                        }else{
                            let i = res.index - upImgArr.length;
                            upVideoArr[i]['progress'] = res.progress
                            _this.setData({
                                upVideoArr: upVideoArr,
                            })
                        }
                    }, function (arr) {
                        // success
                        wx.switchTab({
                            url: '../home/home',
                          })
                        console.log(arr)
                    })
                }
                wx.showToast({
                    title: '上传成功',
                    icon: "loading",
                    duration: 1000
                  })

            }
        }
      })
 
  }
})
