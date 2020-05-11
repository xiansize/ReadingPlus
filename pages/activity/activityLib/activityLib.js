Page({

  /**
   * 页面的初始数据
   */
  data: {

    lib: "null",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
       lib : options.libUrl, 
    });
  },

  //分享转发
  onShareAppMessage: function (res) {
    var lid = getApp().globalData.libCode;
    return {
      title: '朗读云陪你一起朗读',
      path: 'pages/index/index?code=' + lid,
      imageUrl: '/images/background/bg_share.png', 
      success: function (res) {

      },
      fail: function (res) {

      },
    }
  },


})