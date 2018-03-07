<template>
  <div class="index-container">
    <header class="header">
      <div class="fixed-bar clearfix">
          <div class="logo fl"></div>
          <div class="search fr"><i class="fa fa-search"></i></div>
      </div>
      <ul class="nav-bar">
        <router-link v-for="(item, index) in routers" :key="index" :to="{name: item.name, params: {index: item.index}}" tag="li" class="tab-item">{{item.txt}}</router-link>
      </ul>
      <div class="router-link-selected" :style="{'-webkit-transform': 'translateX(' + offset +'px)'}"></div>
    </header>
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
      startx: 0,
      starty: 0,
      movex: 0,
      movey: 0,
      translatex: 0,
      maxOffset: 0,
      slide: '',
      index: 0,
      routers: [
        {name: 'popular', txt: '时下流行', index: 0},
        {name: 'songList', txt: '歌单', index: 1},
        {name: 'rankingList', txt: '排行榜', index: 2},
        {name: 'hotSinger', txt: '热门歌手', index: 3}
      ],
      offset: 0
    }
  },
  components: {
    popular,
    songList,
    rankingList,
    hotSinger
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.index = vm.getIndex(to.name)
      vm.translatex = vm.settranslatex(-vm.index)
      vm.offset = vm.setoffset(vm.index)
    })
  },
  mounted () {
    this.maxOffset = document.documentElement.getBoundingClientRect().width * 0.5
  },
  watch: {
    '$route' (to, from) {
      this.index = this.getIndex(to.name)
      this.translatex = this.settranslatex(-this.index)
      this.offset = this.setoffset(this.index)
    }
  },
  methods: {
    getIndex (name) {
      for (let i = 0; i < this.routers.length; i++) {
        if (this.routers[i].name === name) {
          return i
        }
      }
    },
    setoffset (index) {
      return index * this.maxOffset * 0.5
    },
    settranslatex (index) {
      return index * this.maxOffset * 2
    },
    start (e) {
      this.startx = e.touches[0].pageX
      this.starty = e.touches[0].pageY
      this.movex = 0
      this.movey = 0
    },
    move (e) {
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
    end (e) {
      let moveX = Math.abs(this.movex)
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
  .index-container {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
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
  .default-view {
    position: relative;
    width: 400%;
    height: 100%;
    padding-top: 5.075rem;
    box-sizing: border-box;
    overflow: hidden;
  }
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
