// components/com_navigationBar/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    // 首页地址
    homePage: {
      type: String,
      value: '/pages/home/index'
    },
    // 是否显示返回按钮
    isReback: {
      type: Boolean,
      value: false
    },
    // 是否tabbar页面
    isBarPage: {
      type: Boolean,
      value: false
    },
    tabbarColor:{
      type:String,
      value:'#fff'
    },
    // 当前tabBar列表
    tabBarList: {
      type: Array,
      value: []
    },
    // 顶部标题栏是否为空
    isTopNone: {
      type: Boolean,
      value: false
    },
    // 顶部标题栏是否fixed
    isTopFixed: {
      type: Boolean,
      value: false
    },
    // 顶部标题栏文字颜色
    color: {
      type: String,
      value: '#000000'
    },
    // 顶部标题栏背景色
    topBackground: {
      type: String,
      value: '#FFFFFF'
    },
    // 底部背景色
    bottomBackground: {
      type: String,
      value: ''
    },
    boxShadow: {
      type: String,
      value: ''
    },
    // icon颜色
    iconColor: {
      type: String,
      value: '#000000'
    },
    // 底部安全区域
    safeAreaInsetBottom: {
      type: Boolean,
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    platform: wx.getSystemInfoSync().platform,
    isHome: false,
    currentPagePath:'/pages/home/index',
  },
  ready() {
    this.getRouter()
    console.log(this.data.tabBarList);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取路由
    getRouter() {
      const page = getCurrentPages()
      console.log(page[0].route);
      this.setData({
        isHome: !this.properties.isBarPage && page.length === 1,
        currentPagePath:page[0].route
      })
    },
    // 返回上一页
    returnBack() {
      wx.navigateBack({})
    },
    // 返回首页
    returnHome() {
      wx.reLaunch({
        url: this.properties.homePage,
      })
    },
    // 切换tabbar页面
    selectTab(e) {
      const { page } = e.currentTarget.dataset
      console.log(page);
      wx.switchTab({
        url: `/${page}`,
        success:(e) => {
          console.log(e);
        },
        fail:(e)=>{
          console.log(e);
        }
      })
    },
    // 跳转
    toGo(e) {
      const { url } = e.currentTarget.dataset
      wx.navigateTo({
        url,
        fail: () => {
          wx.switchTab({
            url
          })
        }
      })
    },
  }
})
