<template>
  <!-- 播放列表详细组件 -->
  <div class="playList" :class="{view: songList.length > 0}">
    <!-- 当前歌单 -->
    <div class="cur-player" :style="{'background': 'rgba(206, 61, 62, '+ opacity +')'}">
      <i class="back-button fa fa-arrow-left" solt="left" @click="back"></i>
      <span class="player-text">{{fname}}</span>
    </div>
    <!-- 歌单信息 -->
    <div class="play-info clearfix">
      <figure>
        <div class="fl wrap-left">
          <img :src="coverImgUrl + '?param=300y300'" alt="" class="img-res">
          <span class="play-count">{{playcount | formatCount}}</span>
        </div>
        <figcaption>
          <div class="fr wrap-right">
            <p class="top-text">{{name}}</p>
            <p class="bottom-text"><img :src="coverImgUrl" alt="" class="author-img">{{creator.nickname}}</p>
          </div>
        </figcaption>
      </figure>
      <!-- 遮罩层 -->
      <div class="bg-mask">
      </div>
      <div class="bg-player" :style="{backgroundImage: 'url(' + coverImgUrl + '?param=300y300)'}"></div>
    </div>
    <!-- 播放全部 -->
    <div class="play-all">
      <div class="wrap-title"><i class="fa fa-plus play-all-icon" @click="playAll"></i>播放全部</div>
    </div>
    <!-- 首次加载播放列表动画 -->
    <div class="list-isloading" v-if="isloading"><i class="fa fa-spinner fa-spin"></i></div>
    <!-- 播放列表 -->
    <ul class="play-all-list" v-if="!isloading">
      <li class="playList-item clearfix" v-for="(item, index) in list" @click="play(item, index)" :key="item.id">
        <span class="song-index fl" :class="{changeblue: audio.id == item.id}">{{index + 1}}</span>
        <div class="song-info fl">
          <p class="song-name" :class="{changred: audio.id == item.id}">{{item.name}}</p>
          <p class="singer-name">{{item.ar[0].name}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '../api'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      opacity: 0, // 根据滚动条的下拉高度动态改变透明度
      id: 0, // 歌单id
      coverImgUrl: '../assets/default_cover.png', // 封面预加载图片
      name: '歌单标题',
      fname: '歌单',
      playcount: 0,
      creator: {
        'avatarUrl': '../assets/user-default.png', // 用户头像预加载图片
        'nickname': '昵称'
      }, // 歌单创建者信息
      list: [], // 播放列表
      isloading: false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let data = to.params
      // 判断传来的数据id是否一样
      if (parseInt(data.id) !== parseInt(vm.id)) {
        vm.get()
      }
      // 判断过来的路由是否带有对应的参数信息
      if (data.coverImgUrl) {
        vm.id = data.id
        vm.name = data.name
        vm.playcount = data.count
        vm.coverImgUrl = data.coverImgUrl
        vm.creator = data.creator
      }
      // 监听onscroll事件
      window.onscroll = () => {
        let rat = window.pageYOffset / 150
        if (rat > 0.5) {
          vm.fname = vm.name
        } else {
          vm.fname = '歌单'
        }
        vm.opacity = rat
      }
    })
  },
  // 路由离开时清除window.onscroll事件
  beforeRouteLeave: (to, from, next) => {
    window.scroll = null
    next()
  },
  methods: {
    // 获取播放歌曲列表
    get () {
      this.isloading = true
      this.$http.get(api.getPlayListDetail(this.$route.params.id)).then((res) => {
        this.list = res.data.playlist.tracks
        this.isloading = false
        this.ischange = new Array(this.list.length)
      }).catch((err) => {
        console.log('加载歌单信息出错:' + err)
      })
    },
    back () {
      this.$router.go(-1)
    },
    // 播放单曲
    play (song, index) {
      document.getElementById('audioPlay').pause()
      this.$store.commit('PAUSE')
      let audio = {}
      audio.id = song.id
      audio.singer = song.ar[0].name
      audio.albumUrl = song.al.picUrl
      audio.name = song.name
      // 判断该单曲是否存在于播放列表组件的播放列表中
      this.$store.commit('ISINLIST', {item: audio, index: index})
      // 播放歌曲不存在该歌单的播放列表
      // 或者播放列表组件的播放列表长度和当前歌单的播放列表长度不等时
      if ((this.list.length !== this.songList.length) || (!this.isinlist)) {
        this.addAll()
      }
      this.$store.dispatch('getSong', audio.id)
      this.$store.commit('SHOWPLAYER', true)
    },
    // 播放全部
    playAll () {
      this.addAll()
      this.play(this.list[0], 0)
    },
    // 缓存播放列表
    addAll () {
      while (this.songList.length) {
        this.$store.commit('REMOVEAUDIO', 0)
      }
      let items = []
      this.list.forEach((item) => {
        items.push({
          id: item.id,
          name: item.name,
          singer: item.ar[0].name,
          albumUrl: item.al.picUrl
        })
      })
      this.$store.commit('ADDTOLIST', items)
    }
  },
  computed: {
    // 注册vuex
    ...mapGetters(['songList', 'isinlist', 'audio'])
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
  /*播放列表详细组件*/
  .playList {
    width: 100%;
    padding: .25rem;
    box-sizing: border-box;
  }
  /*当前歌单*/
  .cur-player {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 2.2rem;
    line-height: 2.2rem;
    padding: .3rem .25rem;
    transition: opacity .1s;
    color: #fff;
    font-size: 1.1rem;
    z-index: 999;
  }
  .back-button {
    float: left;
    width: 1.1rem;
    height: 2.2rem;
    line-height: 2.2rem;
    margin: 0 .8rem 0 1rem;
  }
  .player-text {
    display: -webkit-box;
    height: 2.2rem;
    overflow: hidden;
    font-weight: bold;
    letter-spacing: -2px;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  /*播放歌单信息*/
  .play-info {
    position: relative;
    width: 100%;
    height: 9.5rem;
    padding: 2.3rem .5rem .1rem;
    box-sizing: border-box;
  }
  .wrap-left {
    position: relative;
    width: 6rem;
    z-index: 2;
  }
  .img-res {
    width: 6rem;
    height: 6rem;
  }
  .play-count {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: .1rem .2rem;
    text-align: right;
    color: #fff;
    box-sizing: border-box;
    background-color: rgba(0,0,0,.35);
  }
  .wrap-right {
    position: relative;
    z-index: 2;
    width: 7.5rem;
    padding: .5rem;
    box-sizing: border-box;
    color: #fff;
  }
  .top-text {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .wrap-right .bottom-text {
    display: table-cell;
    padding-top: .6rem;
    vertical-align: middle;
  }
  .author-img {
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    margin-right: .25rem;
    vertical-align: middle;
  }
  /*遮罩层*/
  .bg-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.35);
    z-index: 1;
  }
  .bg-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(../assets/default_cover.png) no-repeat;
    background-size: cover;
    background-position: bottom right;
    filter: blur(40px);
    -webkit-filter: blur(40px);
    z-index: 1;
  }
  /*播放全部*/
  .wrap-title {
    height: 1.8rem;
    line-height: 1.8rem;
    color: #333;
    padding-left: 1rem;
    border-bottom: .05rem solid #eee;
  }
  .play-all-icon {
    display: inline-block;
    width: .8rem;
    height: .8rem;
    text-align: center;
    line-height: .8rem;
    border-radius: 50%;
    border: .1rem solid #333;
    margin-right: .5rem;
  }
  /*加载*/
  .list-isloading {
    position: absolute;
    top: 0;
    width: 2.5rem;
    height: 2.5rem;
    left: 50%;
    margin-left: -1.25rem;
    margin-top: 75%;
    color: #f40;
    font-size: 1.5rem;
  }
  /*歌曲列表*/
  .song-index {
    width: 20%;
    height: 3.6rem;
    text-align: center;
    line-height: 3.6rem;
    font-size: .9rem;
    font-weight: bolder;
    color: #666;
  }
  .song-info {
    width: 80%;
    height: 3.6rem;
    border-bottom: .05rem solid #eee;
  }
  .song-name {
    height: 1rem;
    line-height: 1rem;
    font-size: .8rem;
    margin-top: .8rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .singer-name {
    height: 1rem;
    line-height: 1rem;
    font-size: .6rem;
    color: #777;
  }
  .playList-item .changeblue {
    color: #0000cd;
  }
  .playList-item .changred {
    color: #FF4500;
  }
</style>
