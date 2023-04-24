

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curpage:1,
    allData:[],
		context:"",
		fileList: [],
  },

  onLoad: function (options) {
		console.log(options)
		let data = JSON.parse(options.list);
		this.setData({
			url: data.submitUrl,
			 id: data.id
		})
  },
	bzInput:function(e){
	  let _this = this;
	  let key =  e.target.dataset.name;
	  _this.setData({
	      [key]:e.detail.value,
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
	afterRead(event) {  //上传
	  let _this = this;
	  const { file } = event.detail;
		file.map((v)=>{
			wx.uploadFile({
			  url: app.config.service.upLoad,
			  filePath: v.url,
			  name: 'file',
			  formData: {
			    'user': 'test'
			  },
			  header:{
			    "Content-Type":"application/x-www-from-urlencoded",
			    'Authorization': 'Bearer '+app.config.service.token,
			  },
			  success(res) {
			    // 上传完成需要更新 fileList
			    const { fileList = [] } = _this.data;
			    let db = JSON.parse(res.data)
			    //fileList.push({ ...file, url: db.data.url,name: db.data.name });
					fileList.push({ url: db.data.url,name: db.data.name });
			    _this.setData({ fileList });
			  },
			});
		})
		console.log(file)

	},
	subFormData(e) {
		let _this = this;
		if(_this.data.context == ""){
			app.Toast('请添加描述');
		  return;
		}
		let data = {};
		data["content"] = _this.data.context;
		data["files"] = _this.data.fileList;
		data["installId"] = _this.data.id;
		if(this.data.url == "maintenanceLog"){
			data["maintenanceId"] = _this.data.id;
		}
		app.goRequest(app.config.service[this.data.url],data,'POST',{},).then(res => {
		      if(res.data.code == 0){
						wx.navigateBack();
		      }
		      else{
		        app.Toast(res.data.message);
		      }  
		  }).catch(function (e) {
		});
	}
})