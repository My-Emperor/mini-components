<template>
  <view class="mini-lyrics-box">
    <!--  歌词版  -->
    <view class="lyric-box">
      <scroll-view
          class="lyric-scroll-view"
          :scroll-y="true"
          :scroll-top="scrollTop"
          :scroll-with-animation="true"
          @scroll="eventScroll"
          :show-scrollbar="false"
          @touchstart="touchStart"
          @touchend="touchEnd"
          @touchcancel="touchCancel"
      >
        <view class="lyric-scroll-list">
          <view v-for="(item,index) in lyricList" :key="index"
                :class="['lyric-scroll-item',activeIndex==index?'active-lyric-item':'']">{{ item.text }}
          </view>
        </view>
      </scroll-view>
      <view v-if="showScrollActiveLine" class="scroll-active-line"></view>
    </view>
    <!--  歌词组件  -->
    <view class="audio-components"></view>
  </view>
</template>

<script>
/**
 *   歌词显示组件
 *   1.声词同步
 *    解析歌词数据
 *    处理歌词与对应时间段进行匹配
 *   2.可滑动屏幕到指定位置
 */
export default {

  name: "index",
  data() {
    return {
      innerAudioContext:null,
      audioUrl: 'http://cdn.hanzigon.cn//word_library/video_play/new/three_up/kw1.mp3',
      content: "[00:02.63]大青树下的小学\r\n[00:05.01]\r\n[00:09.40]早晨，从山坡上，\r\n[00:13.00]从坪坝里，\r\n[00:15.45]从一条条开着绒球花\r\n[00:18.72]和太阳花的小路上，\r\n[00:21.70]走来了许多小学生，\r\n[00:24.78]有汉族的，\r\n[00:27.10]有傣族的，\r\n[00:29.75]有景颇族的，\r\n[00:32.75]还有阿昌族和德昂族的。\r\n[00:37.17]大家穿戴不同，\r\n[00:39.82]来到学校，\r\n[00:41.60]都成了好朋友。\r\n[00:44.21]那鲜艳的服装，\r\n[00:47.46]把学校打扮得绚丽多彩。\r\n[00:52.60]同学们向在校园里\r\n[00:55.39]欢唱的小鸟打招呼，\r\n[00:58.68]向敬爱的老师问好，\r\n[01:02.30]向高高飘扬的国旗敬礼。\r\n[01:07.13]“当，当当！当，当当！\r\n[01:13.26]大青树上的铜钟敲响了。”\r\n[01:18.94]上课了，\r\n[01:20.69]不同民族的小学生，\r\n[01:22.47]在同一间教室里学习。\r\n[01:25.63]大家一起朗读课文，\r\n[01:28.77]那声音真好听！\r\n[01:32.35]这时候，\r\n[01:33.70]窗外十分安静，\r\n[01:37.38]树枝不摇了，\r\n[01:40.12]鸟儿不叫了，\r\n[01:42.98]蝴蝶停在花朵上，\r\n[01:46.11]好像都在听同学们读课文。\r\n[01:50.43]最有趣的是，\r\n[01:52.74]跑来了两只猴子。\r\n[01:55.43]这些山林里的朋友，\r\n[01:59.50]是那样好奇地听着。\r\n[02:02.42]下课了，\r\n[02:04.02]大家在大青树下跳孔雀舞、\r\n[02:08.10]摔跤、做游戏，\r\n[02:11.10]招引来许多小鸟，\r\n[02:13.81]连松鼠、山狸也赶来看热闹。\r\n[02:19.15]这就是我们可爱的小学，\r\n[02:22.78]一所边疆的小学。\r\n[02:26.17]古老的铜钟，\r\n[02:28.10]挂在大青树粗壮的枝干上。\r\n[02:32.38]凤尾竹的影子，\r\n[02:35.13]在洁白的粉墙上摇晃……\r\n[02:39.57]\r\n[02:40.84]\r\n",
      lyricList: [],

      activeIndex: 0,
      currentIndex:0,

      //scrollView滚动高度
      scrollTop: 0,

      //歌词dom高度
      lyricListHeight:0,
      lyricItemHeight:0,

      //滑动选中指示线
      showScrollActiveLine:false,

      //手动滑动的高度
      touchScrollTop:0,
    }
  },
  created() {
    let list = this.content.split('\r\n');
    this.getLyricList(list);
    this.initAudio();
    // setInterval(()=>{
    //   this.activeIndex++;
    //   // 计算scrollTop
    //   this.scrollTop = this.activeIndex * 35 - (35 * 3)
    //   console.log(this.scrollTop)
    // },2500)
  },
  mounted(){
    this.initLyricLineHeight()
  },


  methods: {
    //初始化计算歌词每行的高度
    initLyricLineHeight(){
      //计算歌词盒子高度
      const query = uni.createSelectorQuery().in(this);
      query.select('.lyric-scroll-list').boundingClientRect(data => {
        this.lyricListHeight = data.height;
        console.log( this.lyricListHeight)
      }).exec();

      query.select('.lyric-scroll-item').boundingClientRect(data => {
        this.lyricItemHeight = data.height;
        console.log( this.lyricItemHeight)
      }).exec();
    },

    initAudio() {
      this.innerAudioContext = uni.createInnerAudioContext();
      // innerAudioContext.autoplay = true;
      this.innerAudioContext.src = this.audioUrl;
      this.innerAudioContext.volume = 0.05;
      console.log(this.innerAudioContext.currentTime)
      this.innerAudioContext.onCanplay(() => {
        this.innerAudioContext.play();
      });

      this.innerAudioContext.onPlay(() => {
        console.log('开始播放');
      });

      this.innerAudioContext.onTimeUpdate(() => {
        //每250毫秒更新一次
        // console.log(innerAudioContext.currentTime);
        let time =  (this.lyricList[this.currentIndex].time[0] - 0) * 60 + (this.lyricList[this.currentIndex].time[1] - 0);
        let absTime = Math.abs(this.innerAudioContext.currentTime - time)
        if (absTime <= 0.25 ){
          this.activeIndex = this.currentIndex;
          //当在触摸屏幕时不进行定位滚动
          if (!this.isTouchFlag){
            this.scrollTop = this.activeIndex * this.lyricItemHeight - (this.lyricItemHeight * 3)
          }
          this.currentIndex++;
        }
      })

      this.innerAudioContext.onError((res) => {
        console.log(res.errCode);
      });
    },

    //处理歌词
    getLyricList() {
      //根据歌词规则切割字符串
      let l = this.content.split('\r\n');
      let v = [];
      //拆分时间与歌词
      for (let stringItem of l) {
        let e = stringItem.split(']');
        v.push({
          time: e[0].substr(1, e[0].length).split(':'),
          text: e[1]
        });
      }
      this.lyricList = v;
      console.log(this.lyricList)
    },

    //监听滚动
    eventScroll(e) {
      // 距离顶部的高度 / 一行高度 70rpx  = 已覆盖行数
      console.log(e.detail.scrollTop.toFixed(2))
      this.touchScrollTop = e.detail.scrollTop.toFixed(2)
    },

    //屏幕触摸开始
    touchStart(e){
      console.log('开始屏幕触摸');
      this.showScrollActiveLine = true;

      this.isTouchFlag = true;
    },

    //屏幕触摸结束
    touchEnd(e){
      console.log('结束屏幕触摸');
      this.showScrollActiveLine = false;
      //开始计算当前指针指向滚动位置下标
      //卷曲的高度 + 盒子高度的一半
      let index = Math.floor((this.touchScrollTop - 0 + (this.lyricListHeight / 2)) /  this.lyricItemHeight);
      console.log(index)
      this.activeIndex = index;
      let time =  (this.lyricList[index].time[0] - 0) * 60 + (this.lyricList[index].time[1] - 0);
      this.currentIndex = index + 1;
      //跳转到该行歌词的指定音乐时间戳
      //bug seek后 onTimeUpdate不正常回调了
      //解决: 先暂停 在跳转  在播放
      this.innerAudioContext.pause();
      this.innerAudioContext.seek(time);
      setTimeout(()=>{
        this.scrollTop = this.activeIndex * this.lyricItemHeight - (this.lyricItemHeight * 3)
        this.innerAudioContext.play();
      },200)
      this.isTouchFlag = false;
    },

    //触摸被打断
    touchCancel(e){
      console.log('触摸被打断')
      //恢复逻辑
      this.isTouchFlag = false;
      this.showScrollActiveLine = false;

      //回到滚动的位置
      this.scrollTop = this.activeIndex * this.lyricItemHeight - (this.lyricItemHeight * 3)
    },


  }
}
</script>

<style scoped>
.mini-lyrics-box {
  width: 670rpx;
  height: 100%;
  background-color: pink;
}

.lyric-box {
  position: relative;
  width: 670rpx;
  height: 700rpx;
  padding: 100rpx;
  box-sizing: border-box;
}

.lyric-scroll-view {
  width: 470rpx;
  height: 490rpx;
  background-color: #fff
}
.lyric-scroll-view::-webkit-scrollbar {
  display:none;
  width:0;
  height:0;
  color:transparent;
}

.lyric-scroll-list {
  position: relative;
  width: 100%;
  height: 490rpx;
}

.lyric-scroll-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 70rpx;
  font-size: 30rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: all .3s;
  color: #ccc;
}

.active-lyric-item {
  color: #00799C;
  font-size: 38rpx;
}

.scroll-active-line{
  position: absolute ;
  top: 50%;
  transform: translateY(-50%);
  width: 470rpx;
  height: 1rpx;
}
.scroll-active-line:before{
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  content:" ";
  width: 10%;
  height: 1rpx;
  background-color:red;

}
.scroll-active-line:after{
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  content:" ";
  width: 10%;
  height: 1rpx;
  background-color:red;
}

</style>