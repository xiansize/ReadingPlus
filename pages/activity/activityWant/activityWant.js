var appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  

    //文章类型
    tList: [],

    //文章类型根地址
    tPath: appData.urlPath + '/upload/articles/type/',

    //朗读活动id
    aid: null,

    //文章封面根地址
    cPath: appData.urlPath + '/upload/articles/',



  },

  //回退事件
  backpress: function() {
    wx.navigateBack({

    });
  },


  //获取文章分类
  getTList: function() {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/activity-main/' + that.data.aid + '/article-type',
      data: {
        token: appData.token,
        page: 1,
        limit: 99,
        id: that.data.aid,
      },
      success: function(res) {
        console.log(res.data);
        if (res.data.code != 0) {
          return;
        }
        that.setData({
          tList: res.data.data
        });

        var tData = that.data.tList;
        //获取图书信息
        for (var i = 0; i < tData.length; i++) {
          var aList = [];
          tData[i].aList = aList;
          that.setData({
            tList: tData
          });
          that.getAlist(i);
        }

      },
    });
  },



  //根据分类获取文章
  getAlist: function(i) {
    var that = this;
    var tData = that.data.tList;
    
    wx.request({
      url: appData.urlPath + '/sys/activity-main/' + that.data.aid + '/article',
      data: {
        token: appData.token,
        page: 1,
        limit: 999,
        articleTypeId: tData[i].typeId,
      },
      success: function(res) {
        console.log(res.data);
        var aData = res.data.data;
        tData[i].aList = aData;
        that.setData({
          tList: tData,
        });

      },
    });
  },




  //活动自由朗读
  toFreeRead: function() {
    var id = this.data.aid
    wx.navigateTo({
      url: '../../read/readArticle/readArticle?free=1&aid=' + id,
    });
  },



  



  //点击其中文章
  clickArticleItem : function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../read/readArticle/readArticle?id=' + id +
        '&aid=' + that.data.aid,
    });

  },











  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      aid: options.aid,
    });
    this.getTList();


  },

  

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

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