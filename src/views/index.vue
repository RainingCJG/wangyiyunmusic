<template>
  <div class="index-container">
    <!-- 标题导航部分 -->
    <header class="header">
      <div class="fixed-bar clearfix">
          <div class="logo fl"></div>
          <div class="search fr"><i class="fa fa-search"></i></div>
      </div>
      <!-- 路由导航 -->
      <ul class="nav-bar">
        <router-link v-for="(item, index) in routers" :key="index" :to="{name: item.name, params: {index: item.index}}" tag="li" class="tab-item">{{item.txt}}</router-link>
      </ul>
      <div class="router-link-selected" :style="{'-webkit-transform': 'translateX(' + offset +'px)'}"></div>
    </header>
    <!-- 内容部分 -->
    <section class="default-view" @touchstart="start($event)" @touchmove="move($event)" @touchend="end($event)" :style="{'-webkit-transform': 'translateX(' + translatex +'px)'}">
      <popular></popular>
      <songList></songList>
      <rankingList></rankingList>
      <hotSinger></hotSinger>
      <!-- <transition :name="slide">
        <keep-alive>
          <router-view :style="{marginLeft: translatex + 'px'}"/>
        </keep-alive>
      </transition> -->
    </section>
  </div>
</template>

<script>
import popular from '../views/popular'
import songList from '../views/songList'
import rankingList from '../views/rankingList'
import hotSinger from '../views/hotSinger'
export default {
  data () {
    return {
      startx: 0, // 开始触摸的鼠标x坐标
      starty: 0, // 开始触摸的鼠标y坐标
      movex: 0, // 触摸过程的鼠标x坐标移动的距离
      movey: 0, // 触摸过程的鼠标x坐标移动的距离
      translatex: 0, // 内容容器移动的距离
      maxOffset: 0, // 最大的能偏移距离，超过可以发生偏移
      index: 0, // 对应于那个路由
      routers: [
        {name: 'popular', txt: '时下流行', index: 0},
        {name: 'songList', txt: '歌单', index: 1},
        {name: 'rankingList', txt: '排行榜', index: 2},
        {name: 'hotSinger', txt: '热门歌手', index: 3}
      ], // 路由数组
      offset: 0 // 随着内容容器移动路由偏移距离
    }
  },
  components: {
    popular,
    songList,
    rankingList,
    hotSinger
  },
  // 路由进入之前初始化index
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.index = vm.getIndex(to.name)
      vm.translatex = vm.settranslatex(-vm.index)
      vm.offset = vm.setoffset(vm.index)
    })
  },
  // 获取最大能移动距离，是屏幕最大宽度的一半
  mounted () {
    this.maxOffset = document.documentElement.getBoundingClientRect().width * 0.5
  },
  // 监听路由改变时index变化
  watch: {
    '$route' (to, from) {
      this.index = this.getIndex(to.name)
      this.translatex = this.settranslatex(-this.index)
      this.offset = this.setoffset(this.index)
    }
  },
  methods: {
    // 通过路由名字获取路由index
    getIndex (name) {
      for (let i = 0; i < this.routers.length; i++) {
        if (this.routers[i].name === name) {
          return i
        }
      }
    },
    // 通过index设置路由偏移距离
    setoffset (index) {
      return index * this.maxOffset * 0.5
    },
    // 通过index设置内容容器偏移距离
    settranslatex (index) {
      return index * this.maxOffset * 2
    },
    // 开始触摸事件
    start (e) {
      this.startx = e.touches[0].pageX
      this.starty = e.touches[0].pageY
      this.movex = 0
      this.movey = 0
    },
    // 触摸移动事件
    move (e) {
      // 阻止事件的默认行为，兼容Android的bug
      e.preventDefault()
      this.movex = e.touches[0].pageX - this.startx
      this.movey = e.touches[0].pageY - this.starty
      if (this.movex > 0) {
        if (this.index === 0) {
          this.movex = 0
        }
      } else {
        if (this.index === 3) {
          this.movex = 0
        }
      }
      this.translatex = this.movex - this.settranslatex(this.index)
      this.offset = -this.movex * 0.25 + this.setoffset(this.index)
    },
    // 触摸结束事件
    end (e) {
      let moveX = Math.abs(this.movex)
      // 当触摸移动距离大于最大能移动距离并且移动的x坐标大于y坐标时切换路由
      if ((moveX >= this.maxOffset) && (moveX > Math.abs(this.movey))) {
        let index = this.getIndex(this.$route.name)
        if (this.movex < 0) {
          if (index === 3) {
            this.translatex = this.settranslatex(-this.index)
          } else {
            this.index = index + 1
            this.$router.push({name: this.routers[this.index].name})
            this.translatex = this.settranslatex(-this.index)
          }
        } else {
          if (index === 0) {
            this.translatex = this.settranslatex(this.index)
          } else {
            this.index = index - 1
            this.$router.push({name: this.routers[this.index].name})
            this.translatex = this.settranslatex(-this.index)
          }
        }
      } else {
        this.translatex = -this.index * this.maxOffset * 2
      }
      this.offset = this.setoffset(this.index)
    }
  }
}
</script>

<style scoped>
  /*主页*/
  .index-container {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  /*头部*/
  .header {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 999;
  }
  .fixed-bar {
    height: 2.7rem;
    padding: 0 .25rem;
    background-color: #DC143C;
  }
  .fixed-bar .logo{
    width: 7.5rem;
    height: 2.7rem;
    background: url(../assets/logo.png) no-repeat left center;
    background-size: cover;
  }
  .fixed-bar .search{
    height: 2.7rem;
    font-size: .9rem;
    line-height: 2.7rem;
    margin-right: .75rem;
    color: #fff;
  }
  /*导航*/
  .nav-bar {
    width: 100%;
    height: 2.3rem;
    background-color: #fff;
    color: rgba(0,0,0,.87);
  }
  .nav-bar .tab-item {
    float: left;
    width: 25%;
    height: 2.3rem;
    line-height: 2.3rem;
    text-align: center;
    color: rgba(102,102,102,1);
  }
  /*内容*/
  .default-view {
    position: relative;
    width: 400%;
    height: 100%;
    padding-top: 5.075rem;
    box-sizing: border-box;
    overflow: hidden;
  }
  /*路由active*/
  .nav-bar .router-link-active {
    color: #cd5c5c;
  }
  .router-link-selected {
    display: block;
    width: 25%;
    height: .075rem;
    background-color: #F08080;
  }
  /*向右滑动开始状态*/
  .slide-right-enter,
  .slide-left-leave-active {
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
  }
  /*向左滑动开始状态*/
  .slide-left-enter,
  .slide-right-leave-active {
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
  }
  .slide-left-leave-active,
  .slide-left-enter-active,
  .slide-right-leave-active,
  .slide-right-enter-active {
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
  }
</style>
