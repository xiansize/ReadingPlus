var util = require('../../../utils/util.js');
var appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {


    //活动海报
    cover: null,
    //活动标题
    aTitle: '',
    //活动日期
    date: '',
    //获赞数量
    likes: 0,
    //人数
    numbers: 0,
    //详情
    detail: '',


    //活动封面根地址
    aPath: appData.urlPath + '/upload/poster/',



    //活动id
    aid: null,

    //活动全部音频
    rList: [],

    //活动个人音频作品
    mList: [],

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

    //活动期间
    during: false,


    //手机号
    phone: null,
    inputPhone: false,

    //活动过期
    timeup: false,


    //展开
    detailMore: '展开详情',
    iconDetailMore: '/images/icon/icon_arrow_right.png',


    //图书馆,名称头像,文章关注链接
    libName: null,
    libIcon: null,
    libIconPath: appData.urlPath + '/upload/library/head/',
    libUrl: null,


  },



  //回退事件
  backpress: function() {
    wx.navigateBack({

    });
  },



  //点击关注公众号
  btnFollowSub: function() {
    var that = this;
    wx.navigateTo({
      url: '../activityLib/activityLib?libUrl=' + that.data.libUrl,
    })

  },






  //展开/收起
  btnShowDetailMore: function() {
    var that = this;
    if (that.data.detailMore == '展开详情') {
      that.setData({
        detailMore: "收起详情",
        iconDetailMore: '/images/icon/icon_arrow_left.png',
      });
    } else {
      that.setData({
        detailMore: "展开详情",
        iconDetailMore: '/images/icon/icon_arrow_right.png',
      });
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



  //点击去看个人投票
  btnReaderShare: function(e) {
    var that = this;
    var rid = e.currentTarget.dataset.rid;
    wx.navigateTo({
      url: '../../activity/activtyShare/activityShare?rid=' + rid
    });
  },



  //点击输入手机号确定
  btnPhone: function(e) {
    var that = this;
    if (that.data.phone != null && that.data.phone.length == 11) {
      that.postPhone();

    } else {
      wx.showToast({
        icon: 'none',
        title: '请输入正确手机号',
      });
    }
  },


  //监听输入手机号码
  inputPhone: function(e) {
    var value = e.detail.value
    this.setData({
      phone: value,
    });
  },


  //获取个人活动作品
  getPersonalRecord: function() {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/opus',
      data: {
        token: appData.token,
        type: 'PERSONAGE',
        page: 1,
        limit: 99,
        activityId: that.data.aid,
        opusStart: 'RELEASE',
      },
      success: function(res) {
        console.log(res);
        that.setData({
          mList: res.data.data
        });

      },
      complete: function() {
        wx.stopPullDownRefresh();
      },
    });


  },


  //点击进行活动朗读
  wantToRead: function() {
    var that = this;
    that.getReaderInfo(0);
  },



  //活动全部音频
  getRList: function() {
    var that = this;

    wx.request({
      url: appData.urlPath + '/sys/opus',
      data: {
        token: appData.token,
        page: that.data.cPage,
        type: "LIBRATY",
        limit: 20,
        activityId: that.data.aid,
        orderByClause: 'POLL_COUNT_DESC',
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
            total[i].iconLike = '/images/icon/icon_activity_record_item_like.png';
            total[i].textColor = '#C5C5C5';
            total[i].collectMore = 0;
            total[i].collectMoreColor = '#FFFFFF';
            list.push(total[i]);

          };

          //分页加1
          c++;

          that.setData({
            rList: list,
            more: null,
            cPage: c,
            numbers: res.data.count == null ? 0 : res.data.count,
          });
        } else {
          that.setData({
            more: '没有更多了..'
          });
        }
      },
    });
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
        orderByClause: 'POLL_COUNT_DESC',
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
            total[i].iconLike = '/images/icon/icon_collect_grey.png';
            total[i].textColor = '#AAAAAA';
            total[i].collectMore = 0;
            total[i].collectMoreColor = '#FFFFFF';
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






  //投票
  toLike: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.id;
    var rid = e.currentTarget.dataset.rid;

    that.requestLike(rid, index);

  },







  //投票接口
  requestLike: function(id, index) {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/opus/' + id + '/pull',
      data: {
        token: appData.token,
        opusId: id
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res);
        if (res.data.code == 0) {
          var list = that.data.rList;
          list[index].pollCount++;
          list[index].iconLike = '/images/gif/gif_like.gif';
          list[index].textColor = '#FF5451';
          list[index].collectMore++;
          list[index].collectMoreColor = '#FF5451';

          that.setData({
            rList: list
          });

          setTimeout(function() {
            list[index].iconLike = '/images/icon/icon_like_show.png';
            that.setData({
              rList: list
            });
          }, 220);

          setTimeout(function() {
            list[index].collectMoreColor = '#FFFFFF';
            that.setData({
              rList: list
            });
          }, 500);



        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          });
        }

      },
    });

  },


  //获取用户信息，查看是否有手机号。如果没有，添加手机号
  getReaderInfo: function(rid) {

    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/reader/' + rid + '/opus',
      data: {
        token: appData.token,
        rdId: rid,
        opusStart: 'RELEASE',
        start: 2,
      },
      success: function(res) {
        console.log(res);
        if (res.data.data.phone != null) {
          //有手机号码
          wx.navigateTo({
            url: '../activityWant/activityWant?aid=' + that.data.aid,
          });
        } else {
          //没有手机号码
          that.setData({
            inputPhone: true,
          });

        }
      },
    });
  },



  //提交手机号码
  postPhone: function() {
    var that = this;
    var path = appData.urlPath;

    wx.request({
      url: path + '/sys/reader/wechat/small-program',
      data: {
        token: appData.token,
        name: appData.userInfo.nickName,
        phone: that.data.phone,
      },
      method: "PUT",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {

        //提交手机号码成功
        console.log(res);
        if (res.data.code == 0) {
          that.setData({
            inputPhone: false,
          });
          wx.navigateTo({
            url: '../activityWant/activityWant?aid=' + that.data.aid,
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
          '&aid=' + that.data.aid,
      });
    };

  },


  //活动详情
  getDetail: function() {
    var that = this;

    wx.request({
      url: appData.urlPath + '/sys/activity-main/' + that.data.aid,
      data: {
        token: appData.token,
        id: that.data.aid,
        analysis: 1,
      },
      success: function(res) {
        console.log(res);
        if (res.data.code == 0) {

          var time = util.formatTimeD(new Date(res.data.data.stateTime)) + ' ~ ' + util.formatTimeD(new Date(res.data.data.endTime));

          that.setData({
            //活动标题
            aTitle: res.data.data.activityTitleName,
            //活动日期
            date: time,
            detail: res.data.data.synopsis,
            likes: res.data.data.pollCount,
            cover: res.data.data.img,

          });

          if (res.data.data.otherLibName != null) {
            that.setData({
              libName: res.data.data.otherLibName,
            });
          }

          if (res.data.data.otherHeadImg != null) {
            that.setData({
              libIcon: res.data.data.otherHeadImg,
            });
          }

          if (res.data.data.otherLibUrl != null) {
            that.setData({
              libUrl: res.data.data.otherLibUrl,
            });
          }


          //朗读截止日期
          if (new Date() <= res.data.data.contestEndTime) {
            that.setData({
              during: true,
            });
          }


          //活动截至日期
          if (new Date() >= res.data.data.endTime) {
            that.setData({
              timeup: true,
            });
          }



        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
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
    that.getPersonalRecord();
    that.getDetail();

  },



  //获取token
  getToken: function() {
    var that = this;
    //1,获取openId
    var path = appData.urlPath;
    wx.login({
      success: function(res) {
        console.log(res);
        //2,获取token
        wx.request({
          url: path + '/sys/wechat/login',
          data: {
            appid: appData.appid,
            secret: appData.secret,
            js_code: res.code,
            grant_type: 'authorization_code',
            libId: appData.libCode,
          },
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function(res) {
            console.log(res);
            if (res.data.code == 0) {
              //保存token 和 openId
              appData.token = res.data.data.token;

              //获取微信用户信息
              that.getUserInfoHttp(0);

            } else {

              var msg = res.data.code + res.data.msg;
              wx.showToast({
                icon: 'none',
                title: msg,
              });
            }
          },
          fail: function() {
            wx.showToast({
              icon: 'none',
              title: '连接服务器失败',
            })
          },
        });
      }
    })

  },



  //获取后台用户信息；
  getUserInfoHttp: function(rid) {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/reader/' + rid + '/opus',
      data: {
        token: appData.token,
        rdId: rid,
        opusStart: 'RELEASE',
        start: 2,
      },
      success: function(res) {
        console.log(res);
        if (res.data.code == 0) {

          if (appData.userInfo == null) {
            var userInfo = {
              nickName: res.data.data.name,
              avatarUrl: res.data.data.profilePhoto,
            };
            appData.userInfo = userInfo;
          }


          that.getDetail();
          that.getRList();
          that.getPersonalRecord();


        } else if (res.data.code == 2006 && res.data.msg == "权限不足:Subject does not have role [reader]") {
          that.postUserInfo();
        } else {
          wx.showToast({
            icon: 'none',
            title: '获取读者数据失败',
          })
        }


      },
    });
  },


  //授权获取用户信息
  postUserInfo: function() {
    var that = this;

    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          //用户已经授权
          wx.getUserInfo({
            success: function(res) {
              getApp().globalData.userInfo = res.userInfo;
              that.uploadReader();
            }
          });


        } else {
          //用户还没授权
          wx.redirectTo({
            url: '../../index/index?aid=' + that.data.aid,
          });

        }
      }
    });

  },


  //提交用户信息给服务器
  uploadReader: function() {
    var that = this;
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
      success: function(res) {
        console.log(res);
        that.getDetail();
        that.getRList();
        that.getPersonalRecord();

      },
    });
  },








  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      aid: options.aid,
    });
    var code = options.code;
    if (code != null) {
      //全局馆代码
      getApp().globalData.libCode = code;
      //缓存
      wx.setStorageSync('code', code);
      //先登录获取token
      this.getToken();


    } else {
      this.getUserInfoHttp(0);
    }



  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //设为活动朗读
    getApp().globalData.readMode = 2;

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


  //下拉刷新
  onPullDownRefresh: function() {
    this.toGetAllRecord();

  },


  //转发分享
  onShareAppMessage: function(res) {
    var that = this;
    var lid = getApp().globalData.libCode;
    return {
      title: '您的好友向您发送了活动邀请，快来看看吧',
      path: 'pages/activity/activityRead/activityRead?code=' + lid + '&aid=' + that.data.aid,
      imageUrl: '/images/background/bg_share.png',
      success: function(res) {

      },
      fail: function(res) {

      },
    }
  },


})