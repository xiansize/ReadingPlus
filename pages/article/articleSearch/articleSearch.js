var appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {

    

    //0: 其中一个分类    1:表示输入  2:表示排行  3:表示分类  
    searchType: 0,

    //类别id
    tId: null,

    //显示输入按钮
    showClear: false,
    //输入内容
    inputTitle: null,
    //不收输入板
    inputHidden: true,


    //排行榜  1:浏览量  2:参与人数
    views: 1,


    //文章列表
    aList: [],


    //分类列表
    tList: null,


    //点击的文章类型id 
    clickId: 0,

    //文章封面根地址
    cPath: appData.urlPath + '/upload/articles/',

    //文章类型根地址
    tPath: '/images/background/bg_view.png',

    //加载更多提示
    more: null,


    //分页第几页
    cPage: 1,

    //活动id
    aid: null,

    //全部文章
    allArticle: 0,

  },


  //回退事件
  backpress: function() {
    wx.navigateBack({

    });
  },


  //输入监听事件
  inputListener: function(e) {
    var that = this;
    if (e.detail.value != null) {
      that.setData({
        showClear: true,
      });
    }
    if (e.detail.value == '') {
      that.setData({
        showClear: false,
      });
    }
  },



  //点击搜索
  inputSearch: function(e) {
    var that = this;
    that.setData({
      inputTitle: e.detail.value,
      cPage: 1,
      aList: [],
    })
    console.log(that.data.inputTitle);
    that.getSearchArt();

  },



  //点击清除输入清除事件
  inputClear: function() {
    var that = this;
    that.setData({
      inputTitle: null,
      inputHidden: true,
    });
  },



  //导航浏览量
  navToViews: function() {
    var that = this;
    that.setData({
      views: 1,
      cPage: 1,
      aList: [],
    });
    that.getChartsList(6);

  },



  //导航参与人数
  navToNumbers: function() {
    var that = this;
    that.setData({
      views: 2,
      cPage: 1,
      aList: [],
    });
    that.getChartsList(4);

  },


  //导航最新
  navToNews: function() {
    var that = this;
    that.setData({
      views: 3,
      cPage: 1,
      aList: [],
    });
    that.getChartsList(2);

  },



  //点击其中的文章类型改变样式
  categoryItem: function(e) {
    var that = this;
    var t = e.currentTarget.dataset.tid;


    that.setData({
      clickId: e.currentTarget.dataset.id,
      cPage: 1,
      aList: [],
      tId: t,
    });


    //获取分类id再获取对应文章
    that.getArtList(that.data.tId);


  },



  //点击文章详情
  clickToReadText: function(e) {
    var that = this;

    //活动的情况
    if (that.data.aid != null) {
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../../read/readArticle/readArticle?id=' + id +
          '&aid=' + that.data.aid,
      });

    } else {
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../../read/readArticle/readArticle?id=' + id,
      });

    }


  },




  //获取美文分类
  getCategory: function() {
    var that = this;

    wx.request({
      url: appData.urlPath + '/sys/article-type',
      data: {
        token: appData.token,
        page: that.data.cPage,
        limit: 10,
      },
      success: function(res) {
        console.log(res.data);
        that.setData({
          tList: res.data.data,
          tId: res.data.data[0].typeId,
        });

        //获取第一分类的文章列表
        that.getArtList(res.data.data[0].typeId);

      },
    })
  },






  //通过文章类型获取文章列表
  getArtList: function(tId) {
    var that = this;

    var urlPath = appData.urlPath + '/sys/article';
    var rData = {
      token: appData.token,
      page: that.data.cPage,
      limit: 10,
      typeId: tId,
    };
    //如果是活动
    if (that.data.aid != null) {
      urlPath = appData.urlPath + '/sys/activity-main/' + that.data.aid + '/article';
      rData = {
        token: appData.token,
        page: that.data.cPage,
        limit: 10,
        articleTypeId: tId,
      };
    }

    wx.request({
      url: urlPath,
      data: rData,
      success: function(res) {
        console.log(res.data);

        var c = that.data.cPage;
        if (c <= res.data.pageCount) {
          //获取到的分页数据
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
            allArticle: res.data.count,
          });
        } else {
          that.setData({
            more: '已经到底了..'
          })
        }
      },
      complete: function() {

      },
    });
  },



  //排行榜文章列表
  getChartsList: function(no) {
    var that = this;

    wx.request({
      url: appData.urlPath + '/sys/article',
      data: {
        token: appData.token,
        page: that.data.cPage,
        limit: 10,
        orderBie: no,
      },
      success: function(res) {
        console.log(res.data);

        var c = that.data.cPage;
        if (c <= res.data.pageCount) {
          //获取到的分页数据
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
            more: '已经到底了..'
          })
        }
      },
      complete: function() {

      },

    })
  },



  //搜索文章
  getSearchArt: function() {
    var that = this;

    wx.request({
      url: appData.urlPath + '/sys/article',
      data: {
        token: appData.token,
        page: that.data.cPage,
        limit: 10,
        titleName: that.data.inputTitle,
      },
      success: function(res) {
        console.log(res.data);

        var c = that.data.cPage;
        if (c <= res.data.pageCount) {
          //获取到的分页数据
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
            more: '已经到底了..'
          })
        }
      },
      complete: function() {

      },
    })
  },














  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    //活动的id
    if (options.aid != null) {
      that.setData({
        aid: options.aid,
      });
    };



    //没有活动的时候
    var sType = options.type;
    var tTitle = null;

    if (sType != null) {
      switch (sType) {
        case '0':
          tTitle = options.name;

          that.setData({
            tId: options.id,
            tPath: options.path,
          });
          that.getArtList(that.data.tId);
          break;
        case '1':
          tTitle = '搜索';
          break;
        case '2':
          tTitle = '排行榜'
          that.getChartsList(6);
          break;
        case '3':
          tTitle = '选择美文'
          that.getCategory();
          break;
        default:
          break;
      }
      that.setData({
        searchType: sType,
        title: tTitle
      });
      wx.setNavigationBarTitle({
        title: tTitle
      });
    }


  },




 

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {


    //根据接口不同
    switch (this.data.searchType) {
      case '0':
        this.getArtList(this.data.tId);
        break;
      case '1':
        this.getSearchArt();
        break;
      case '2':
        if (this.data.view == 1) {
          this.getChartsList(6);
        } else if (this.data.view == 2) {
          this.getChartsList(4);
        } else {
          this.getChartsList(2);
        }
        break;
      case '3':
        this.getArtList(this.data.tId);
        break;
    }


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