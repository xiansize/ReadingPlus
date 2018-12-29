var appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //title
    title: '朗读排行榜',

    //读者列表
    rList: [],

    //自己的头像
    avatar: null,

    //自己的名字
    nickname: null,

    //自己的排名
    rank: null,

    //自己的被收藏数
    collect: null,

    //more
    more: null,

    //当前第几页
    cPage: 1,

  },



  //回退事件
  backpress: function() {
    wx.navigateBack({

    });
  },



  //接口获取信息
  getRList: function() {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/reader',
      data: {
        token: appData.token,
        page: that.data.cPage,
        limit: 999,
        orderBy: 'OPUS_COUNT_DESC',

      },
      success: function(res) {
        console.log(res);
        var list = res.data.data;
        var c = that.data.cPage;
        if (c <= res.data.pageCount) {
          //获取到的分页数据
          var total = res.data.data;
          //原来就有的数据
          var list = that.data.rList;
          //添加进去
          for (var i = 0; i < total.length; i++) {

            
            //去掉自己本身
            if (that.data.avatar != total[i].profilePhoto && that.data.nickname != total[i].name){
              list.push(total[i]);
            }
            
           
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
            more: '已经到底了..'
          });
        }
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



  //获取自己的信息
  getUserInfo: function() {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/reader/0/opus',
      data: {
        token: appData.token,
        rdId: 0,

      },
      success: function(res) {
        console.log(res);
        that.setData({
          avatar: res.data.data.profilePhoto,
          nickname: res.data.data.name,
          rank: res.data.data.ranking,
          collect: res.data.data.opusCount,

        });

        //其它读者
        that.getRList();
      },
    });
  },



  //进入自己的主页
  clickMine: function() {
    wx.navigateTo({
      url: '../readMine/readMine',
    });
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
    this.getUserInfo();


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
    this.getRList();
  },


})