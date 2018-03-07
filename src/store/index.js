import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import api from '../api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    audio: {
      id: 0,
      name: '歌曲名称',
      singer: '歌手',
      albumUrl: '../assets/placeholder_disk_play_program.png',
      location: '',
      album: ''
    },
    isinlist: false,
    currentIndex: 0, // 当前播放的歌曲位置
    playing: false, // 是否正在播放
    loading: false, // 是否正在加载中
    songList: [], // 播放列表
    currentTime: 0,
    tmpCurrentTime: 0,
    durationTime: 0,
    bufferedTime: 0,
    change: false, // 判断是更改的时间还是播放的时间
    show: false
  },
  getters: {
    audio: state => state.audio,
    songList: state => state.songList,
    loading: state => state.loading,
    playing: state => state.playing,
    change: state => state.change,
    currentTime: state => state.currentTime,
    tmpCurrentTime: state => state.tmpCurrentTime,
    durationTime: state => state.durationTime,
    bufferedTime: state => state.bufferedTime,
    prBufferedTime: state => {
      return state.bufferedTime / state.durationTime * 100
    },
    prCurrentTime: state => {
      return state.currentTime / state.durationTime * 100
    },
    show: state => state.show,
    isinlist: state => state.isinlist
  },
  mutations: {
    PLAY (state) {
      state.playing = true
    },
    PAUSE (state) {
      state.playing = false
    },
    LOADING (state) {
      state.loading = true
    },
    CLOSELOADING (state) {
      state.loading = false
    },
    SETAUDIO (state) {
      state.audio = state.songList[state.currentIndex - 1]
    },
    REMOVEAUDIO (state, index) {
      if (state.songList[index].id === state.audio.id) {
        state.songList.splice(index, 1)
        if (state.songList.length === 0) {
          state.audio = {
            'id': 0,
            'name': '歌曲名称',
            'singer': '演唱者',
            'albumUrl': '../assets/placeholder_disk_play_program.png',
            'location': '',
            'album': ''
          }
          state.show = false
          state.playing = false
          state.loading = false
        } else {
          if (state.songList.length === index) {
            index = 1
          }
          state.audio = state.songList[index]
          state.currentIndex = index + 1
        }
      } else {
        state.songList.splice(index, 1)
      }
    },
    SETAUDIOINDEX (state, index) {
      state.audio = state.songList[index]
      state.currentIndex = index + 1
    },
    SETLOCATION (state, url) {
      state.audio.location = url
    },
    ADDTOLIST (state, audio) {
      let items = Array.prototype.concat.call(audio)
      items.forEach((item) => {
        state.songList.push(item)
      })
    },
    ISINLIST (state, audio) {
      if (state.songList[audio.index] && (state.songList[audio.index].id === audio.item.id)) {
        state.isinlist = true
      } else {
        state.isinlist = false
      }
      state.currentIndex = audio.index + 1
    },
    PLAYNEXT (state) {
      state.currentIndex++
      if (state.currentIndex > state.songList.length) {
        state.currentIndex = 1
      }
      state.audio = state.songList[state.currentIndex - 1]
    },
    PLAYPREV (state) {
      state.currentIndex--
      if (state.currentIndex < 1) {
        state.currentIndex = state.songList.length
      }
      state.audio = state.songList[state.currentIndex - 1]
    },
    UPDATEBUFFEREDTIME (state, time) {
      state.bufferedTime = time
    },
    UPDATEDURATIONTIME (state, time) {
      state.durationTime = time
    },
    UPDATETMPCURRENTTIME (state, time) {
      state.tmpCurrentTime = time
    },
    SETCHANGE (state, flag) {
      state.change = flag
    },
    UPDATECURRENTTIME (state, time) {
      state.currentTime = time
    },
    SHOWPLAYER (state, flag) {
      if (state.songList.length > 0 && flag === true) {
        state.show = flag
      } else {
        state.show = false
      }
    }
  },
  actions: {
    getSong ({commit, state}, id) {
      // 使用CancelToken中断axios请求
      let CancelToken = Axios.CancelToken
      let source = CancelToken.source()
      if (state.loading && state.songList.length > 0) {
        source.cancel()
      }
      commit('LOADING')
      Axios.get(api.getSong(id)).then((res) => {
        let url = res.data.data[0].url
        commit('SETAUDIO')
        commit('SETLOCATION', url)
        commit('PLAY')
      }).catch((err) => {
        window.alert('获取歌曲信息出错' + err)
      })
    }
  }
})
export default store
