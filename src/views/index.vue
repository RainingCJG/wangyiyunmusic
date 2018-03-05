<template>
  <div>
    <header class="header">
      <div class="fixed-bar clearfix">
          <div class="logo fl"></div>
          <div class="search fr"><i class="fa fa-search"></i></div>
      </div>
      <ul class="nav-bar">
        <router-link to="/index/popular" tag="li" class="tab-item">时下流行</router-link>
        <router-link to="/index/songList" tag="li" class="tab-item">歌单</router-link>
        <router-link to="/index/rankingList" tag="li" class="tab-item">排行榜</router-link>
        <router-link to="/index/hotSinger" tag="li" class="tab-item">热门歌手</router-link>
      </ul>
    </header>
    <section class="default-view">
      <keep-alive>
        <router-view />
      </keep-alive>
    </section>
  </div>
</template>

<script>
</script>

<style scoped>
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
    margin-top: 5.075rem;
  }
  .nav-bar .router-link-active {
    color: #cd5c5c;
  }
  .nav-bar .router-link-active:after {
    content: '';
    display: block;
    width: 100%;
    height: .075rem;
    background-color: #F08080;
  }
</style>
