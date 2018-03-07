<template>
  <footer>
    <div class="player-mini clearfix" v-show="show">
      <!-- audio -->
      <audio id="audioPlay" :src="audio.location" @canplay="playSong" @error="loadError" @ended="next" @timeupdate="updateTime"></audio>
      <!-- 封面 -->
      <div class="cover fl" @click="showDetail"><img v-show="!loading" class="img-cover" :src="audio.albumUrl + '?param=100y100'" alt=""></div>
      <!-- 歌曲信息 -->
      <div class="song-info fl">
        <div class="song-name">{{audio.name}}</div>
        <div class="song-author">{{audio.singer}}</div>
      </div>
      <!-- 控制按钮 -->
      <div class="control fr">
        <div class="control-btn play-list" @click="showList"></div>
        <div class="control-btn play" @click="toggleState" :class="{pause: !playing}"></div>
        <div class="control-btn play-next" @click="next"></div>
      </div>
      <!-- 播放进度 -->
      <div class="play-progress">
        <div class="pro pro-load" :style="{'-webkit-transform': 'translateX(' + prBufferedTime +'%)'}"></div>
        <div class="pro pro-play" :style="{'-webkit-transform': 'translateX(' + prCurrentTime +'%)'}"></div>
      </div>
    </div>
    <!-- 播放列表组件 -->
    <playList ref="playList"></playList>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'
import playList from '../components/playList'
export default {
  data () {
    return {
      dom: ''
    }
  },
  components: {
    playList
  },
  mounted () {
    this.dom = document.getElementById('audioPlay')
  },
  computed: {
    ...mapGetters([
      'audio',
      'loading',
      'playing',
      'change',
      'currentTime',
      'tmpCurrentTime',
      'prCurrentTime',
      'prBufferedTime',
      'show'
    ])
  },
  methods: {
    showDetail () {
      this.$router.push({name: 'playerDetail', params: {id: this.audio.id}})
      this.$store.commit('SHOWPLAYER', false)
    },
    toggleState () {
      if (this.playing) {
        this.$store.commit('PAUSE')
        this.dom.pause()
      } else {
        this.$store.commit('PLAY')
        this.dom.play()
      }
    },
    playSong () {
      this.$store.commit('CLOSELOADING')
      this.$store.commit('PLAY')
      this.dom.play()
    },
    // 文件加载错误
    loadError () {
      // 根据src判断是第一次打开程序还是程序加载错误
      if (this.dom.currentSrc) {
        this.$store.commit('CLOSELOADING')
      } else {
        console.log('第一次加载')
      }
    },
    next () {
      this.$store.commit('PAUSE')
      this.$store.commit('PLAYNEXT')
      if (!this.audio.location) this.$store.dispatch('getSong', this.audio.id)
    },
    showList () {
      this.$refs.playList.show()
    },
    updateTime () {
      let vmdom = this.dom
      // 防止在未加载完成时切歌出现错误
      vmdom.onsuspend = () => {
        let timeRange = vmdom.buffered
        if (timeRange.length > 0 && vmdom.duration > 0) {
          this.$store.commit('UPDATEBUFFEREDTIME', parseInt(vmdom.buffered.end(0)))
        }
      }
      this.$store.commit('UPDATEDURATIONTIME', parseInt(vmdom.duration))
      if (this.change) {
        vmdom.currentTime = this.tmpCurrentTime
        this.$store.commit('SETCHANGE', false)
      } else {
        this.$store.commit('UPDATECURRENTTIME', parseInt(vmdom.currentTime))
      }
    }
  }
}
</script>

<style scoped>
  .player-mini {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2.3rem;
    overflow: hidden;
    z-index: 999;
    background-color: rgba(255,255,255,.9);
    color: #333;
  }
  .cover,
  .img-cover {
    width: 1.8rem;
    height: 1.8rem;
  }
  .img-cover {
    margin: .2rem;
  }
  .song-info {
    width: 7rem;
    margin-top: .2rem;
    margin-left: .7rem;
  }
  .song-name {
    line-height: 1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .song-author {
    font-size: .6rem;
    color: #8a8a8a;
  }
  .control {
    position: relative;
  }
  .control-btn {
    position: absolute;
    top: 0;
    width: 2rem;
    height: 2rem;
  }
  .play-next {
    right: 0;
    background: url(../assets/playbar_btn_next.png) no-repeat;
    background-size: cover;
  }
  .play {
    right: 2rem;
    background: url(../assets/playbar_btn_pause.png) no-repeat;
    background-size: cover;
  }
  .pause {
    right: 2rem;
    background: url(../assets/playbar_btn_play.png) no-repeat;
    background-size: cover;
  }
  .play-list {
    right: 4rem;
    background: url(../assets/playbar_btn_playlist.png) no-repeat;
    background-size: cover;
  }
  .play-progress {
    position: absolute;
    width: 100%;
    height: .1rem;
    left: 0;
    bottom: 0;
    background-color: rgba(255,255,255,.5);
  }
  .pro {
    position: absolute;
    width: 100%;
    height: .1rem;
    left: -100%;
  }
  .pro-load {
    background-color: rgba(220, 217, 217, 1);
  }
  .pro-play {
    background-color: #DC143C;
  }
</style>
