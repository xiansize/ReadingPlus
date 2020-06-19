Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var code = "P1ZJ0571017";
    var aid = 85;
    wx.redirectTo({
      url: '../activity/activityRead/activityRead?code=' + code + '&aid=' + aid,
    })

  },



})