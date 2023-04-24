var config = require('../../config')
var upFiles = require('../../utils/upFiles.js')
import Toast from '../../dist/toast/toast';
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
			vaue2:'',
      dealerDict:[],
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
			currentBtn: -1,
			provinceCur:"",
			citydictCur:"",
			avatarUrl:"",
      active:0
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
          arr.unshift({value:"",text:"请选择市"});
          _this.setData({
            cityDict:arr,
						citydictCur:arr[0].value
          })
      }
    })
  },
	onChange: function(e) { //切换选择时清空数据
	  this.setData({
			provinceCur:''
		});
		this.setData({
		   menuValue:e.detail.index+1,
		   userName:'',
		   orgName:'',
			 vaue2:'',
			 value:'',
		   orgId:'',
		   orgCity:'',
		   orgProvince:'',
			 cityDict:[],
			 currentBtn:-1,
			 provinceCur: this.data.province[0].value
		})
	},
  dealerChange: function(e) {
    this.setData({
      orgName:this.data.dealerDict[e.currentTarget.dataset.index].value,
      orgId:'',
   })
	 if (this.data.currentBtn == e.currentTarget.dataset.index) {
		 // 再点一下 取消选中
		 this.setData({
			 currentBtn: -1
		 })
	 } else {
		 this.setData({
			 currentBtn: e.currentTarget.dataset.index
		 })
	 }
  },
  onLoad: function (data) {
    const _this = this;
    let list = JSON.parse(data.list);
    _this.setData({
      upfilesUrl: list.upfilesUrl,
      submitUrl: list.submitUrl,
      avatarUrl: app.avatarUrl
    })
    console.log(this.data)
		wx.getSystemInfo({
			success: function (res) {
					let version = res.SDKVersion;
					version = version.replace(/\./g, "");
					console.log('当前版本号: '+version);
					_this.setData({version});
			}
		});
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
						provinceCur:arr[0].value
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
          _this.setData({
            dealerDict:res.data.data,
          })
      }
    })
  },
  onClick(e) {
    this.setData({
      value:e.target.dataset.value,
      isShow:false,
      orgId:e.target.dataset.id,
      orgName:e.target.dataset.value
    })
  },
	deleteImg(event) {
	  console.log(event)
	  let file = this.data.fileList;
	  file.splice(event.detail.index,1);
	  this.setData({
	    fileList:file
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
              Toast(res.data.msg);
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
		file.map((v)=>{
			fileList.push({ url: v.url,path: v.thumb });
		});
		console.log(fileList)
		this.setData({
			file:file,
			fileList:fileList
		})
	},
	updateAvatar(url){
	  let _this = this;
	  let data = {};
	  data.avatar = url;
	  wx.request({
	    url: config.service.updateAvatar, //低版本上传用户头像
	    data:  data,
	    method: 'POST',
	    header: {
				"content-type":"application/x-www-form-urlencoded",
	      'Authorization': 'Bearer ' + config.service.token,
	    },
	    success:function(res){
				_this.subFormData();
	    }
	  })
	},
	onChooseAvatar(e) {
		console.log(e)
		const { avatarUrl } = e.detail  //获取图片临时路径
		  let _this = this;
			if(!app.avatarUrl){ 
        wx.uploadFile({ //高版本上传头像
          url: app.config.service.uploadAvatar,
          filePath: avatarUrl,
          name: 'file',
          formData: {
            'user': 'test'
          },
          header:{
            "Content-Type":"application/x-www-from-urlencoded",
            'Authorization': 'Bearer '+app.config.service.token,
          },
          success(res) {
            app.avatarUrl = avatarUrl;
            _this.subFormData();
            console.log(res);
          },
        });
			}
			else{
				this.subFormData();
			}
	},
	getUserProfile(e) {
	  let _this = this;
		 _this.updateAvatar('');
		 return
	  wx.getUserProfile({
	    desc: '用于保存用户的头像', 
	    success: (res) => {
				console.log(res.userInfo)
				_this.updateAvatar(res.userInfo.avatarUrl);
	    },fail(res){
	        wx.showModal({
	            title: '感谢您使用！',
	            content: '请允许小程序可以使用您的头像！',
	            success (res) {
	              if (res.confirm) {
	                console.log('用户点击确定')
	                _this.getUserProfile()
	              } else if (res.cancel) {
	                console.log('用户点击取消')
									_this.getUserProfile();
	              }
	            }
	          })
	      }
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
				Toast('请添加描述');
        return;
      }
      if(_this.data.orgName == "" || (_this.data.menuValue == "1" && _this.data.orgName != _this.data.value)){
				Toast('请选择或输入正确的终端名称');
        return
      }
      if(_this.data.menuValue == "2" && (_this.data["orgCity"] == "" || _this.data["orgProvince"] == "")){
				Toast('请选择省市');
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
            }
        }
      })
 
  },
  onBlur(e) {
    let _this =  this;
		// _this.data.orgName != e.detail.value && _this.data.menuValue == 1 ? _this.setData({
		// 	orgName:'',
		// 	orgId:''
		// 	}) : '';
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
