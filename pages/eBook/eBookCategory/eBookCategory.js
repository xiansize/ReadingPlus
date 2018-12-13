var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //获取分类数据
    categoryList: [
      {
        name: '四大名著',
        id: 148
      },
      {
        name: '中国文学',
        id: 174
      },
      {
        name: '古代言情',
        id: 190
      },
      {
        name: '历史传记',
        id: 202
      },
      {
        name: '书法理论',
        id: 229
      },
      {
        name: '设计',
        id: 243
      },
      // {
      //   name: '设计',
      //   id: '243'
      // },
      // {
      //   name: '名家画集',
      //   id: '272'
      // },
      // {
      //   name: '摄影技法',
      //   id: '278'
      // },
      // {
      //   name: '人际与社交',
      //   id: '314'
      // },
      // {
      //   name: '管理学',
      //   id: '350'
      // },
      // {
      //   name: '经济史',
      //   id: '270'
      // },

    ],

  },


  //点击去搜素
  toSearch: function () {
    wx.navigateTo({
      url: '../eBookSearch/eBookSearch',
    })
  },



  //获取分类的文章的token
  getCategory: function () {
    var that = this;
    var path = getApp().globalData.eBookPath + '/api/getToken.json';
    var time = util.formatTimeDate(new Date());
    var keyToken = util.hexMD5(time + getApp().globalData.uid + getApp().globalData.keyCode);

    wx.request({
      url: path,
      data: {
        uid: getApp().globalData.uid,
        token: keyToken,
      },
      method: "POST",
      header: { "Content-Type": "application/json" },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 0) {
          getApp().globalData.rToken = res.data.data.access_token;

        } else {
          wx.showToast({
            icon: 'none',
            title: '连接服务器失败',
          })
        }
      },
    })
  },




  //获取资源分类的代码
  getCategoryCode: function (e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../eBookSearch/eBookSearch?id=' + id + '&name=' + name,
    })

  },








  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategory();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})