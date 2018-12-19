Page({

  /**
   * 页面的初始数据
   */
  data: {


    //图书url的地址
    readUrl: null,


  },







  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var url = "https://ebook.3eol.com.cn/database/webreader/Index?id=" + id + "&resid=15"

    console.log(url);

    this.setData({
      readUrl: url,
    });

    




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

  

})