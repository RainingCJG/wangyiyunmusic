<template>
  <!-- 播放详情组件 -->
  <div class="player-full">
    <div class="player-inner">
      <!-- 顶部 -->
      <div class="player-bar">
        <div class="btn-back" @click="back"><i class="fa fa-arrow-left"></i></div>
        <div class="song-info">
          <div class="song-name">{{audio.name}}</div>
          <div class="song-author">{{audio.singer}}</div>
        </div>
        <div class="share"><i class="fa fa-share-alt"></i></div>
      </div>
      <!-- cd动画 -->
      <div class="cd-content">
        <div class="cd-bar" :class="{'cd-play': playing}"></div>
        <div class="cd-wrapper">
          <div class="cd-mask" :class="{'cd-rotate': playing}"></div>
          <img class="cd-img" :src="audio.albumUrl + '?param500y500'" alt="" :class="{'cd-rotate': playing}">
        </div>
      </div>
      <!-- 歌词 -->
      <div class="lyric">
        <article class="ly-inner" :style="{transform: 'translate3d(0px, ' + lyroffset +'px, 0px)'}">
          <p class="ly-info" v-for="(item, index) in lyrList" :key="index">{{item.txt}}</p>
        </article>
      </div>
      <!-- 进度条 -->
      <div class="progress">
        <div class="pro" style="overflow:hidden">
          <div class="pg preload" :style="{'-webkit-transform': 'translateX(' + prBufferedTime + '%)'}"></div>
          <div class="pg load" :style="{'-webkit-transform': 'translateX(' + prCurrentTime + '%)'}"></div>
        </div>
        <div class="pro" style="background: rgba(0,0,0,0);z-index: 999;" @touchstart="changeTimeStart($event)" @touchmove="changeTimeMove($event)" @touchend="changeTimeEnd($event)">
          <div class="pro-load" :class="{loadred: offsetX > 0}" :style="{'-webkit-transform': 'translateX(' + offsetX + 'px)'}"></div>
        </div>
        <div class="play-time">
          <time class="cur">{{currentTime | formatTime}}</time>
          <time class="total">{{durationTime | formatTime}}</time>
        </div>
      </div>
      <!-- 控制按钮 -->
      <div class="control-btn">
        <button class="btn btn-mode"></button>
        <button class="btn btn-pre" @click="PLAYPREV"></button>
        <button class="btn btn-play" @click="togglePlay" :class="{'btn-pause': playing}"></button>
        <button class="btn btn-next" @click="next"></button>
        <button class="btn btn-list" @click="showList"></button>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div class="mask">
      <div class="album-mask" :style="{'background-image': 'url(' + audio.albumUrl + '?param500y500)'}"></div>
      <div class="wrapper-mask"></div>
    </div>
    <!-- 播放列表组件 -->
    <playList ref="playList" @back="goback"></playList>
  </div>
</template>

<script>
import api from '../api'
import { mapGetters, mapMutations } from 'vuex'
import playList from '../components/playList'
export default {
  data () {
    return {
      lyrList: [], // 歌词数组
      lyric: '', // 歌词
      dom: '', // audio
      width: '' // 屏幕宽度
    }
  },
  components: {
    playList
  },
  beforeRouteEnter: (to, from, next) => {
    // 判断是否重复打开同一歌曲页面
    next(vm => {
      if (parseInt(to.params.id) === parseInt(vm.audio.id)) {
        vm.loadLrc(vm.audio.id)
      }
    })
  },
  mounted () {
    this.dom = document.getElementById('audioPlay')
    this.width = document.documentElement.getBoundingClientRect().width
  },
  watch: {
    audio (val) {
      this.loadLrc(val.id)
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
      this.$store.commit('SHOWPLAYER', true)
    },
    goback () {
      this.$router.go(-1)
    },
    // 加载歌词
    loadLrc (id) {
      this.lyrList = [{txt: '正在加载中...'}]
      if (!id) {
        this.lyrList = [{'txt': '这里显示歌词哦！'}]
        return
      }
      this.$http.get(api.getlyric(id)).then((res) => {
        if (res.data.nolyric) {
          this.lyrList = [{'txt': '(⊙０⊙) 暂无歌词'}]
        } else {
          this.lyric = res.data.lrc.lyric
          this.getlrc() // 获取歌词
        }
      }, (res) => {
        this.lyrList = [{'txt': '加载歌词失败'}]
      }).catch((err) => {
        console.log(err)
        this.lyrList = [{'txt': '(⊙０⊙) 暂无歌词'}]
      })
    },
    // 获取歌词
    getlrc () {
      let lrc = this.lyric.split('\n')
      let lrcObj = []
      let timeReg = /\[\d*:\d*((\.|:)\d*)\]/g
      for (let i = 0; i < lrc.length; i++) {
        let timeRegExpArr = lrc[i].match(timeReg)
        if (!timeRegExpArr) continue
        let txt = lrc[i].replace(timeReg, '')
        for (let j = 0; j < timeRegExpArr.length; j++) {
          let array = {}
          let minu = Number(String(timeRegExpArr[j].match(/\[\d*/i)).slice(1))
          let sec = Number(String(timeRegExpArr[j].match(/:\d*/i)).slice(1))
          array.time = minu * 60 + sec
          array.txt = txt
          lrcObj.push(array)
        }
      }
      this.lyrList = lrcObj
    },
    changeTime (e) {
      let time = (e.touches[0].pageX - this.width * 0.2) / (this.width * 0.6) * this.durationTime
      this.$store.commit('UPDATETMPCURRENTTIME', time)
      this.$store.commit('SETCHANGE', true)
    },
    changeTimeStart (e) {
      this.changeTime(e)
    },
    changeTimeMove (e) {
      e.preventDefault()
      this.changeTime(e)
    },
    changeTimeEnd (e) {
      let time = (e.changedTouches[0].pageX - this.width * 0.2) / (this.width * 0.6) * this.durationTime
      this.$store.commit('UPDATETMPCURRENTTIME', time)
      this.$store.commit('SETCHANGE', true)
    },
    ...mapMutations([
      'PLAYPREV',
      'PLAYNEXT'
    ]),
    // 切换播放状态
    togglePlay () {
      if (this.playing) {
        this.$store.commit('PAUSE')
        this.dom.pause()
      } else {
        this.$store.commit('PLAY')
        this.dom.play()
      }
    },
    showList () {
      this.$refs.playList.show()
    },
    next () {
      this.$store.commit('PLAYNEXT')
      if (!this.audio.location) this.$store.dispatch('getSong', this.audio.id)
    }
  },
  computed: {
    ...mapGetters([
      'show',
      'audio',
      'playing',
      'currentTime',
      'durationTime',
      'prBufferedTime',
      'prCurrentTime',
      'songList'
    ]),
    lyroffset () {
      if (this.lyrList) {
        // 根据时间获得歌词
        let time = Math.round(this.currentTime)
        for (let i = 0; i < this.lyrList.length; i++) {
          if (this.lyrList[i].time === time) {
            return -(i) * 42
          }
        }
      }
    },
    offsetX () {
      return this.width * 0.6 * this.prCurrentTime / 100
    }
  },
  filters: {
    formatTime (value) {
      let minu = Math.floor(parseInt(value) / 60)
      let sec = Math.floor(parseInt(value) % 60)
      if (minu < 10) {
        minu = '0' + minu
      }
      if (sec < 10) {
        sec = '0' + sec
      }
      return minu + ':' + sec
    }
  }
}
</script>

<style scoped>
  .player-full {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  .player-inner {
    z-index: 2;
  }
  /*遮罩层*/
  .player-inner,
  .mask,
  .album-mask,
  .wrapper-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .album-mask {
    background-size: cover;
    background-position: center;
    filter: blur(1.2rem);
    -webkit-filter: blur(1.2rem);
    transform: scale(1.05);
    -webkit-transform: scale(1.05);
  }
  .wrapper-mask {
    opacity: .6;
    background-color: rgba(0,0,0,.8);
    z-index: 1;
  }
  /*顶部*/
  .player-bar {
    width: 100%;
    height: 2.8rem;
    border-bottom: .05rem solid rgba(255,255,255,.15);
    color: #fff;
    font-size: .8rem;
    overflow: hidden;
  }
  .btn-back {
    float: left;
    height: 100%;
    padding: 0 1rem;
    line-height: 2.8rem;
  }
  .song-info {
    float: left;
    width: 9rem;
    height: 100%;
  }
  .song-name {
    height: 1rem;
    padding-top: .5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .song-author {
    height: 1rem;
    font-size: .7rem;
    color: #a8a7a7;
  }
  .share {
    float: right;
    height: 100%;
    line-height: 2.8rem;
    padding: 0 1rem;
  }
  /*cd*/
  .cd-content {
    position: relative;
    height: 14rem;
    overflow: hidden;
  }
  .cd-bar {
    position: absolute;
    width: 4rem;
    height: 6rem;
    right: 30%;
    background: url(../assets/stick_bg.png) no-repeat left -.4rem;
    background-size: cover;
    -webkit-transition: all 300ms ease-in;
    transition: all 300ms ease-in;
    -webkit-transform-origin: left top;
    transform-origin: left top;
    -webkit-transform: rotate(-20deg);
    transform: rotate(-20deg);
    z-index: 999;
  }
  .cd-wrapper {
    position: relative;
    width: 9rem;
    height: 9rem;
    padding: .8rem .9rem;
    border-radius: 50%;
    background: rgba(107, 107, 107, 0.3);
    margin: 3rem auto 0;
  }
  .cd-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: url('../assets/cd_wrapper.png') no-repeat center center;
    background-size: contain;
    z-index: 1;
  }
  .cd-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  /*cd播放状态样式*/
  .cd-play {
    background-position-y: -.7rem;
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    z-index: 999;
  }
  .cd-rotate {
    -webkit-animation: rotating 10s  linear .3s infinite;
    animation: rotating 10s linear .3s infinite;
  }
  /*歌词*/
  .lyric {
    position: relative;
    height: 58px;
    line-height: 58px;
    overflow: hidden;
  }
  .ly-inner {
    transition: -webkit-transform .3s ease-out;
    transition: transform .3s ease-out;
    -webkit-transform-origin: 0px 0px 0px;
    transform-origin: 0px 0px 0px;
    text-align: center;
    overflow: hidden;
  }
  .ly-info {
    height: 42px;
    font-size: 16px;
    color: #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  /*进度条*/
  .progress {
    position: relative;
    height: 2rem;
    line-height: 2rem;
    margin-top: .5rem;
  }
  .pro {
    position: absolute;
    left: 50%;
    top: .95rem;
    width: 60%;
    height: .1rem;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    background-color: #8a8a8a;
  }
  .pg {
    position: absolute;
    left: -100%;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .preload {
    background-color: rgba(220, 217, 217, 1);
  }
  .load,
  .progress .loadred {
    background-color: #DC143C;
  }
  .pro-load {
    position: absolute;
    left: -.29rem;
    top: -.25rem;
    width: .6rem;
    height: .6rem;
    border-radius: 50%;
    background-color: #fff;
  }
  .play-time {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    color: #fff;
    font-size: .6rem;
    opacity: .5;
  }
  .cur {
    float: left;
    margin-left: 1rem;
  }
  .total {
    float: right;
    margin-right: 1rem;
  }
  /*播放按钮*/
  .control-btn {
    text-align: center;
  }
  .btn {
    width: 2.6rem;
    height: 2.6rem;
  }
  .btn-mode {
    background: url(../assets/seq.png) no-repeat;
    background-size: cover;
  }
  .btn-pre {
    background: url(../assets/prev.png) no-repeat;
    background-size: cover;
  }
  .btn-next {
    background: url(../assets/next.png) no-repeat;
    background-size: cover;
  }
  .btn-play {
    background: url(../assets/play.png) no-repeat;
    background-size: cover;
  }
  .btn-pause {
    background: url(../assets/pause.png) no-repeat;
    background-size: cover;
  }
  .btn-list {
    background: url(../assets/list.png) no-repeat;
    background-size: cover;
  }
  @keyframes rotating {
    0%{transform: rotate(0deg);}
    100%{transform: rotate(360deg);}
  }
  @-webkit-keyframes rotating {
    0%{-webkit-transform: rotate(0deg);}
    100%{-webkit-transform: rotate(360deg);}
  }
</style>
