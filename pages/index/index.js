var config = require('../../config')
var upFiles = require('../../utils/upFiles.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      context:'',
      userName:'',
      searchText:{},
      isShow:false,
      value:'',
      dealerDict:[],
      menus:[
        { text: '选择客户', value: 1 },
        { text: '新增潜在客户', value: 2 },
        { text: '选择经销商', value: 3 },
      ],
      province:[],
      cityDict:[],
      orgProvince:'',
      orgCity:'',
      option2:[],
      menuValue:1,
      orgName:'',
      orgId:'',
      upfilesUrl:'',
      submitUrl:'',
			fileList: [],
  },
  cityAlter: function(e) {
    this.setData({
      orgCity:e.detail
    })
  },
  provinceAlter: function(e) {
    const _this = this;
    _this.setData({
      orgProvince:e.detail
    })
    wx.request({ 
      url: config.service.cityDict,  //获取城市地区  
      method:"GET",    
      data:{provinceCode:e.detail},
      header:{
        "content-type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          let arr = app.menuFormat(res.data.data);
          arr.unshift({value:"",text:"请选择市"})
          _this.setData({
            cityDict:arr,
          })
      }
    })
  },
  menuChange: function(e) {
    this.setData({
       menuValue:e.detail,
       userName:'',
       orgName:'',
       orgId:'',
       orgCity:'',
       orgProvince:''
    })
  },
  dealerChange: function(e) {
    this.setData({
      orgName:e.detail,
      orgId:''
   })
  },
  onLoad: function (data) {
    const _this = this;
    let list = JSON.parse(data.list);
    _this.setData({
      upfilesUrl: list.upfilesUrl,
      submitUrl: list.submitUrl
    })
    wx.request({ 
      url: config.service.provinceDict,  //获取省份地区  
      method:"GET",    
      header:{
        "content-type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          let arr = app.menuFormat(res.data.data);
          arr.unshift({value:"",text:"请选择省"});
          _this.setData({
            province:arr,
          })
      }
    })
    wx.request({ 
      url: config.service.dealerDict,  //获取经销商信息  
      method:"GET",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          let arr = app.menuFormat(res.data.data);
          arr.unshift({value:"",text:"请选择经销商"})
          _this.setData({
            dealerDict:arr,
          })
      }
    })
  },
  onClick(e) {
    let _that = this;
    this.setData({
      value:e.target.dataset.value,
      isShow:false,
      orgId:e.target.dataset.id,
      orgName:e.target.dataset.value
    })
  },
  bzInput:function(e){
    let _this = this;
    let key =  e.target.dataset.name;
    _this.setData({
        [key]:e.detail.value,
    })
  },
  userChange(e) { //模糊查询
    let _that = this;
    if(e.detail != ''){
      this.setData({
        value: e.detail,
        isShow: true
      });
      
      wx.request({
        url: config.service.userSearch,  
        data: {name:e.detail},   
        method:"get",    
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
      },   
        success:function(res){ 
            if(res?.data?.code == 0){
              if(res.data.data.length<1){
                _that.setData({
                  searchText:[{name:'无数据'}]
                })
              }else{
                _that.setData({
                  searchText:res.data.data
                })
              }
            }
            else{
              app.Notify(res.data.msg);
            }  
        }
      })
    }else{
      this.setData({
        value: e.detail,
        isShow: false,
        orgId:'',
      });
    }
  },
	afterRead(event) {  //上传
	  const { file } = event.detail;
		const { fileList = [] } = this.data;
		//fileList.push({ ...file, url: db.data.url,name: db.data.name });
		fileList.push({ url: file.url,path: file.thumb });
		this.setData({
			file:file,
			fileList:fileList
		})
	},
  // 上传文件
  subFormData:function(){
      let _this = this;
      let upData = {};
      let upVideoArr = _this.data.upVideoArr;
      _this.setData({
          upFilesProgress:true,
      })
      if(_this.data.context == ""){
        app.Notify({
          type: 'warning',
          message: "不能上传空内容"
        });
        return;
      }
      if(_this.data.orgName == ""){
        app.Notify({
          type: 'warning',
          message: "请选择或输入正确的终端名称"
        });
        return
      }
      if(_this.data.menuValue == "2" && (_this.data["orgCity"] == "" || _this.data["orgProvince"] == "")){
        app.Notify({
          type: 'warning',
          message: "请选择省市"
        });
        return
      }
      upData['url'] = config.service[_this.data.upfilesUrl];
      let data = {};
      data["content"] = _this.data.context;
      data["orgName"] = (_this.data.menuValue==2) ?  _this.data.userName : _this.data.orgName;;
      data["orgId"] = _this.data.orgId;
      data["orgType"] = _this.data.menuValue;
      data["orgCity"] = (_this.data.menuValue==2) ? this.data.orgCity : '';
      data["orgProvince"] = (_this.data.menuValue==2) ? this.data.orgProvince : '';
      wx.request({
        url: config.service.conText,
        data: data,   
        method:"POST",    
        header:{
            "content-type":"application/json",
            'Authorization': 'Bearer '+config.service.token,
        }, 
        success:function(res){ 
            if(res.data.code == 0){
                if(res.data && res.data.data){
                    upData['formData'] = {"id":res.data.data};
                    upFiles.upFilesFun(_this, upData,function(res){
                    }, function (arr) {
                        // success
                        wx.switchTab({
                            url: '../home/home',
                          })
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
 
  },
  onBlur(e) {
    let _this =  this;
    if(e.detail.value == ""){
      _this.setData({
        isShow:false
      })
      return;
    }
    if(_this.data.searchText.length > 0){
      _this.data.searchText.map((item) => {
          if(e.detail.value == item.name){
            _this.setData({
              value:item.name,
              isShow:false,
              orgId:item.id,
              orgName:item.name
            })
          }
      })
    }
    if(e.target.dataset.name == "userName"){ //新增其他客户直接取文本框值
      _this.setData({
        orgName:e.detail.value
      })
    }
    _this.setData({
      isShow:false
    })
  }
})
