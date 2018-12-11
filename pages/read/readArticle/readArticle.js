var util = require('../../../utils/util.js');

//全局
const app = getApp();
var appData = getApp().globalData;
//获取录音实例
const recorderManager = wx.getRecorderManager();
//录音计时器
var recordInterval;
//播放音频
const innerAudioContext = wx.createInnerAudioContext();


Page({

  /**
   * 页面的初始数据
   */
  data: {

    //title
    title: '详情',

    //文章信息
    aTitle: '',
    author: '',
    pubTime: '',
    text: '',
    aCover: '/images/background/bg_view.png',


    //美文阅读1 or 读者朗读2 
    readType: 2,

    //选择读者的音频
    selectReader: false,

    //音频向上向下的箭头
    arrow: '/images/icon/icon_open.png',


    //是否自由朗读
    freeRead: false,

    //准备录制0 or 录制中1 or 录制暂停2 or 录制完成3
    recordStatu: 0,

    //录制icon
    recordIcon: '/images/icon/icon_recording.png',

    //选择背景音乐
    selectMusic: false,

    //弹窗动画
    animationData: null,

    //录制时间
    recordTime: '00:00',
    //录制时间记录
    recordSecond: 0,
    //播放录音进度时间
    playRecord: '00:00',
    //播放录音icon
    playIcon: '/images/icon/icon_play.png',

    //录音路径
    recordPath: null,

    //发布弹窗确认
    showDialog: false,
    //授权弹窗确认
    authorizeConfirm: false,

    //自由朗读录制旋转动画
    animationRound: null,
    //显示旋转动画
    rotate: false,

    //loading
    loading: null,


    //文章id 
    textId: null,


    //返回原文按钮(只有美文的时候才有)
    backArticle: false,

    //读者作品id
    opusId: null,
    //读者作品音频
    readerRecord: null,
    //作品根路径
    readerRecordRoot: app.globalData.urlPath + '/upload/works/',


    //作品读者姓名
    readerName: '选择音频',

    //选择的index
    selectIndex: -1,

    //条形播放进度
    playPercent: 0,

    //背景音乐类型
    bgTList: null,

    //背景音乐
    bList: null,

    //背景类型点击的id
    clickId: -1,

    //点击背景音乐
    clickBg: -1,

    //背景音乐根路径
    bgRootPath: app.globalData.urlPath + '/upload/background/',

    //活动id
    aid: null,

    //读过这篇文章的作品
    rList: null,

    //由排名榜进来
    rankIn: null,


    //是否收藏
    collect: null,

  },



  //回退事件
  backpress: function() {
    wx.navigateBack({

    });
  },



  /******************************原文阅读***************************/
  //原文阅读选择读者的音频
  selectReader: function() {
    var that = this;
    if (that.data.readerName != '本人朗读' && that.data.aid == null && that.data.recordTime != '纯音频' && that.data.rankIn == null) {
      if (that.data.selectReader == false) {

        var animation = wx.createAnimation({
          duration: 200,
          timingFunction: "linear",
          delay: 0
        })

        animation.translateY(300).step()
        this.setData({
          animationData: animation.export(),
          selectReader: true,
          arrow: '/images/icon/icon_close.png',
        })
        setTimeout(function() {
          animation.translateY(0).step()
          this.setData({
            animationData: animation.export()
          })
        }.bind(this), 200);

      } else {

        var animation = wx.createAnimation({
          duration: 200,
          timingFunction: "linear",
          delay: 0
        })

        animation.translateY(300).step()
        this.setData({
          animationData: animation.export(),

        })
        setTimeout(function() {
          animation.translateY(0).step()
          this.setData({
            animationData: animation.export(),
            selectReader: false,
            arrow: '/images/icon/icon_open.png',
          })
        }.bind(this), 200);

      }
    }
  },



  //获取文章信息
  getArtText: function() {
    var that = this;

    wx.request({
      url: app.globalData.urlPath + '/sys/article/' + that.data.textId,
      data: {
        token: app.globalData.token,
        articleId: that.data.textId,
        analysis: 1,

      },
      success: function(res) {
        console.log(res.data);

        //时间
        var fTime = util.formatTime(new Date(res.data.data.intime));

        //文本格式
        var tText = res.data.data.articletext.replace(new RegExp('/t', 'g'), '&emsp;&emsp;');

        that.setData({
          aTitle: res.data.data.titleName,
          author: res.data.data.author,
          pubTime: fTime,
          text: tText,

        });




        //图书封面
        if (res.data.data.img != null) {
          that.setData({
            aCover: app.globalData.urlPath + '/upload/articles/' + res.data.data.img,
          });

        } else {

          that.setData({
            aCover: '/images/background/bg_view.png',
          });

        }


      }
    })

  },



  //获取读过这篇文章的所有作品
  getReadList: function() {
    var that = this;
    var aid = 0;
    if (that.data.aid != null) {
      aid = that.data.aid
    }

    if (that.data.textId != null) {


      wx.request({
        url: app.globalData.urlPath + '/sys/opus',
        data: {
          token: app.globalData.token,
          type: 'LIBRATY',
          page: 1,
          limit: 99,
          articleId: that.data.textId,
          activityId: aid,
        },
        success: function(res) {
          console.log(res);
          that.setData({
            rList: res.data.data
          });

        },
      });
    }
  },




  //阅读美文时点击录制
  toReadyRecord: function() {
    var that = this;
    that.setData({
      readType: 2,
      recordStatu: 0,
    });
  },



  //点击播放音频
  playReaderRecord: function() {
    var that = this;

    if (that.data.readerName != '选择音频') {

      if (that.data.playIcon == '/images/icon/icon_play.png') {
        var path = that.data.readerRecordRoot + this.data.readerRecord;

        console.log(path);

        if (that.data.readerRecord != null) {
          that.playAudio(false, path);

          //记录播放音频
          if (that.data.opusId) {
            that.uploadPlayLog();
          }

        }

      } else {
        that.stopAudio();
      }

    }
  },



  //记录播放音频并上传
  uploadPlayLog: function() {
    var that = this;
    var oid = that.data.opusId;

    console.log(appData.urlPath + '/sys/favories/sys/opus/' + oid + '/play/log?token=' + appData.token + '&opusId=' + oid);

    wx.request({
      url: appData.urlPath + '/sys/opus/' + oid + '/play/log',
      data: {
        token: appData.token,
        opusId: oid,
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res);
      }

    });

  },


  //其中一个读者的作品进行听
  selectReaderListen: function(e) {
    var that = this;
    var rName = e.currentTarget.dataset.rname;
    var rPath = e.currentTarget.dataset.path;
    var index = e.currentTarget.dataset.id;
    var oid = e.currentTarget.dataset.oid;


    that.setData({
      selectIndex: index,
      readerName: rName,
      readerRecord: rPath,
      opusId: oid,

    });

    that.playReaderRecord();
  },




  //单个的收藏
  clickToCollectRecord: function() {
    var that = this;
    var oid = that.data.opusId;
    var collect = that.data.collect;

    if(collect == 'IS'){


      wx.request({
        url: appData.urlPath + '/sys/favories?token=' + appData.token + '&opuseId=' + oid,
        data: {
          token: appData.token,
          opuseId: oid,
        },
        method: 'DELETE',
        success: function (res) {

          if (res.data.code == 0) {
            that.sToast('已取消收藏!');
            that.setData({
              collect: 'NOT'
            });
          }
        },
      });



    }else{

      wx.request({
        url: appData.urlPath + '/sys/favories',
        data: {
          token: appData.token,
          opuseId: oid,
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res);
         
          if (res.data.code == 0) {
            that.sToast('已收藏!');

            that.setData({
              collect: 'IS'
            });
          }
        },
      });



    }

   
  },


  //取消收藏
  cancelCollect: function(e) {
    var that = this;
    var oid = e.currentTarget.dataset.oid;
    var index = e.currentTarget.dataset.id;

    wx.request({
      url: appData.urlPath + '/sys/favories?token=' + appData.token + '&opuseId=' + oid,
      data: {
        token: appData.token,
        opuseId: oid,
      },
      method: 'DELETE',
      success: function(res) {

        if (res.data.code == 0) {
          //改变当前收藏按钮
          var list = that.data.rList;
          list[index].favorties = 'NOT';
          that.setData({
            rList: list,
          });

          that.sToast('已取消收藏');
        }
      },
    });


  },


  //收藏
  btnCollect: function(e) {
    var that = this;
    var oid = e.currentTarget.dataset.oid;
    var index = e.currentTarget.dataset.id;

    wx.request({
      url: appData.urlPath + '/sys/favories',
      data: {
        token: appData.token,
        opuseId: oid,
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.code == 0) {
          //改变当前收藏按钮
          var list = that.data.rList;
          list[index].favorties = 'IS';
          that.setData({
            rList: list,
          });

          that.sToast('已收藏!');
        }
      },
    });


  },




  //显示土司
  sToast: function(text) {
    wx.showToast({
      icon: 'none',
      title: text,
    });

  },






  /******************************自由朗读***************************/
  //自由朗读开始旋转动画
  startRound: function() {
    var animation = wx.createAnimation({
      duration: 2 * 1000,
      timingFunction: "linear",
      delay: 0,
    });
    //旋转动画定时器
    var interval = null;
    //旋转角度rotate的值是上一次结束时的值，不然会出现倒退
    var rotate = 0;
    //连续动画需要添加定时器,所传参数每次+1就行
    interval = setInterval(function() {
      rotate = ++rotate;
      console.log(rotate);

      animation.rotate(360 * rotate).step();

      this.setData({
        animationRound: animation.export(),

      })
    }.bind(this), 2000);
  },



  //自由朗读停止旋转动画
  stopRound: function() {
    //停止旋转动画
    clearInterval(interval);

  },







  /******************************朗读录制操作***************************/
  //点击选择朗读背景音乐
  readArtBackground: function() {
    var that = this;
    if (that.data.selectMusic == false) {

      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })

      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        selectMusic: true
      })
      setTimeout(function() {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200);

    } else {

      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })

      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),

      })
      setTimeout(function() {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          selectMusic: false
        })
      }.bind(this), 200);

    }
  },


  //退出选择朗读背景音乐
  outSelectBg: function() {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),

    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        selectMusic: false
      })
    }.bind(this), 200);
  },



  //点击无背景音乐
  clickNoBg: function() {
    this.setData({
      clickId: -1,
      bList: [],
    });

    //停止播放音乐
    innerAudioContext.stop();

  },




  //接口获取背景音乐类型
  getBackgroundType: function() {
    var that = this;
    wx.request({
      url: app.globalData.urlPath + '/sys/music-type',
      data: {
        token: app.globalData.token,
        page: 1,
        limit: 99,
      },
      success: function(res) {
        that.setData({
          bgTList: res.data.data
        });

      },
    });
  },




  //接口获取背景音乐列表
  getBackgroundList: function(tId) {
    var that = this;
    wx.request({
      url: app.globalData.urlPath + '/sys/music',
      data: {
        token: app.globalData.token,
        page: 1,
        limit: 99,
        typeId: tId,
      },
      success: function(res) {
        console.log(res);
        that.setData({
          bList: res.data.data,
        });
      },
    });
  },



  //点击背景音乐类型
  clickBackgroundType: function(e) {
    //停止播放音乐
    innerAudioContext.stop();

    var that = this;
    var t = e.currentTarget.dataset.tid;

    that.setData({
      clickBg: -1,
      clickId: e.currentTarget.dataset.id,
    });

    that.getBackgroundList(t);

  },




  //点击其中的一首背景音乐
  clickBackground: function(e) {
    var that = this;
    that.setData({
      clickBg: e.currentTarget.dataset.id,
    });

    //背景音乐路径
    var path = e.currentTarget.dataset.path;
    console.log(path);

    path = that.data.bgRootPath + path;
    that.playAudio(true, path);
  },





  //退回美文朗读
  backToArticleRead: function() {
    var that = this;
    that.setData({
      readType: 1,
    });

  },



  //获取录音授权
  getAuthorise: function() {
    var that = this;
    wx.authorize({
      scope: 'scope.record',
      fail() {
        //授权失败
        that.setData({
          authorizeConfirm: true,
        });
      },
    })
  },


  //点击设置授权录音
  openSetting: function(e) {
    var that = this;
    if (e.detail.authSetting["scope.record"]) {
      that.setData({
        authorizeConfirm: false,
      });
    }
  },


  //录音时间计算
  recordTime: function(time) {
    var that = this;
    var m;
    var s;
    var show;
    recordInterval = setInterval(function() {
      //加一
      ++time;
      //毫秒时间计算转换
      m = parseInt(time / 60);
      s = parseInt(time % 60);
      if (s < 10) {
        show = '0' + m + ':0' + s;
      } else {
        show = '0' + m + ':' + s;
      }
      //显示时间
      that.setData({
        recordTime: show,
        recordSecond: time,
      });

    }.bind(this), 1000);
  },






  //点击开始录制
  startRecord: function() {
    var that = this;
    //录音参数
    var options = {
      duration: 1000 * 60 * app.globalData.recordMaxTime,
      sampleRate: 8000,
      encodeBitRate: 48000,
      format: 'mp3',
    };
    //录制开始
    recorderManager.start(options);
    //开始计算计时
    that.recordTime(0);
    //参数修改
    that.setData({
      recordStatu: 1,
      selectMusic: false,
    });




    //超出规定录制时间
    recorderManager.onStop((res) => {
      that.setData({
        recordStatu: 3,
        recordPath: res.tempFilePath,
      });
      //停止计时器
      clearInterval(recordInterval);
      var t = app.globalData.recordMaxTime;
      // wx.showToast({
      //   icon: 'none',
      //   title: '录制不能超过' + t + '分钟',
      // });

      //停止播放音乐
      innerAudioContext.stop();
    })
  },




  //暂停录制和继续录制
  pauseRecord: function() {
    var that = this;
    if (that.data.recordStatu == 1) {
      //暂停
      recorderManager.pause();
      recorderManager.onPause(() => {
        //参数修改
        that.setData({
          recordStatu: 2,
          recordIcon: '/images/icon/icon_ready_record.png',
        });
        //停止计时器
        clearInterval(recordInterval);
      })
    } else {
      //继续录音
      recorderManager.resume();
      //参数修改
      that.setData({
        recordStatu: 1,
        recordIcon: '/images/icon/icon_recording.png',
      });
      //重启计时器
      that.recordTime(that.data.recordSecond);
    }
  },



  //完成录制
  finishRecord: function() {
    var that = this;
    recorderManager.stop();
    //停止计时器
    clearInterval(recordInterval);
    //获取音频
    recorderManager.onStop((res) => {
      that.setData({
        recordStatu: 3,
        recordPath: res.tempFilePath,

      });
     
    });

    //停止播放音乐
    innerAudioContext.stop();
    innerAudioContext.onStop(() => {
      that.setData({
        playIcon: '/images/icon/icon_play.png',
        playRecord : '00:00'
      });
    });
   
  },






  //预听录音
  playRecord: function() {
    if (this.data.playIcon == '/images/icon/icon_play.png') {
      this.playAudio(false, this.data.recordPath);
    } else {
      this.stopAudio();
    }
  },




  //重新录音
  restartRecord: function() {
    var that = this;
    that.setData({
      recordStatu: 0,
      recordTime: '00:00',
    });
    innerAudioContext.stop();

  },



  //保存录音(上传到服务器)
  saveRecord: function() {
    var that = this;
    that.setData({
      loading: '上传中..'
    });
    innerAudioContext.stop();
    that.uploadRecord(0);


  },



  //点击发布录音
  publishRecord: function() {
    var that = this;
    that.setData({
      showDialog: true,

    });
  },



  //点击确认发布
  confirmPublish: function() {
    var that = this;
    that.setData({
      loading: '上传中..',
      showDialog: false,
    });
    innerAudioContext.stop();
    that.uploadRecord(1);
  },




  //点击取消发布
  cancelPublish: function() {
    var that = this;
    that.setData({
      showDialog: false,
    });
  },



  //上传作品接口(0不发布 1发布)
  uploadRecord: function(pub) {
    var that = this;
    wx.uploadFile({
      url: app.globalData.urlPath + '/sys/opus/upload?token=' + app.globalData.token,
      filePath: that.data.recordPath,
      name: 'file',
      // formData: {
      //   'token': app.globalData.token,
      // },
      success: function(res) {

        //格式转换
        var jsonStr = res.data;
        jsonStr = jsonStr.replace(" ", "");
        if (typeof jsonStr != 'object') {
          jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
          var jj = JSON.parse(jsonStr);
          res.data = jj;
          console.log(res.data);
        };


        if (res.data.code == 0) {

          //自由朗读和文章朗读
          var rData = {};

          if (that.data.aid != null) {
            if (that.data.freeRead) {
              rData = {
                token: app.globalData.token,
                activityId: that.data.aid,
                opusPath: res.data.data.opus,
                opusStart: pub == 0 ? 'NOT_AUDIT' : 'UNREVIEWED',
              }
            } else {
              rData = {
                token: app.globalData.token,
                activityId: that.data.aid,
                articleId: that.data.textId,
                opusPath: res.data.data.opus,
                opusStart: pub == 0 ? 'NOT_AUDIT' : 'UNREVIEWED',
              }
            }

          } else {
            if (that.data.freeRead) {
              rData = {
                token: app.globalData.token,
                opusPath: res.data.data.opus,
                opusStart: pub == 0 ? 'NOT_AUDIT' : 'UNREVIEWED',
              }
            } else {
              rData = {
                token: app.globalData.token,
                articleId: that.data.textId,
                opusPath: res.data.data.opus,
                opusStart: pub == 0 ? 'NOT_AUDIT' : 'UNREVIEWED',
              }
            }

          }


          //提交朗读其它数据
          wx.request({
            url: app.globalData.urlPath + '/sys/opus',
            data: rData,
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {

              if (res.data.code == 0) {

                if (pub == 0) {


                  wx.showToast({
                    duration: 1000 * 2,
                    title: '保存成功!',
                  });

                  that.setData({
                    recordStatu: 0,
                  });

                } else {

                  wx.showToast({
                    duration: 1000 * 2,
                    title: '已提交，待审核',
                  });

                  that.setData({
                    recordStatu: 0,
                  });

                }



              } else {
                that.showT('上传失败!!!:' + res.data.msg);
              }

            }
          });

        } else {
          that.showT('上传中断!!!');
        }
      },

      complete: function() {
        that.setData({
          loading: null
        })
      },
    })
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
        // if (s < 10) {
        //   that.setData({
        //     totalTime: "0" + m + ":0" + s
        //   });

        // } else {
        //   that.setData({
        //     totalTime: "0" + m + ":" + s
        //   });
        // };
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



  //土司
  showT: function(t) {
    wx.showToast({
      icon: 'none',
      title: t,
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //是否自由朗读
    if (options.free == 1) {
      this.setData({
        freeRead: true,
        title: '自由朗读'
      });

      //自由朗读听
      if (options.path != null) {
        this.setData({
          recordTime: '纯音频',
        })
      }
    }


    //文章id
    var id = options.id;
    if (id != null) {
      this.setData({
        textId: id,
      });
      //获取文章内容
      this.getArtText();
      this.getReadList();
    }



    //美文品读 or 朗读
    if (app.globalData.readMode == 0) {
      this.setData({
        readType: 1,
      });
    }


    //其它页面传进作品音频
    var path = options.path;
    if (path != null) {
      this.setData({
        readerRecord: path,
        readType: 1,
      });
    };


    //其它页面创进来作品的id
    var oid = options.oid;
    if (oid != null) {
      this.setData({
        opusId: oid,
      });

    }




    //其它页面传进读者姓名
    var name = options.name;
    if (name != null) {
      this.setData({
        readerName: name,
      });
    };

    //活动id
    var aid = options.aid;
    if (aid != null) {
      this.setData({
        aid: aid,
      });

    };


    //由排行榜进来
    var rank = options.rank;
    if (rank) {
      this.setData({
        rankIn: rank
      });
    };



    //是否收藏
    var collect = options.collect;
   
    if (collect) {
      this.setData({
        collect: collect
      });
    };




    //获取背景音乐类型
    this.getBackgroundType();

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
    //保存亮屏
    wx.setKeepScreenOn({
      keepScreenOn: true,
    });
    //获取授权
    this.getAuthorise();


    //显示返回美文按钮
    if (app.globalData.readMode == 0) {
      this.setData({
        backArticle: true
      });
    };

  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    //停止录制
    recorderManager.stop();
    //停止播放
    innerAudioContext.stop();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

    //停止录制
    recorderManager.stop();
    //停止播放
    innerAudioContext.stop();

  },




})