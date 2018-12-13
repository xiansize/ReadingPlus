var appData = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //title
    title: '朗读',

    //适配苹果X
    // model: 128,

    //排名
    rank: null,



  },


  //接口获取信息
  getRList: function() {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/reader',
      data: {
        token: appData.token,
        page: 1,
        limit: 3,
        orderBy: 'OPUS_COUNT_DESC',

      },
      success: function(res) {


        that.setData({
          rank: res.data.data,
         
        });

      },
    });
  },


  //点击查看读者作品
  clickReader: function(e) {
    var rid = e.currentTarget.dataset.rid;

    wx.navigateTo({
      url: '../readMine/readMine?rid=' + rid,
    });

  },

  //点击去我的收藏
  toReadCollect: function() {
    wx.navigateTo({
      url: '../../../readCollect/readCollect',
    });
  },

  //点击去我的朗读
  toReadMine: function() {
    wx.navigateTo({
      url: '../../../readMine/readMine',
    });
  },


  //点击去到朗读排行榜
  toList: function() {
    wx.navigateTo({
      url: '../../../readList/readList',
    });
  },



  //选择美文阅读
  toArticleRead: function() {
    wx.navigateTo({
      url: '../../../../article/articleSearch/articleSearch?type=3',
    });

  },


  //选择自由朗读
  toFreeRead: function() {
    wx.navigateTo({
      url: '../../../readArticle/readArticle?free=1',
    });
  },


  //线上电子书阅读
  toEBook : function(){
    wx.navigateTo({
      url: '../eBook/eBookCategory/eBookCategory',
    });

  },










  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    // //适配苹果X
    // if (appData.phoneModel == 'iPhone X') {
    //   this.setData({
    //     model: 178,
    //   });
    // }

    




  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //朗读
    appData.readMode = 1;

    this.getRList();


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("下拉");

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


})