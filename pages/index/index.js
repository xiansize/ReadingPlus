//index.js
//获取应用实例
const app = getApp();
const appData = getApp().globalData;

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },




  //点击获取用户信息
  getUserInfo: function(e) {
    console.log(e);

    if (e.detail.userInfo) {

      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      });
      this.uploadReader();

      this.swithToFunction();

    } else {

      //没有获取到用户的授权
      console.log('没有获取到用户的授权');
      this.swithToFunction();

    }

  },


  //先不授权
  noUserinfo: function() {
    this.swithToFunction();
  },



  //获取token
  getToken: function() {
    var that = this;
    //1,获取openId
    var path = app.globalData.urlPath;
    wx.login({
      success: function(res) {
        console.log(res);
        //2,获取token
        wx.request({
          url: path + '/sys/wechat/login',
          data: {
            appid: 'wxd693763b0943bfad',
            secret: 'a0dee35d93a9c7e613581448231b8bb6',
            js_code: res.code,
            grant_type: 'authorization_code',
            libId: app.globalData.libCode,
          },
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function(res) {
            console.log(res);

            if (res.data.code == 0) {

              //保存token 和 openId
              app.globalData.token = res.data.data.token;

              //获取微信信息
              that.wechatInfo();

            } else {

              wx.showToast({
                icon: 'none',
                title: res.data.msg,
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


  //跳转到功能页面
  swithToFunction: function() {
    wx.switchTab({
      url: '../article/article',
    });
  },



  //获取读者信息
  wechatInfo: function() {
    //获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
      this.swithToFunction();
    } else if (this.data.canIUse) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                getApp().globalData.userInfo = res.userInfo

                this.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
                });
                //console.log(this.data.userInfo);
                this.swithToFunction();
              }
            });
          } else {
            //还没有授权获取用户信息
            this.setData({
              userInfo: null,
            });
          }
        }
      });

    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });

          this.swithToFunction();
        }
      });
    }
  },






  //提交用户信息给服务器
  uploadReader: function() {
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

      },
    });
  },








  //页面加载
  onLoad: function(options) {
    //获取馆代码
    var code = options.code;
    if (code != null) {
      //全局馆代码
      getApp().globalData.libCode = code;
      //缓存
      wx.setStorageSync('code', code);

    } else {
      var code = wx.getStorageSync('code');
      if (code == null || code == '') {
        wx.showToast({
          icon: 'none',
          title: '进入万升馆',
        });
      } else {
        getApp().globalData.libCode = code;
      }
    }

    this.getToken();
  },







})