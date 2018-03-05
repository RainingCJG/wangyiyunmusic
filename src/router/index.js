import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/index'
import Popular from '../views/popular'
import SongList from '../views/songList'
import HotSinger from '../views/hotSinger'
import RankingList from '../views/rankingList'
import PlayListDetail from '../views/playListDetail'
import PlayerDetail from '../views/playerDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      redirect: '/index/popular'
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      children: [
        {
          path: 'popular',
          component: Popular
        },
        {
          path: 'songList',
          component: SongList
        },
        {
          path: 'rankingList',
          component: RankingList
        },
        {
          path: 'hotSinger',
          component: HotSinger
        }
      ]
    },
    {
      name: 'playListDetail',
      path: '/playListDetail/:id',
      component: PlayListDetail
    },
    {
      name: 'playerDetail',
      path: '/playerDetail/:id',
      component: PlayerDetail
    }
  ]
})
