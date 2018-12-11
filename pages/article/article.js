var appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //title
    title: '美文',

    //美文类型
    tList: null,

    //美文排行
    aList: null,

    //文章类型根地址
    tPath: appData.urlPath + '/upload/articles/type/',

    //文章封面根地址
    cPath: appData.urlPath + '/upload/articles/',


    //更多
    more: false,

  },



  //点击搜索
  clickToSearch: function() {
    wx.navigateTo({
      url: '../article/articleSearch/articleSearch?type=1',
    });
  },


  //点击排行榜
  clickToCharts: function() {
    wx.navigateTo({
      url: '../article/articleSearch/articleSearch?type=2',
    });
  },


  //点击到分类
  clickToCategory: function() {
    wx.navigateTo({
      url: '../article/articleSearch/articleSearch?type=3',
    });
  },





  //点击其中分类
  clickCategoryItem: function(e) {
    var id = e.currentTarget.dataset.tid;
    var name = e.currentTarget.dataset.name;
    var path = e.currentTarget.dataset.path;

    if(path != null){

      wx.navigateTo({
        url: '../article/articleSearch/articleSearch?type=0&id=' + id
          + '&name=' + name
          + '&path=' + this.data.tPath + path,
      });



    }else{

      wx.navigateTo({
        url: '../article/articleSearch/articleSearch?type=0&id=' + id
          + '&name=' + name
          + '&path=/images/icon/icon_default_type.png',
      });

    }

  },



  //点击排行榜文章
  clickReadArt: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../read/readArticle/readArticle?id=' + id,
    });

  },



  //获取美文分类信息
  getCategory: function() {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/article-type',
      data: {
        token: appData.token,
        page: 1,
        limit: 9,
      },
      success: function(res) {
        console.log(res.data);
        that.setData({
          tList: res.data.data
        });

        //更多
        if (res.data.count > 9) {
          that.setData({
            more: true,
          });
        }
      }
    })
  },




  //排行榜文章列表
  getChartsList: function(no) {
    var that = this;

    wx.request({
      url: appData.urlPath + '/sys/article',
      data: {
        token: appData.token,
        page: 1,
        limit: 3,
        orderBie: no,
      },
      success: function(res) {
        console.log(res.data);
        that.setData({
          aList: res.data.data
        });
      }
    })
  },




 
  //提交用户信息给服务器
  uploadReader: function () {
    var path = appData.urlPath;

    wx.request({
      url: path + '/sys/reader/wechat/small-program',
      data: {
        token: appData.token,
        name: appData.userInfo.nickName,
        profilePhoto: appData.userInfo.avatarUrl,

      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);

      },
    });
  },







  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    //是否存在该用户
    this.uploadReader();

   

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
    this.getCategory();
    this.getChartsList(6);
    //美文
    appData.readMode = 0;

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