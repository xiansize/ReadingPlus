var util = require('../../../utils/util.js');
var appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
   

    //活动海报
    cover: null,
    //活动标题
    aTitle: null,
    //活动地点
    location: null,
    //活动日期
    date: null,
    // //签到时间
    // signIn: '09:00~09:30（签到）',
    // //活动时间
    // time: '09:30~12:00（活动）',
    //活动详情
    summary: null,


    //文章封面根地址
    aPath: appData.urlPath + '/upload/poster/',

    //活动过期
    timeup: false,

  },





  //回退事件
  backpress: function() {
    wx.navigateBack({

    });
  },



  //活动详情
  getDetail: function(aid) {
    var that = this;

    wx.request({
      url: appData.urlPath + '/sys/activity-main/' + aid,
      data: {
        token: appData.token,
        id: aid,
        analysis : 1,
      },
      success: function(res) {
        console.log(res);
        var time = util.formatTimeD(new Date(res.data.data.stateTime)) + ' ~ ' +util.formatTimeD(new Date(res.data.data.endTime));

        that.setData({
          // //活动海报
          // cover: res.data.data.img,
          //活动标题
          aTitle: res.data.data.activityTitleName,
          //活动地点
          location: res.data.data.locale,
          //活动日期
          date: time,
          summary: res.data.data.synopsis,
        });

        //活动截至日期
        if (new Date() >= res.data.data.endTime) {
          that.setData({
            timeup: true,
          });
        }

      },
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var aid = options.aid;
    var img = this.data.aPath + options.img;
    this.setData({
      cover: img,
    });
    this.getDetail(aid);

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