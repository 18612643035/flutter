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
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
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

      wx.setStorageSync('time', new Date()); //测试本地存储
      console.log(wx.getStorageInfoSync("time"));
      upData['url'] = config.service;
      
      wx.request({
        url: upData.url.conText+"?name=admin&content="+_this.data.context,  
        data:{'name':'admin','content':_this.data.context},   
        method:"POST",    
        header:{
            "Content-Type":"application/x-www-from-urlencoded",
            "Accpet": "application/json"
        },   
        success:function(res){ 
            console.log(res) 
            console.log(res.data)
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
                  //   console.log(res)
                }, function (arr) {
                    // success
                    console.log(arr)
                })
            }
        }
      })
 
  }
})
