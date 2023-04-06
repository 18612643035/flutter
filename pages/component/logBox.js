const app = getApp();
Component({
  properties: {
    http: {
			type: Object,
			value:{},
			observer: 'getList',
		},
  },

  data: {
    someData: {}
  },
  methods: {
    customMethod: function(){},
		getList: function() {
			let _this = this;
			// 在组件实例进入页面节点树时执行
			app.goRequest(_this.data.http.url+"/"+_this.data.http.id,{},'GET',{},).then(res => {
					res.data.data.map((v)=>{
						v.files.map((file)=>{
							if(file.name.substr(-4) == ".mp4"){
								file["type"] = "vido"
							}
							if(file.name.substr(-4) == ".jpg" || file.name.substr(-4) == ".png"){
								file["type"] = "image"
							}
						})
					})
					_this.setData({
						data:res.data.data,
					})
			  }).catch(function (e) {
			});
		},
		deleteLog: function(e){
			let _this = this;
			let index = e.target.dataset.index;
			app.goRequest(_this.data.http.deletUrl+"/"+_this.data.data[e.target.dataset.index].id,{},'DELETE',{},).then(res => {
					app.Notify("删除成功");
					_this.getList();
			  }).catch(function (e) {
			});
		}
  },

})