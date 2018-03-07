<template>
  <div id="app">
    <keep-alive><router-view/></keep-alive>
    <Player v-show="show"></Player>
  </div>
</template>

<script>
import Player from './components/Player.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
    Player
  },
  computed: {
    ...mapGetters([
      'show'
    ])
  }
}
</script>

<style>
/*浏览器重置*/
html,body,div,header,ul,li,img,figure,figcaption,a,p,button,article {
  margin: 0;
  padding: 0;
}
html,body {
  height: 100%;
}
ul,li {
  list-style: none;
}
a {
  text-decoration: none;
}
button {
  border: none;
  outline: none;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix:after {
  content: '';
  display: block;
  overflow: hidden;
 clear: both;
}
#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: .7rem;
}
</style>
