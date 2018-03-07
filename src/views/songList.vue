<template>
  <!-- 歌单列表组件 -->
  <div class="songList" id="songList">
    <div class="title">全部歌单</div>
    <ul class="song-list">
      <router-link :to="{name: 'playListDetail', params:{id: item.id,name: item.name,coverImgUrl: item.coverImgUrl,creator: item.creator,count: item.playCount}}" class="song-item" v-for="(item, index) in playlist" :key="index" flag="li">
      <figure>
        <div class="wrap"><img :src="item.coverImgUrl + '?param300y300'" alt="" class="img-res" lazy="loading"><a class="play-count">{{item.playCount | formatCount}}</a></div>
        <figcaption class="song-content">{{item.name}}</figcaption>
      </figure></router-link>
    </ul>
    <!-- 下拉加载动画 -->
    <div class="loadmore" v-if="loading"><i class="fa fa-spinner fa-spin"></i></div>
  </div>
</template>

<script>
import api from '../api'
export default {
  data () {
    return {
      playlist: [], // 播放列表
      offset: 0, // 请求歌曲的偏移量
      loading: false,
      dom: '' // songList元素
    }
  },
  created () {
    // 请求歌曲列表
    this.get()
  },
  mounted () {
    // 监听onscroll事件实现下拉加载
    this.dom = document.getElementById('songList')
    this.dom.onscroll = () => {
      if (this.getScrollTop() + this.getWindowHeight() === this.getScrollHeight()) {
        this.get()
      }
    }
  },
  methods: {
    get () {
      this.loading = true
      this.$http.get(api.getList('华语', 1000, this.offset, 6)).then((res) => {
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
      if (this.dom.pageYOffset) {
        return this.dom.pageYOffset
      } else if (document.documentElement) {
        return this.dom.scrollTop
      }
    },
    // 获取文档的总高度
    getScrollHeight () {
      return this.dom.scrollHeight
    },
    // 获取浏览器视口的高度
    getWindowHeight () {
      return this.dom.clientHeight
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
    position: absolute;
    left: 25%;
    top: 0;
    width: 25%;
    padding: 0 .5rem;
    height: 100%;
    padding-top: 5.075rem;
    box-sizing: border-box;
    overflow-y: scroll;
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
  /*下拉加载*/
  .loadmore {
    position: fixed;
    width: 2.5rem;
    height: 2.5rem;
    top: 0;
    left: 37.5%;
    margin-left: -1.25rem;
    margin-top: 25%;
    color: #f40;
    font-size: 2rem;
    text-align: center;
    z-index: 9999;
  }
</style>
