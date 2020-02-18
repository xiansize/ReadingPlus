var util = require('../../utils/util.js');
var appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //title
    title: '活动',



    //活动搜索
    search: false,


    //文章封面根地址
    aPath: appData.urlPath + '/upload/poster/',


    //轮播图列表
    pList: null,


    //活动列表
    aList: [],

    //more
    more: null,

    //当前第几页
    cPage: 1,


    //搜索title
    sTitle: null,


    //焦点
    focus: false,

    //童心成长营
    showBanner: true,

  },



  //童心成长营不显示banner
  hiddenBanner: function() {
    if (appData.libCode == 'P1ZJ0571017') {
      this.setData({
        showBanner: false,
      });
    }

  },



  //获取轮播图列表
  getPList: function() {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/activity-main',
      data: {
        token: appData.token,
        page: 1,
        limit: 10,
        activityType: 'READING_ALOUD_ACTIVITY',
      },
      success: function(res) {
        console.log(res);
        that.setData({
          pList: res.data.data,
        });
      },
    });
  },


  //获取活动列表
  getAList: function() {
    var that = this;
    var rData;
    if (that.data.showBanner) {
      rData = {
        token: appData.token,
        page: that.data.cPage,
        limit: 10,
        activityType: 'NOTICE',
      }
    } else {
      rData = {
        token: appData.token,
        page: that.data.cPage,
        limit: 10,
      }
    }
    wx.request({
      url: appData.urlPath + '/sys/activity-main',
      data: rData,
      success: function(res) {
        console.log(res.data);

        wx.stopPullDownRefresh();

        var c = that.data.cPage;
        if (c <= res.data.pageCount) {
          //获取到的分页数据
          var total = res.data.data;
          //时间格式
          for (var i = 0; i < total.length; i++) {
            total[i].stateTime = util.formatTimeD(new Date(total[i].stateTime));
            total[i].endTime = util.formatTimeD(new Date(total[i].endTime));
          }
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
            more: '没有更多活动了...'
          });
        }
      },
    });
  },




  //搜索
  searchActivity: function(e) {
    var that = this;
    var value = e.detail.value;
    if (value != '') {

      that.setData({
        sTitle: value,
        cPage: 1,
        search: true,
        aList: [],
      });

      that.searchList();

    }

  },


  //搜索接口
  searchList: function() {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/activity-main',
      data: {
        token: appData.token,
        page: that.data.cPage,
        limit: 10,
        activityTitleName: that.data.sTitle,
      },
      success: function(res) {
        console.log(res.data);

        var c = that.data.cPage;
        if (c <= res.data.pageCount) {
          //获取到的分页数据
          var total = res.data.data;
          //时间格式
          for (var i = 0; i < total.length; i++) {
            total[i].stateTime = util.formatTimeD(new Date(total[i].stateTime));
            total[i].endTime = util.formatTimeD(new Date(total[i].endTime));
          }
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
            more: '没有更多了..'
          });
        }
      },
    });

  },




  //返回全部
  backAll: function() {
    var that = this;
    that.setData({
      sTitle: null,
      cPage: 1,
      search: false,
      focus: false,
      aList: [],
    });
    //获取列表数据
    that.getAList();
    that.getPList();

  },


  //点击轮播图
  clickToActivity: function(e) {
    var id = e.currentTarget.dataset.aid;
    var img = e.currentTarget.dataset.img;



    wx.navigateTo({
      url: '../../../activityRead/activityRead?aid=' + id + '&img=' + img,
    });
  },




  //点击详情
  clickToDetail: function(e) {
    var id = e.currentTarget.dataset.aid;
    var t = e.currentTarget.dataset.t;
    var img = e.currentTarget.dataset.img;

    if (t == 'NOTICE') {
      wx.navigateTo({
        url: '../../../activityDetail/activityDetail?aid=' + id + '&img=' + img,
      });

    } else {

      wx.navigateTo({
        url: '../../../activityRead/activityRead?aid=' + id + '&img=' + img,
      });


    }

  },







  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    this.hiddenBanner();


    //获取轮播图数据
    this.getPList();

    //获取列表数据
    this.getAList();




  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //朗读
    appData.readMode = 2;






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



  //下拉刷新
  onPullDownRefresh: function() {
    this.backAll();


  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

    //获取列表数据
    if (this.data.sTitle != null) {
      this.searchList();

    } else {
      this.getAList();
    }


  },


})