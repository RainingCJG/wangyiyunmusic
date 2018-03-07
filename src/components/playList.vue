<template>
  <div class="playlist" v-show="isshow">
    <div class="mask" @click="hide"></div>
    <div class="wrapper">
      <div class="title-wrapper">
        播放列表（{{songList.length}}）
        <i class="fa fa-trash-o removeall" @click="removeAll"></i>
      </div>
      <ul class="list-wrap">
        <li class="list-item clearfix" v-for="(item, index) in songList" :key="index"><p class="list-content" :class="{on: item.id == audio.id}" @click="play(index)"><i class="fa fa-volume-up" v-show="item.id == audio.id">&nbsp;&nbsp;</i>{{item.name}}<small class="item-singer" :class="{on: item.id == audio.id}">&nbsp;-&nbsp;{{item.singer}}</small></p><span class="remove" @click="remove(index)">x</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'playList',
  data () {
    return {
      isshow: false
    }
  },
  methods: {
    show (callback) {
      this.isshow = true
      let popular = document.querySelector('.default-view')
      let playList = document.querySelector('.playList')
      if (playList) {
        playList.style.position = 'fixed'
      }
      if (popular) {
        popular.style.position = 'fixed'
      }
    },
    hide () {
      this.isshow = false
      let popular = document.querySelector('.default-view')
      let playList = document.querySelector('.playList')
      if (playList) {
        playList.style.position = 'static'
      }
      if (popular) {
        popular.style.position = 'static'
      }
    },
    play (index) {
      this.$store.commit('SETAUDIOINDEX', index)
      if (!this.audio.location) {
        this.$store.dispatch('getSong', this.audio.id)
      }
    },
    remove (index) {
      this.$store.commit('REMOVEAUDIO', index)
      if (!this.audio.location) this.$store.dispatch('getSong', this.audio.id)
      if (this.songList.length <= 0) {
        this.isshow = false
        this.$emit('back')
      }
    },
    removeAll () {
      while (this.songList.length) {
        this.remove(0)
      }
    }
  },
  computed: {
    ...mapGetters([
      'songList',
      'audio'
    ])
  }
}
</script>

<style scoped>
  .hide {
    display: none;
  }
  .playlist {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }
  .mask {
    position: fixed;
    width: 100%;
    height: 34%;
    background-color: rgba(0,0,0,.3);
  }
  .wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 66%;
    background-color: #fff;
    overflow: scroll;
  }
  .title-wrapper {
    position: fixed;
  }
  .list-wrap {
    margin-top: 2rem;
  }
  .title-wrapper,
  .list-item {
    width: 100%;
    height: 2rem;
    font-size: .7rem;
    line-height: 2rem;
    color: rgba(0,0,0,.7);
    padding: 0 .5rem;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
    background: #fff;
  }
  .removeall {
    float: right;
    height: 2rem;
    line-height: 2rem;
  }
  .list-content {
    float: left;
    width: 72%;
    height: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #111;
    font-size: .8rem;
  }
  .item-singer {
    color: #aaa;
  }
  .remove {
    float: right;
    color: #aaa;
    font-size: .8rem;
  }
  .on {
    color: #f40;
  }
</style>
