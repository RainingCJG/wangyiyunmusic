<template>
  <div class="songList">
    <div class="title">全部歌单</div>
    <ul class="song-list"><router-link :to="{name: 'playListDetail', params:{id: item.id,name: item.name,coverImgUrl: item.coverImgUrl,creator: item.creator,count: item.playCount}}" class="song-item" v-for="(item, index) in playlist" :key="index" flag="li"><figure>
      <div class="wrap"><img :src="item.coverImgUrl + '?param300y300'" alt="" class="img-res" lazy="loading"><a class="play-count">{{item.playCount | formatCount}}</a></div>
      <figcaption class="song-content">{{item.name}}</figcaption>
    </figure></router-link></ul>
    <div class="loadmore" v-if="loading"><i class="fa fa-spinner fa-spin"></i></div>
  </div>
</template>

<script>
import api from '../api'
export default {
  data () {
    return {
      playlist: [],
      offset: 0,
      loading: false
    }
  },
  created () {
    this.get()
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      window.onscroll = () => {
        if (vm.getScrollTop() + vm.getWindowHeight() === vm.getScrollHeight()) {
          vm.get()
        }
      }
    })
  },
  beforeRouteLeave: (to, from, next) => {
    window.onscroll = null
    next()
  },
  methods: {
    get () {
      this.loading = true
      this.$http.get(api.getList('hot', 1000, this.offset, 6)).then((res) => {
        let len = res.data.result.playlistCount
        let list = res.data.result.playlists
        this.playlist.push(...list)
        this.offset += 6
        if (this.offset > len) {
          this.offset = len
        }
        this.loading = false
      })
    },
    // 滚动条在y轴的滚动距离
    getScrollTop () {
      if (window.pageYOffset) {
        return window.pageYOffset
      } else if (document.documentElement) {
        return document.documentElement.scrollTop
      }
    },
    // 获取文档的总高度
    getScrollHeight () {
      return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    },
    // 获取浏览器视口的高度
    getWindowHeight () {
      return Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    }
  },
  filters: {
    formatCount (count) {
      if (count < 9999) {
        return count
      } else {
        return (count / 10000).toFixed(0) + '万'
      }
    }
  }
}
</script>

<style scoped>
  .songList {
    overflow: hidden;
    padding: 0 .5rem;
  }
  .title {
    margin: .2rem 0 .3rem 0;
    padding-left: .2rem;
    border-left: .15rem solid #F08080;
  }
  .song-list {
    width: 100%;
    overflow: hidden;
  }
  .song-item {
    float: left;
    width: 7.3rem;
    margin: 0 .1rem .5rem .1rem;
  }
  .wrap {
    position: relative;
  }
  .img-res {
    width: 100%;
    height: 8rem;
  }
  .img-res[lazy=loading] {
    background: url('../assets/default_cover.png') no-repeat;
    background-size: cover;
  }
  .play-count {
    position: absolute;
    box-sizing: border-box;
    -webkit-box-sizing:border-box;
    width: 100%;
    left: 0;
    top: 0;
    color: #fff;
    padding: .1rem .25rem;
    text-align: right;
    background-color: rgba(0,0,0,.2);
  }
  .song-content {
    height: 1rem;
    line-height: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .loadmore {
    position: fixed;
    width: 2.5rem;
    height: 2.5rem;
    top: 0;
    left: 50%;
    margin-left: -1.25rem;
    margin-top: 80%;
    color: #f40;
    font-size: 2rem;
    text-align: center;
  }
</style>
