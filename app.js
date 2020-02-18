//app.js
App({
  onLaunch: function(options) {
    var that = this;
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res);
    //           }
    //         }
    //       })
    //     }else{
    //       this.userInfoReadyCallback(res);
    //     }
    //   }
    // });



    // //获取手机型号
    // wx.getSystemInfo({
    //   success: function (res) {
    //     // console.log(res)
    //     if (res.model == 'iPhone X') {
    //       that.globalData.phoneModel = res.model;
    //     }
    //   }
    // });
  },



  globalData: {
    //访问地址
    //urlPath: 'http://192.168.10.1:8087/Reading',
    urlPath: 'https://cloud.dataesb.com/Reading',

    //用户信息
    userInfo: null,

    //小程序唯一id
    openId: null,

    //访问后台token
    token: null,

    //录制最长时间(分钟)
    recordMaxTime: 5,


    //馆代码
    libCode: 'P1ZJ0571017', //wsinterlib                


    //朗读模式: 0美文 1朗读 2活动朗读
    readMode: 0,


    //手机类型
    phoneModel: null,



    //电子资源
    eBookPath: "https://u.dataesb.com/ubook",
    //听书地址及书本封面地址
    eBookListenPath: "http://www.cpgebook.com",
    //uid与keycode
    uid: 'test',
    keyCode: 'test',
    //电子资源文章接口token
    rToken: null,

  }
})


//放在app.json中添加电子书功能的。
// {
//   "pagePath": "pages/eBook/eBookCategory",
//   "text": "阅听",
//   "iconPath": "images/icon/icon_eBook_grey.png",
//   "selectedIconPath": "images/icon/icon_eBook.png"
// },