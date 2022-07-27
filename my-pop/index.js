// components/my-component/my-pop/index.js

let animationPop = null;
let animationMask = null;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    config: {
      type: Object,
      value: {}
    }
  },

  observers: {
    //监听config
    config(configObj) {
      let config = this.data.popConfig;
      for (const key in configObj) {
        //hasOwnProperty.call 判断属性是否定义在对象本身而非继承自原型链
        if (Object.hasOwnProperty.call(configObj, key)) {
          config[key] = configObj[key];
        }
      }
      this.setData({
        popConfig: config,
      })
    }
  },

  ready() {
    // this.init();

    // setTimeout(()=>{
    //   console.log(23);
    //   this.show(true);
    // },2000)

    // setTimeout(()=>{
    //   console.log(56);
    //   this.show(false);
    // },4000)

  },

  /**
   * 组件的初始数据
   */
  data: {
    popConfig: {
      width: 500, //宽度 mode=center生效
      height: 500, // 高度
      mode: "center", // left / right / width / height / center
      mask: false, // 遮罩
      maskClose: true, // 点击遮罩关闭
      zIndex: 1001, // 层级
      backgroundColor: "pink"
    },

    //微信小程序顶部导航栏高度 即:顶部标题+状态栏高度 
    // ios:44 android:48
    //计算: statusBarHeight + ios?'44':'48
    windowStatusHeight: '',

    //微信小程序底部tabbar高度 通过 手机视口高度 - 顶部导航栏高度 - 屏幕窗口高度
    windowTabbarHeight: '',

    // 动画属性
    popAnimation: null,
    maskAnimation: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPopDialog() {

    },

    // 初始化 
    init() {
      console.log('init() 初始化');
      console.log(this.data.popConfig);
      //获取手机及屏幕信息
      wx.getSystemInfoAsync({
        success: (system) => {
          console.log(system);
          /**
           * screenHeight:812 屏幕视口高度
           * safeArea.top: 手机顶部安全栏
           * statusBarHeight:手机顶部状态栏高度
           * windowHeight:屏幕窗口高度(中间部分)
           * platform:手机机型类别 ios / android
           */
          this.setData({
            systemInfo: system,
            windowStatusHeight: system.platform == "ios" ? 44 : 48 + system.statusBarHeight,
            windowTabbarHeight: system.screenHeight - system.windowHeight - (system.platform == "ios" ? 44 : 48 + system.statusBarHeight)
          })
          // console.log(this.data.windowStatusHeight);
          // console.log(this.data.windowTabbarHeight);
        },
        fail: (rej) => {
          console.log(rej);
        },
      })

      //初始化动画
      animationPop = wx.createAnimation({
        duration: 250,
        timingFunction: "ease-out",
      })

      if (this.data.popConfig) {
        //true 加载mask动画
        animationMask = wx.createAnimation({
          delay: 20,
          timingFunction: "ease-out",
        })
      }
    },

    show(flag) {
      if (flag) {
        // 判断是否有mask动画
        if (this.data.popConfig.mask && animationMask) {
          animationMask.backgroundColor("rgba(0,0,0,.4)").step();
          this.setData({
            maskAnimation: animationMask.export()
          })
        }
      } else {
        if (this.data.popConfig.mask && animationMask) {
          animationMask.backgroundColor("rgba(0,0,0,0)").step();
          this.setData({
            maskAnimation: animationMask.export()
          })
        }
      }
      // switch pop动画
      switch (this.data.popConfig.mode) {
        case "left":
          console.log("left弹窗");
          if (flag) {
            animationPop.opacity(1)
            animationPop.width(`${this.data.popConfig.width}rpx`);
            animationPop.step();
            this.setData({
              popAnimation: animationPop.export()
            })
          } else {
            animationPop.opacity(0)
            animationPop.width(0);
            animationPop.step();
            this.setData({
              popAnimation: animationPop.export()
            })
          }
          break;
        case "right":
          console.log("right");
          break;
        case "top":
          console.log("top");
          break;
        case "bottom":
          console.log("bottom");
          break;
        case "center":
          console.log("center");
          //center animation
          if (flag) {
            animationPop.opacity(1)
            animationPop.height(`${this.data.popConfig.height}rpx`);
            animationPop.width(`${this.data.popConfig.width}rpx`);
            animationPop.step();
            this.setData({
              popAnimation: animationPop.export()
            })
          } else {
            //有mask动画
            if (this.data.popConfig.mask && animationMask) {
              animationMask.backgroundColor("rgba(0,0,0,0)").step();
              this.setData({
                maskAnimation: animationMask.export()
              })
            }


            animationPop.opacity(0)
            animationPop.height(`${this.data.popConfig.height - 50}rpx`);
            animationPop.width(`${this.data.popConfig.width - 50}rpx`);
            animationPop.step();
            this.setData({
              popAnimation: animationPop.export()
            })
          }
          break;

      }

      console.log('show弹窗');

    },

    closeDialog() {
      if (this.data.popConfig.maskClose) {
        this.show(false);
      }
    }
  }
})