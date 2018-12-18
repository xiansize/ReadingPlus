const playManager = wx.getBackgroundAudioManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //操作
    playIcon: '/images/icon/icon_pause.png',
    isShowPlay: false,


    //音频列表
    audioList: null,

    //根地址
    rUrl: getApp().globalData.eBookListenPath,

    //音频相关信息
    title: '',
    cTitle: '',
    isbn: '',
    author: '',
    summary: '',




  },


  //获取音频听书
  getBookAudio: function(isbn) {
    var that = this;
    //请求数据
    var path = getApp().globalData.eBookPath + '/api/mp3/read.json?isbn=' + isbn;

    wx.request({
      url: path,
      data: {},
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        console.log(res);
        if (res.statusCode == 200 && res.data.code == 0) {
          that.setData({
            audioList: res.data.data,
          });
          that.getAudioInfo(res.data.data[0].inf);
        }
      }
    })


  },


  //截取音频相关信息
  getAudioInfo: function(inf) {
    var that = this;

    console.log(inf);
    var info = inf.split('<br />');
    console.log(info);
    that.setData({
      title: info[0],
      author: info[1],
      summary: info[3],
    });


    wx.setNavigationBarTitle({
      title: that.data.title,
    })

  },



  //点击item播放
  playAudio: function(e) {
    var that = this;
    var path = e.currentTarget.dataset.path;
    var voi = e.currentTarget.dataset.voi;
    console.log(path);

    that.setData({
      cTitle: '正在播放:' + voi,
      isShowPlay: true,
    });


    //获取后面的路径
    var paths = path.split('/mp3');
    console.log(paths);
    path = that.data.rUrl + paths[1];
    console.log(path);

    playManager.title = voi;
    playManager.src = path;
    playManager.play();
  },


  //暂停/播放
  btnPlay: function() {
    var that = this;

    if (that.data.playIcon == '/images/icon/icon_play.png') {

      that.setData({
        playIcon: '/images/icon/icon_pause.png'
      });
      playManager.play();

    } else {
      that.setData({
        playIcon: '/images/icon/icon_play.png'
      });
      playManager.pause();

    }

  



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
    }else{
      

      //扫普通二维码进入
      var data = decodeURIComponent(options.q);

      var isbns = data.split('/Reading/')
      this.setData({
        isbn: isbns[1]
      });

      wx.showToast({
        title: isbns[1],
      });

      this.getBookAudio(isbns[1]);

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