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
        console.log(res);
        that.setData({
          tList: res.data.data
        });

        //如果只是只有一个类就直接去到文章界面
        if(that.data.tList.length == 1){
          var tData = that.data.tList;
          var id = tData[0].typeId;
          var name = tData[0].typeName;
          var path = tData[0].img;
          if (path != null) {
            wx.navigateTo({
              url: '../../article/articleSearch/articleSearch?type=0&id=' + id +
                '&name=' + name +
                '&path=' + that.data.tPath + path +
                '&aid=' + that.data.aid,
            });
          } else {
            wx.navigateTo({
              url: '../../article/articleSearch/articleSearch?type=0&id=' + id +
                '&name=' + name +
                '&path=/images/icon/icon_default_type.png' +
                '&aid=' + that.data.aid,
            });
          }
          
        }


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
    var that = this
    var id = e.currentTarget.dataset.tid;
    var name = e.currentTarget.dataset.name;
    var path = e.currentTarget.dataset.path;


    if (path != null) {

      wx.navigateTo({
        url: '../../article/articleSearch/articleSearch?type=0&id=' + id +
          '&name=' + name +
          '&path=' + this.data.tPath + path +
          '&aid=' + that.data.aid,
      });



    } else {

      wx.navigateTo({
        url: '../../article/articleSearch/articleSearch?type=0&id=' + id +
          '&name=' + name +
          '&path=/images/icon/icon_default_type.png' +
          '&aid=' + that.data.aid,
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
    //this.getPersonalRecord();

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