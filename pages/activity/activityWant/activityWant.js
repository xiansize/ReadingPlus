var appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //title
    title: '我要阅读',

    //文章类型
    tList: null,

    //文章类型根地址
    tPath: appData.urlPath + '/upload/articles/type/',

    //朗读活动id
    aid: null,

    //活动文章根地址
    articlePath: appData.urlPath + '/upload/articles/',

    //作品信息
    rTitle: null,
    readerName: null,
    like: null,
    img: null,
    path : null,
    articleId : null,

    //活动是否上传了作品
    haveRecord: false,

    //作品审核状态
    status: null,



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
        that.setData({
          tList: res.data.data
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



  //点击其中分类
  clickCategoryItem: function(e) {
    var id = e.currentTarget.dataset.tid;
    var name = e.currentTarget.dataset.name;
    var path = e.currentTarget.dataset.path;

    wx.navigateTo({
      url: '../../article/articleSearch/articleSearch?type=0&id=' + id +
        '&name=' + name +
        '&path=' + this.data.tPath + path +
        '&aid=' + this.data.aid,
    });

  },




  //获取个人活动作品
  getPersonalRecord: function() {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/opus',
      data: {
        token: appData.token,
        type: 'PERSONAGE',
        page: 1,
        limit: 99,
        activityId: that.data.aid,
      },
      success: function(res) {
        console.log(res);

        if (res.data.data.length != 0) {
          var item = res.data.data[0];

          var s = item.opusStart
          if (s == 'UNREVIEWED') {
            s = '审核中'
          } else {
            s = '已发布'
          }

          that.setData({
            haveRecord: true,
            like: item.collectionCount,
            rTitle: item.titleName,
            img: item.articleImg,
            status: s,
            path: item.opusPath,
            articleId: item.articleId,
          });

        }
      },
    });


  },


  //听活动的作品
  toListen: function() {
    var that = this;
    var aid = that.data.articleId;
    var path = that.data.path;
    
   

    if (aid != null) {
      wx.navigateTo({
        url: '../../read/readArticle/readArticle?id=' + aid +
          '&path=' + path +
          '&name=' + '本人朗读',
      });
    } else {
      wx.navigateTo({
        url: '../../read/readArticle/readArticle?free=' + 1 +
          '&path=' + path +
          '&name=' + '本人朗读',
      });
    }



  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      aid: options.aid,
    });
    this.getTList();
    this.getPersonalRecord();

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


})