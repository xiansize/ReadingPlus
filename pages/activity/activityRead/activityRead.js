var util = require('../../../utils/util.js');
var appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //title
    title: '活动详情',

    //活动海报
    cover: null,
    //活动标题
    aTitle: null,
    //活动日期
    date: null,
    //获赞数量
    likes: 0,
    //人数
    numbers: 0,
    //详情
    detail: null,

    //1：详情  2：参与音频
    view: 1,



    //活动封面根地址
    aPath: appData.urlPath + '/upload/poster/',

    //活动文章根地址
    articlePath: appData.urlPath + '/upload/articles/',

    //活动id
    aid: null,

    //活动全部音频
    rList: [],

    //more
    more: null,

    //当前第几页
    cPage: 1,

    //搜索title
    sTitle: null,


    //焦点
    focus: false,

    //文章搜索
    search: false,



  },



  //回退事件
  backpress: function() {
    wx.navigateBack({

    });
  },



  //导航浏览量
  navToImg: function() {
    var that = this;
    if (that.data.view == 2) {
      that.setData({
        view: 1,
      })
    }

  },




  //导航参与音频
  navToMusic: function() {
    var that = this;
    if (that.data.view == 1) {
      that.setData({
        view: 2,
      })
    }
  },



  //点击搜索获取输入文字
  toSearch: function(e) {
    var that = this;
    var value = e.detail.value;
    if (value != '') {

      that.setData({
        sTitle: value,
        cPage: 1,
        search: true,
        rList: [],
      });
      that.searchList();


    };

  },

  //搜索接口
  searchList: function() {
    var that = this;

    wx.request({
      url: appData.urlPath + '/sys/opus',
      data: {
        token: appData.token,
        page: that.data.cPage,
        limit: 10,
        type: "LIBRATY",
        titleName: that.data.sTitle,
        activityId: that.data.aid,
      },
      success: function(res) {
        console.log(res.data);

        var c = that.data.cPage;
        if (c <= res.data.pageCount) {
          //获取到的分页数据
          var total = res.data.data;
          //原来就有的数据
          var list = that.data.rList;
          //添加进去
          for (var i = 0; i < total.length; i++) {
            list.push(total[i]);
          };

          //分页加1
          c++;

          that.setData({
            rList: list,
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


  //点击进行活动朗读
  wantToRead: function() {
    var that = this;
    wx.navigateTo({
      url: '../activityWant/activityWant?aid=' + that.data.aid,
    });
  },



  //投票
  toLike: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.id;
    var rid = e.currentTarget.dataset.rid;

    that.requestLike(rid,index);

  },


  //投票接口
  requestLike: function(id,index) {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/opus/'+id+'/pull',
      data: {
        token: appData.token,
        opusId : id
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        if(res.data.code == 0){
          var list = that.data.rList;
          list[index].pollCount++;
          that.setData({
            rList : list
          });

          wx.showToast({
            title: '投票成功',
          });

        }else{
          wx.showToast({
            icon : 'none',
            title: res.data.msg,
          });
        }

      },
    });

  },


  //去听
  toListen: function(e) {

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
          '&aid='+ that.data.aid,
      });
    };

  },


  //活动详情
  getDetail: function(aid) {
    var that = this;

    wx.request({
      url: appData.urlPath + '/sys/activity-main/' + aid,
      data: {
        token: appData.token,
        id: aid,
        analysis: 1,
      },
      success: function(res) {
        console.log(res);
        if(res.data.code == 0){

          var time = util.formatTimeD(new Date(res.data.data.stateTime)) + ' ~ ' + util.formatTimeD(new Date(res.data.data.endTime));

          that.setData({
            //活动标题
            aTitle: res.data.data.activityTitleName,
            //活动日期
            date: time,
            detail: res.data.data.synopsis,
            likes: res.data.data.pollCount,
            numbers: res.data.data.gameCount,
          });

        }else{
          wx.showToast({
            icon : 'none',
            title: res.data.msg,
          });
        }

      },
    });
  },



  //活动全部音频
  getRList: function() {
    var that = this;

    wx.request({
      url: appData.urlPath + '/sys/opus',
      data: {
        token: appData.token,
        page: that.data.cPage,
        type : "LIBRATY",
        limit: 10,
        activityId: that.data.aid,
      },
      success: function(res) {
        console.log(res.data);

        var c = that.data.cPage;
        if (c <= res.data.pageCount) {
          //获取到的分页数据
          var total = res.data.data;
          //原来就有的数据
          var list = that.data.rList;
          //添加进去
          for (var i = 0; i < total.length; i++) {
            list.push(total[i]);
          };

          //分页加1
          c++;

          that.setData({
            rList: list,
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



  //返回获取全部音频
  toGetAllRecord: function() {
    var that = this;
    that.setData({
      sTitle: null,
      cPage: 1,
      search: false,
      focus: false,
      rList: [],
    });
    that.getRList();

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var aid = options.aid;
    var img = this.data.aPath + options.img;
    this.setData({
      cover: img,
      aid: aid,
    });

    this.getDetail(aid);
    this.getRList();

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

    //获取列表数据
    if (this.data.sTitle != null) {
      this.searchList();

    } else {
      this.getRList();
    }


  },


})