Page({

  /**
   * 页面的初始数据
   */
  data: {

    isbn: null,

    audioList : null,

  },


  //获取音频听书
  getBookAudio: function (isbn) {
    var that = this;
    //请求数据
    var path = getApp().globalData.eBookPath + '/api/mp3/read.json?isbn=' + isbn;

    wx.request({
      url: path,
      data: {
      },
      header: { "Content-Type": "application/json" },
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200 && res.data.code == 0) {
          that.setData({
            audioList: res.data.data,
          });
        }
      }
    })


  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var isbn = options.isbn;
    console.log(isbn);
    if (isbn != null) {
      this.setData({
        isbn: isbn
      });
      this.getBookAudio(isbn);
    }

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