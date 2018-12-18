Page({

  /**
   * 页面的初始数据
   */
  data: {

    //搜索内容
    searchValue: [],

    //弹出输入框
    focuesInput: true,


    //上拉加载更多
    isLoadMore: false,
    loadText: '努力加载中...',

    //搜索的文章名
    searchTitle: null,

    //搜索的分类id
    typeId: null,

    //当前页数
    nowPage: 1,


    //根url
    rUrl: getApp().globalData.eBookListenPath + '/',


    //弹窗详情
    showModal: false,
    //书本信息
    img: null,
    title: null,
    author: null,
    isbn: null,
    id: null,
    pubdate: null,
    publisher: null,
    summary: null,
    isListen : false,




  },



  //图片当张加载失败
  showDefaultImg:function(e){
    this.setData({
      img: '/images/background/bg_view.png'
    });

  },


  //图片列表加载失败
  showDefaultImgList : function(e){
    var index = e.currentTarget.dataset.index;
    var img = 'searchValue[' + index + '].image';
    this.setData({
      [img]: '/images/background/bg_view.png'
    }); 

  },



  //获取读者输入的title
  getTitle: function (e) {
    var title = e.detail.value;
    var that = this;
    console.log(title);
    //获取搜索文章名
    that.setData({
      nowPage: 1,
      searchTitle: title,
      searchValue: [],
    });

    //资源搜索title
    wx.setNavigationBarTitle({
      title: '书籍搜索',
    });

    //搜索
    this.titleSearch();
  },



  //点击获取书本详细信息
  getIsbn: function (e) {
    var img =  e.currentTarget.dataset.img;
    var title = e.currentTarget.dataset.title;
    var author = e.currentTarget.dataset.author;
    var isbn = e.currentTarget.dataset.isbn;
    var id = e.currentTarget.dataset.id;
    var pubdate = e.currentTarget.dataset.pubdate;
    var publisher = e.currentTarget.dataset.publisher;
    var summary = e.currentTarget.dataset.summary;

    var that = this;

    that.setData({
      //书本信息
      img: img,
      title: title,
      author: author,
      isbn: isbn,
      id: id,
      pubdate: pubdate,
      publisher: publisher,
      summary: summary,
      //弹窗详情
      showModal: true,
    });


    //获取接口是否可以听书
    that.setData({
      isListen: false,
    })
    that.getBookAudio(isbn);

  },




  //点击去朗读
  confirmRead: function () {
    var that = this;
    that.setData({
      showModal: false,
    });
    //跳转电子书朗读
    wx.navigateTo({
      url: '../eBookRead/eBookRead?id=' + that.data.id,
    });
  },


  //点击去听书
  confirmListen:function(){
    var that = this;
    that.setData({
      showModal: false,
    });
    //跳转电子书听
    wx.navigateTo({
      url: '../eBookListen/eBookListen?isbn=' + that.data.isbn,
    });

  },



  //取消弹窗
  cancelRead: function () {
    var that = this;
    that.setData({
      showModal: false,
    });
    
  },




  //分类搜索
  typeSearch: function () {


    //全局
    var that = this;
    //当前页
    var cPage = that.data.nowPage;

    //请求数据
    var path = getApp().globalData.eBookPath + '/api/resource/category.json';
    wx.request({
      url: path,
      data: {
        access_token: getApp().globalData.rToken,
        libcode: getApp().globalData.libCode,
        id: parseInt(that.data.typeId),
        pageno: cPage,
        pagesize: 12,

      },
      method: "POST",
      header: { "Content-Type": "application/json" },
      success: function (res) {
        console.log(res.data);


        //获取总页数
        var tPage = res.data.data.pagecount;

        if (cPage <= tPage) {
          //获取到的分页数据
          var total = res.data.data.data;
          //原来就有的数据
          var list = that.data.searchValue;
          //添加进去
          for (var i = 0; i < total.length; i++) {
            total[i].image = that.data.rUrl + total[i].image;
            list.push(total[i]);
          };
          //分页加一
          cPage++;

          //更新数据
          that.setData({
            searchValue: list,
            isLoadMore: false,
            nowPage: cPage,
          });



        } else {

          //设置底部显示
          that.setData({
            isLoadMore: true,
            loadText: '已经到底了..',
          });

        }
      },
      fail: function () {

      },
    });

  },



  //题名搜索
  titleSearch: function () {



    //全局
    var that = this;
    //当前页
    var cPage = that.data.nowPage;

    //请求数据
    var path = getApp().globalData.eBookPath + '/api/resource/search.json';
    wx.request({
      url: path,
      data: {
        access_token: getApp().globalData.rToken,
        libcode: getApp().globalData.libCode,
        key: that.data.searchTitle,
        pageno: cPage,
        pagesize: 12,
      },
      method: "POST",
      header: { "Content-Type": "application/json" },
      success: function (res) {
        console.log(res.data);

        //获取总页数
        var tPage = res.data.data.pagecount;

        if (cPage <= tPage) {
          //获取到的分页数据
          var total = res.data.data.data;
          //原来就有的数据
          var list = that.data.searchValue;
          //添加进去
          for (var i = 0; i < total.length; i++) {
            total[i].image = that.data.rUrl + total[i].image;
            list.push(total[i]);
            
          };
          //分页加一
          cPage++;

          //更新数据
          that.setData({
            searchValue: list,
            isLoadMore: false,
            nowPage: cPage,
          });




        } else {

          //设置底部显示
          that.setData({
            isLoadMore: true,
            loadText: '没有数据..',
          });

        }
      },
      fail: function () {

      },
    });
  },





  //获取音频听书
  getBookAudio : function(isbn){
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
        if(res.statusCode == 200 && res.data.code == 0){
          that.setData({
            isListen : true,
          })
        }
        
      }
    })


  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取电子书的分类
    var id = options.id;
    var name = options.name;
    if (id != null) {
      this.setData({
        typeId: id,
        focuesInput: false,
      })

      //title
      wx.setNavigationBarTitle({
        title: name,
      });

      //搜索
      this.typeSearch();
    }



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

    //显示加载条
    this.setData({
      isLoadMore: true,
    });

    //加载数据
    if (this.data.searchTitle != null) {
      this.titleSearch();
    } else {
      this.typeSearch();
    }

  },


})