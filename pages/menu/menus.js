// pages/menu/menus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:{"name":"11"},
    url:{"1502":"system/client/addClient","1610":"system/client/auditClient","1501":"system/client/queryClient",
        "1620":"system/pact/auditPact","1670":"system/pact/toPending","1621":"system/pact/toPlan","1640":"system/cservice/crecord",
        "8400":"system/cservice/cvisit","1630":'system/aservice/pending',"1631":"system/aservice/dispose",
        "1641":"system/cservice/todo","8500":"system/cservice/cpage","4300":"system/aservice/inprocess",
        "4600":"system/aservice/done","3400":"system/pact/page","3700":"system/pact/finishedList",
        "3600":"system/pact/pay","8100":"system/cservice/addList","3500":"system/pact/haspay",
        "4100":"system/aservice/addMaintain"//,"3100":"system/pact/addPact",
      },
      empty:'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.list));
    let option = JSON.parse(options.list);
    let data = [];
    for(var i=0;i<option.length;i++){
      let id = option[i].id;
        if(this.data.url[id]){
          data.push(option[i]);
        }
    }
    this.setData({
      dataList: data,
      empty:'none'
    })
    if(!data.length){
      this.setData({
        empty:'block'
      })
    }
  },
  goMenu: function(e){
    console.log(e.target.dataset.src);
    wx.redirectTo({
      url: "../"+this.data.url[e.target.dataset.src],
    })
  },
})