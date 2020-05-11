var util = require('../../../utils/util.js');

var appData = getApp().globalData;


Page({

  /**
   * 页面的初始数据
   */
  data: {


    //已发布1 or 未发布2
    view: 2,

    //显示弹窗
    showDialog: false,

    //未发布的作品
    uPList: null,

    //发布的作品
    pList: null,

    //文章封面根地址
    cPath: appData.urlPath + '/upload/articles/',

    //读者作品Id
    rId: null,

    //开始坐标
    startX: 0,
    startY: 0,

    //自己的头像
    avatar: null,

    //自己的名字
    nickname: null,

    //其它读者的主页
    otherReader: false,

    //自己的被收藏数
    collect: null,

    //读者id
    rid: null,

    //more
    more: null,

    //当前第几页
    cPage: 1,

    //开启时间
    fTime : '2018-09-10 12:12'


  },



  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.uPList.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;

    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      uPList: this.data.uPList
    })
  },

  //滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.uPList.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true

      }
    })
    //更新数据
    that.setData({
      uPList: that.data.uPList
    })
  },


  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);

  },




  //删除事件
  del: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '真的要删除？',
      cancelText: '不是',
      cancelColor: '#55555',
      confirmText: '是的',
      confirmColor: '#6292FF',
      success: function(res) {
        if (res.confirm) {
          that.getDelete(e);
        }
      },
    });
  },



  //进行删除
  getDelete: function(e) {
    this.data.uPList.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      uPList: this.data.uPList
    });

    //作品的id
    var id = e.currentTarget.dataset.rid;
    this.deleteRecord(id);

  },




  //回退事件
  backpress: function() {
    wx.navigateBack({});
  },



  //导航已发布
  navToPub: function() {
    var that = this;
    if (that.data.view == 2) {
      that.setData({
        view: 1,
      })
    };
    //that.getRecordList('RELEASE');

  },




  //导航未发布
  navToNotPub: function() {
    var that = this;
    if (that.data.view == 1) {
      that.setData({
        view: 2
      })
    };
    //that.getRecordList('UNRELEASE');

  },




  //获取作品接口
  getRecordList: function(status) {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/opus',
      data: {
        token: appData.token,
        type: 'PERSONAGE',
        page: 1,
        limit: 99,
        opusStart: status,
        activityId : 0,
      },
      success: function(res) {
        console.log(res);
        that.transforTime(res.data.data);
      },
    });

  },



  //转换时间,添加是否左滑
  transforTime: function(list) {
    var that = this;
    for (var i = 0; i < list.length; i++) {
      list[i].intime = util.formatTimeMi(new Date(list[i].intime));
      list[i].isTouchMove = false;
    }

    if (that.data.view == 2) {
      //未发布
      that.setData({
        uPList: list,
      });

    } else {
      //已发布
      that.setData({
        pList: list,
      });
    }

  },



  //未发布点击去听
  clickToListen: function(e) {
    var that = this;
    var aid = e.currentTarget.dataset.aid;
    var path = e.currentTarget.dataset.path;
    var touch = e.currentTarget.dataset.touch;

    if (touch == false) {
      if (aid != null) {
        wx.navigateTo({
          url: '../../read/readArticle/readArticle?id=' + aid +
            '&path=' + path +
            '&name=' + '本人朗读',
        });
      } else {
        wx.navigateTo({
          url: '../../read/readArticle/readArticle?free=' + 1 +
            '&path=' + path +
            '&name=' + '本人朗读',
        });
      }

    }
  },



  //已发布点击去听
  clickToRecord: function(e) {
    var that = this;
    var aid = e.currentTarget.dataset.aid;
    var path = e.currentTarget.dataset.path;
    var oid = e.currentTarget.dataset.oid;
    var collect = e.currentTarget.dataset.collect;

    if (that.data.rid == null) {
      
      //本人朗读
      if (aid != null) {
        wx.navigateTo({
          url: '../../read/readArticle/readArticle?id=' + aid +
            '&path=' + path +
            '&name=' + '本人朗读' +
            '&oid=' + oid,
        });
      } else {
        wx.navigateTo({
          url: '../../read/readArticle/readArticle?free=' + 1 +
            '&path=' + path +
            '&name=' + '本人朗读' +
            '&oid=' + oid,
        });
      };

    } else {
      
      //其他读者
      if (aid != null) {
        wx.navigateTo({
          url: '../../read/readArticle/readArticle?id=' + aid +
            '&path=' + path +
            '&name=' + that.data.nickname + ' 朗读' +
            '&oid=' + oid +
            '&rank=1' +
            '&collect=' + collect
        });
      } else {
        wx.navigateTo({
          url: '../../read/readArticle/readArticle?free=' + 1 +
            '&path=' + path +
            '&name=' + that.data.nickname + ' 朗读' + 
            '&oid=' + oid +
            '&rank=1' + 
            '&collect=' + collect
        });
      };
    }
  },





  //点击发布按钮
  clickPublish: function(e) {
    var id = e.currentTarget.dataset.rid;
    var that = this;
    that.setData({
      showDialog: true,
      rId: id,
    });
  },





  //点击弹窗确定
  clickConfirm: function() {
    this.setData({
      showDialog: false,
    });
    this.publishRecord();
  },



  
  //点击弹窗取消
  clickCancel: function() {
    this.setData({
      showDialog: false,
    });

  },


  //发布接口
  publishRecord: function() {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/opus/' + that.data.rId + '?token=' + appData.token + '&opusId=' + that.data.rId + '&opusStart=UNREVIEWED',
      data: {
        token: appData.token,
        opusId: that.data.rId,
        opusStart: 'UNREVIEWED',
      },
      method: 'PUT',
      success: function(res) {
        console.log(res);

        if (res.data.code == 0) {
          that.showT('发布成功');
          that.getRecordList('UNRELEASE');
        } else {
          that.showT('发布失败');
        }
      },
    });
  },







  //删除接口
  deleteRecord: function(id) {
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/opus/' + id + '?token=' + appData.token + '&opusId=' + id,
      data: {
        token: getApp().globalData.token,
        opusId: id,
      },
      method: 'DELETE',
      success: function(res) {
        console.log(res);
      },
    });
  },



  //读者信息和发布作品
  getUserInfoList: function(rid) {
   
    var that = this;
    wx.request({
      url: appData.urlPath + '/sys/reader/'+rid+'/opus',
      data: {
        token: appData.token,
        rdId: rid,
        opusStart: 'RELEASE',
        start : 1,
      },
      success: function(res) {
        console.log(res);

        //时间
        var t = util.formatTimeMi(new Date(res.data.data.intime));

        that.setData({
          avatar: res.data.data.profilePhoto,
          nickname: res.data.data.name,
          collect: res.data.data.opusCount,
          fTime : t,
        });

        //转换时间
        var list = res.data.data.opusVos;
        if(list != null){
          for (var i = 0; i < list.length; i++) {
            list[i].intime = util.formatTimeMi(new Date(list[i].intime));
            list[i].isTouchMove = false;
          };
          that.setData({
            pList: list,
          });

        }
       
      },
    });
  },



  //弹窗
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
    //其他读者
    var that = this;
    var rid = options.rid;
    

    if (rid != null) {
      that.setData({
        otherReader: true,
        view: 1,
        rid: rid,
      });
     

    } else {
      that.getUserInfoList(0);
      that.getRecordList('UNRELEASE');

    }

    //先展示发布
    if (options.view != null) {
      that.setData({
        view: options.view,
      });
    }


  },

 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //先是美文朗读
    appData.readMode = 0;


    if(this.data.rid){
      this.getUserInfoList(this.data.rid);
    }

  },


  //分享转发
  onShareAppMessage: function (res) {
    var lid = getApp().globalData.libCode;
    return {
      title: '朗读云陪你一起朗读',
      path: 'pages/index/index?code=' + lid,
      imageUrl: '/images/background/bg_share.png', 
      success: function (res) {

      },
      fail: function (res) {

      },
    }
  },


})