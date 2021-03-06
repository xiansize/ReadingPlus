var appData = getApp().globalData;
//播放音频
const innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //作品id
    recordId : null,

    //活动id
    aid: null,
    //活动封面根地址
    aPath: appData.urlPath + '/upload/poster/',
    //活动封面
    cover: null,

    //作品音频
    rPath: null,
    //作品id : 
    rid: null,
    //播放时间
    playRecord: '00:00',
    //播放总长度
    totalTime: '00:00',
    //播放进度
    playPercent: 0,
    //音频播放icon
    playIcon: '/images/icon/icon_play.png',
    //作品音频播放根目录
    pPath: appData.urlPath + '/upload/works/',


    //文章
    aTitle: null,
    author: 'author',
    text: '',
    


    //读者
    avatar: null,
    rName: '',


    //排行
    ranking: 0,
    //票数
    vote: 0,

    //排行榜的数据
    rList: [],

    //分页
    cPage: 1,
    more: null,

    //loading
    loading: null,

  },

  //点击播放
  btnPlay: function() {
    var that = this;
    if (that.data.playIcon == '/images/icon/icon_play.png') {
      var path = that.data.pPath + that.data.rPath;
      that.playAudio(false, path);

    } else {
      that.stopAudio();
    }


  },


  //播放音频
  playAudio: function(loop, path) {
    var that = this;
    //是否循环播放
    innerAudioContext.autoplay = loop;
    //音频地址
    innerAudioContext.src = path;
    //播放音频
    innerAudioContext.play();
    innerAudioContext.onPlay(() => {
      that.setData({
        playIcon: '/images/icon/icon_pause.png',
        loading: null,
      });
      console.log('开始播放')
    });


    //播放缓存
    innerAudioContext.onWaiting(() => {
      that.setData({
        loading: '加载一下..',
      });
    });


    //播放进度
    innerAudioContext.onTimeUpdate(() => {
      //当前播放时间
      console.log("currentTime的值：", innerAudioContext.currentTime);
      var cTime = Math.ceil(innerAudioContext.currentTime);
      if (cTime != 0) {
        //换算成分秒
        var s = cTime % 60;
        var m = parseInt(cTime / 60);
        if (s < 10) {
          that.setData({
            playRecord: "0" + m + ":0" + s
          });

        } else {
          that.setData({
            playRecord: "0" + m + ":" + s
          });

        };
      } else {
        that.setData({
          playRecord: "00:00",
        });
      }


      //音频总长时间
      var tTime = Math.ceil(innerAudioContext.duration);
      if (tTime != 0) {
        //换算成分秒
        var s = tTime % 60;
        var m = parseInt(tTime / 60);
        if (s < 10) {
          that.setData({
            totalTime: "0" + m + ":0" + s
          });

        } else {
          that.setData({
            totalTime: "0" + m + ":" + s
          });
        };
      }


      //进度条的变化
      var pTime = cTime / tTime * 100;
      console.log(pTime);
      that.setData({
        playPercent: pTime,
      });


    });



    //自然播放完毕
    innerAudioContext.onEnded(() => {
      that.setData({
        playIcon: '/images/icon/icon_play.png',
      });
    });


    //播放错误
    innerAudioContext.onError((res) => {
      wx.showToast({
        duration: 1000 * 3,
        icon: 'none',
        title: '错误：' + res.errCode + res.errMsg,
      });
    })

  },



  //停止播放音频
  stopAudio: function() {
    var that = this;
    //停止播放
    innerAudioContext.stop();
    innerAudioContext.onStop(() => {
      that.setData({
        playIcon: '/images/icon/icon_play.png',
      });
    });
  },



  //点击投票
  btnVote: function() {
    var that = this;
    that.requestLike(that.data.rid);

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

              //获取其它信息
              that.getRecordInfo();

              //隐藏loading
              that.setData({
                loading: null,
              });

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


  //活动详情
  getDetail: function(aid) {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/activity-main/' + aid,
      data: {
        token: appData.token,
        id: aid,
        analysis: 1,
      },
      success: function(res) {
        console.log(res);
        var cover = that.data.aPath + res.data.data.img
        that.setData({
          cover: cover
        });
      },
    });
  },



  //通过作品id获取信息
  getRecordInfo: function() {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/opus/key/' + that.data.rid,
      data: {
        token: appData.token,
        //id: 145,
      },
      success: function(res) {
        console.log(res);
        if (res.data.code == 0) {
          var cover = that.data.aPath + res.data.data.activityImg;
          that.setData({
            cover: cover,
            avatar: res.data.data.readerWeChatprofilePhoto,
            rName: res.data.data.readerWeChatName,
            ranking: res.data.data.ranking,
            vote: res.data.data.pollCount,
            aid : res.data.data.activityId,
            rPath: res.data.data.opusPath,
            aTitle: res.data.data.titleName != null ? res.data.data.titleName : '自由朗读'
          });


          //显示文章名
          if(res.data.data.titleName){
            wx.setNavigationBarTitle({
              title: res.data.data.titleName
            });
          }else{
            wx.setNavigationBarTitle({
              title: "自由朗读"
            });
          }


          //获取活动所有作品
          that.getRList();
          

        } else {
          wx.showToast({
            icon: 'none',
            title: '',
          })
        }

      },
      fail: function() {
        wx.showToast({
          icon: 'none',
          title: '连接服务器失败',
        })
      },
    });

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


  //投票接口
  requestLike: function(id) {
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
          var vote = that.data.vote;
          vote++;
          that.setData({
            vote: vote
          });

          wx.showToast({
            title: '投票成功',
          });

        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          });
        }

      },
    });

  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      rid: options.rid,
    });
    //获取馆代码
    var code = options.code;
    if (code != null) {
      //全局馆代码
      getApp().globalData.libCode = code;
      //缓存
      wx.setStorageSync('code', code);
    }
    //显示loading
    this.setData({
      loading: '加载一下',
    });
    //获取token
    this.getToken();



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
    this.stopAudio();

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.stopAudio();

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
    this.getRList();

  },

  /**
   * 页面分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    var lid = appData.libCode;
    return {
      title: '您的好友向您发送了活动邀请，快来看看吧',
      path: 'pages/activity/activtyShare/activityShare?code=' + lid +'&rid=' + that.data.rid,
      imageUrl: '/images/background/bg_share.png', 
      success: function(res) {

      },
      fail: function(res) {

      },
    }

  }


})