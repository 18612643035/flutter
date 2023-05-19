const app = getApp();
import Dialog from '../../dist/dialog/dialog';
Component({
  properties: {
    http: {
			type: Object,
			value:{},
			observer: 'getList',
		},
  },

  data: {
    someData: {},
		imagesAll: []
  },
  methods: {
    customMethod: function(){},
		getList: function() {
			let _this = this;
			// 在组件实例进入页面节点树时执行
			app.goRequest(_this.data.http.url+"/"+_this.data.http.id,{},'GET',{},).then(res => {
					let images = [];
					res.data.data.map((v)=>{
						v.files.map((file)=>{
							const fileNmae = file.name.substr(-4).toLocaleLowerCase();
							if(fileNmae == ".mp4" || fileNmae == ".mov" || fileNmae == ".3gp" || fileNmae == ".mpv"){
								file["type"] = "vido"
							}
							else if(fileNmae == ".jpg" || fileNmae == ".png" || fileNmae == "jpeg"){
								file["type"] = "image"
								images.push(file.url)
							}else{
								file["type"] = "file"
							}
						})
					})
					
					let img1 = _this.data.imagesAll;
					let img2 = images;
					img1 = img1.concat(img2);
					_this.setData({
						data:res.data.data,
						 imagesAll: img1
					})
			  }).catch(function (e) {
			});
		},
		previewImg: function (event) {//缩略图放大
		  let currentUrl = event.currentTarget.dataset.presrc;
		  let images = this.data.imagesAll;
		  app["previewImg"] = true;
		  wx.previewImage({
		    current: currentUrl, 
		    urls: images
		  })
		},
		deleteLog: function(e){
			let _this = this;
			Dialog.confirm({
				title: '提示',
				message: '是否确认删除此条内容',
			  })
				.then(() => {
					let index = e.target.dataset.index;
					app.goRequest(_this.data.http.deleteUrl+"/"+_this.data.data[e.target.dataset.index].id,{},'DELETE',{},).then(res => {
							app.Toast('删除成功');
							_this.getList();
					  }).catch(function (e) {
					});
				})
				.catch(() => {
				  // on cancel
				});

		}
  },

})