//app.js
App({
  onLaunch: function(options) {
    
  
  },



  globalData: {
    //访问地址
    urlPath: 'https://cloud.dataesb.com/Reading',
    //urlPath: 'http://j.tcsoft.info:28098/Reading', 

    //用户信息
    userInfo: null,

    //小程序唯一id
    openId: null,

    //访问后台token
    token: null,

    //录制最长时间(分钟)
    recordMaxTime: 5,


    //馆代码
    libCode: 'P1ZJ0571017', //      wsinterlib                  interlibtest


    //朗读模式: 0美文 1朗读 2活动朗读
    readMode: 0,


    //appid && serect
    appid:'wxd693763b0943bfad',
    secret: 'a0dee35d93a9c7e613581448231b8bb6',



  }
})


