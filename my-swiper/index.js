// components/my-component/my-swiper/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // dataList
    swiperList:{
      type:Array,
      value:[],
    },
    //swiper width
    swiperWdith:{
      type:String,
      value:"750rpx",
    },
    //swiper height
    swiperHeight:{
      type:String,
      value:"300rpx",
    },
    // image width
    imageWidth:{
      type:String,
      value:"690rpx",
    },
    // image height
    imageHeight:{
      type:String,
      value:"100%",
    },
    // swiper-item 前后间距
    marginPreNex:{
      type:String,
      value:"-10rpx"
    },
    // swiper background-color
    backgroundColor:{
      type:String,
      value:"#fff"
    },
    // 是否显示面板指示点
    indicatorDots:{
      type:Boolean,
      value:true
    },
    // 指示点颜色
    indicatorColor:{
      type:String,
      value:"#fff"
    },
    // 选中指示点的颜色
    indicatorActiveColor:{
      type:String,
      value:"#333"
    },
    // 自动切换时长
    interval:{
      type:Number,
      value:5000
    },
    autoplay:{
      type:Boolean,
      value:true
    },
    // 动画滑动时长
    duration:{
      type:Number,
      value:500
    },
    // 衔接滑动
    circular:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready() {
    console.log("swiperList:",this.properties.swiperList);
  },

  /**
   * 组件的方法列表
   */
  methods: {
      
  }
})
