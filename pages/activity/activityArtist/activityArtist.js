var appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {


    //数据
    aList: [],

    //当前页
    cPage: 1,

    //more
    more: null,


    //活动文章根地址
    articlePath: appData.urlPath + '/upload/articles/',

  },

  //请求数据
  requesteList: function() {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/opus/excellent/page',
      data: {
        token: appData.token,
        pageSize: 10,
        pageNum: that.data.cPage,
      },
      success: function(res) {
        console.log(res);

        var c = that.data.cPage
        if (c <= res.data.pageCount) {
          var total = res.data.data;
          //原来就有的数据
          var list = that.data.aList;
          //添加进去
          for (var i = 0; i < total.length; i++) {
            list.push(total[i]);
          };

          //分页加1
          c++;

          that.setData({
            aList: list,
            more: null,
            cPage: c,
          });

        } else {
          that.setData({
            more: '没有更多作品了...'
          });
        }


      },
    });


  },



  //去听
  toListen: function (e) {

    var that = this;
    var aid = e.currentTarget.dataset.aid;
    var path = e.currentTarget.dataset.path;
    var reader = e.currentTarget.dataset.reader;

    if (aid != null) {
      wx.navigateTo({
        url: '../../read/readArticle/readArticle?id=' + aid +
          '&path=' + path +
          '&name=' + reader + ' 朗读' +
          '&aid=' + that.data.aid,
      });
    } else {
      wx.navigateTo({
        url: '../../read/readArticle/readArticle?free=' + 1 +
          '&path=' + path +
          '&name=' + reader + ' 朗读' +
          '&aid=' + that.data.aid,
      });
    };

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.requesteList();


  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.requesteList();
  },


})