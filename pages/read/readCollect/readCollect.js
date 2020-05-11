var appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  
    //收藏列表
    cList: [],

    //文章封面根地址
    cPath: appData.urlPath + '/upload/articles/',

    //collect
    cLike: '/images/icon/icon_collect.png',

    //more
    more: null,

    //当前第几页
    cPage: 1,

  },




  //回退事件
  backpress: function() {
    wx.navigateBack({});
  },





  //获取收藏列表接口
  getCollectList: function() {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/favories/reader',
      data: {
        token: appData.token,
        page: that.data.cPage,
        limit: 10,
      },
      success: function(res) {
        console.log(res);
       
        var c = that.data.cPage;
        if (c <= res.data.pageCount) {
          //获取到的分页数据
          var total = res.data.data;
          //原来就有的数据
          var list = that.data.cList;
          //添加进去
          for (var i = 0; i < total.length; i++) {
            total[i].cIcon = '/images/icon/icon_collect.png';
            list.push(total[i]);
          };

          //分页加1
          c++;

          that.setData({
            cList: list,
            more: null,
            cPage: c,
          });
        } else {
          that.setData({
            more: '已经到底了..'
          })
        }
      },
    });

  },






  //点击去听
  clickListen: function(e) {
    var that = this;
    //文章id
    var aid = e.currentTarget.dataset.aid;
    var path = e.currentTarget.dataset.path;

    var name = e.currentTarget.dataset.rname;

    if (aid != null) {
      wx.navigateTo({
        url: '../../read/readArticle/readArticle?id=' + aid +
          '&path=' + path +
          '&name=' + name + ' 朗读',
      });
    } else {
      wx.navigateTo({
        url: '../../read/readArticle/readArticle?free=' + 1 +
          '&path=' + path +
          '&name=' + name + ' 朗读',
      });
    }

  },



  //点击取消收藏
  cancelCollect: function(e) {
    var that = this;
    //作品id
    var rid = e.currentTarget.dataset.rid;
    //下标
    var index = e.currentTarget.dataset.index;

    //判断收藏还是取消收藏
    var icon = e.currentTarget.dataset.icon;
   
    if (icon == '/images/icon/icon_collect.png') {
      wx.request({
        url: appData.urlPath + '/sys/favories?token=' + appData.token + '&opuseId=' + rid,
        data: {
          token: appData.token,
          opuseId: rid,
        },
        method: 'DELETE',
        success: function(res) {
          
          if (res.data.code == 0) {
            //改变当前收藏按钮
            var list = that.data.cList;
            list[index].cIcon = '/images/icon/icon_collect_grey.png';
            that.setData({
              cList: list,
            });

            that.sToast('已取消收藏');
          }
        },
      });

    } else {

      wx.request({
        url: appData.urlPath + '/sys/favories',
        data: {
          token: appData.token,
          opuseId: rid,
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.code == 0) {
            //改变当前收藏按钮
            var list = that.data.cList;
            list[index].cIcon = '/images/icon/icon_collect.png';
            that.setData({
              cList: list,
            });

            that.sToast('又收藏了!');
          }
        },
      });

    }

  },




  //显示土司
  sToast: function(text) {
    wx.showToast({
      icon: 'none',
      title: text,
    })

  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCollectList();

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
    //先是美文朗读
    appData.readMode = 0;

  },

  

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getCollectList();

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