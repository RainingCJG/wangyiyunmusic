<template>
  <div class="popular">
    <div class="loading-wrapper" v-if="isloading">
      <div class="loading"></div>
      <div class="loading-text">正在加载中</div>
    </div>
    <div class="container" v-show="!isloading">
      <div id="banner" class="banner">
        <swiper :options="swiperOption">
          <swiper-slide><img src="../assets/banner1.jpg" alt="" class="banner-item"></swiper-slide>
          <swiper-slide><img src="../assets/banner2.jpg" alt="" class="banner-item"></swiper-slide>
          <swiper-slide><img src="../assets/banner3.jpg" alt="" class="banner-item"></swiper-slide>
          <swiper-slide><img src="../assets/banner4.jpg" alt="" class="banner-item"></swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div class="wrapper">
        <div class="rec-title song-list">推荐歌单<router-link class="more" :to="{path: '/index/songList'}">更多></router-link></div>
        <ul>
          <router-link :to="{name: 'playListDetail', params: {id: item.id,name: item.name,coverImgUrl: item.coverImgUrl,creator: item.creator,count: item.playCount}}" flag="li" v-for="item in playlist" :key="item.id">
            <figure class="wrap">
              <div><img :src="item.coverImgUrl + '?param=230y230'" alt="热门歌单" class="img-res" lazy="loading"><span class="playcount">{{item.playCount | formatCount}}</span></div>
              <figcaption class="item-content">{{item.name}}</figcaption>
            </figure>
          </router-link>
        </ul>
        <div class="rec-title mv">推荐MV<a class="more">更多></a></div>
        <figure class="mv-wrap" v-for="item in mvlist" :key="item.id">
          <div><img :src="item.cover" alt="热门mv" class="img-res" lazy="loading"></div>
          <div class="mv-name">{{item.name}}</div>
            <div class="mv-author">{{item.artistName}}</div>
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import api from '../api/index.js'
export default {
  data () {
    return {
      isloading: true,
      swiperOption: {
        pagination: {el: '.swiper-pagination', clickable: true},
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        loop: true
      },
      playlist: [],
      mvlist: []
    }
  },
  components: {
    swiper, swiperSlide
  },
  created () {
    this.get()
  },
  methods: {
    get () {
      // 获取歌单列表
      this.$http.get(api.getList('华语', 1000, 0, 6)).then((res) => {
        this.isloading = false
        this.playlist = res.data.result.playlists
      })
      // 获取mv列表
      this.$http.get(api.getList('hot', 1004, 0, 4)).then((res) => {
        this.mvlist = res.data.result.mvs
      })
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
  .popular {
    position: absolute;
    left: 0;
    top: 0;
    width: 25%;
    height: 100%;
    padding-top: 5.075rem;
    box-sizing: border-box;
    overflow-y: scroll;
  }
  .banner {
    height: 7.4rem;
  }
  .banner-item {
    width: 100%;
    height: 7.4rem;
    background: url(../assets/banner-item-load.png) no-repeat;
    background-size: cover;
  }
  .wrapper {
    padding: 0 .25rem;
  }
  .rec-title {
    height: 1.8rem;
    line-height: 1.8rem;
    color: #333;
    font-size: .8rem;
    padding-left: 1.2rem;
  }
  .song-list {
    background: url(../assets/aei.png) no-repeat left center;
    background-size: 1rem 1rem;
  }
  .more {
    float: right;
    font-size: .6rem;
    color: #666;
  }
  .wrap {
    position: relative;
    width: 5rem;
    float: left;
    margin: 0 .05rem .5rem .1rem;
  }
  .img-res {
    width: 5rem;
    height: 5rem;
  }
  img[lazy="loading"] {
    background: url(../assets/default_cover.png) no-repeat;
    background-size: cover;
  }
  .playcount {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    text-align: right;
    padding: .01rem;
    background-color: rgba(0,0,0,.2);
    color: #fff;
  }
  .item-content {
    font-size: .6rem;
    height: 1.7rem;
    line-height: .9rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #4a4a4a;
  }
  .mv {
    background: url(../assets/aee.png) no-repeat left center;
    background-size: 1rem 1rem;
    overflow: hidden;
  }
  .mv-wrap {
    position: relative;
    width: 48.5%;
    float: left;
    margin: 0 .1rem .5rem .1rem;
  }
  .mv-wrap .img-res {
    width: 100%;
  }
  .mv-name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .mv-author {
    font-size: .6rem;
    color: #666;
  }
  .loading {
    position: absolute;
    top: 0;
    left: 50%;
    background: #fff;
    width: 2.5rem;
    height: 2.5rem;
    margin-top: 70%;
    margin-left: -1.25rem;
    background: url('../assets/rage_loading.png') no-repeat;
    background-size: cover;
    -webkit-animation: rotating 5s  linear infinite;
    animation: rotating 5s linear infinite;
  }
  .loading-text {
    position: absolute;
    top: 0;
    margin-top: 87%;
    width: 100%;
    color: #4a4a4a;
    text-align: center;
  }
  @keyframes rotating{
    0%{transform: rotate(0deg);}
    100%{transform: rotate(360deg);}
  }
</style>
