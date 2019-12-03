<template>
  <div id="app">
    <template v-for="i in 100">
      <zh-lazy-component :key="i" @after-init="el => onInit(el, i)" :threshold="'600px'">
        <div class="component"></div>
        <div class="skeleton" slot="skeleton"></div>
      </zh-lazy-component>
    </template>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
  data () {
    return {
      number: 0
    }
  },
  computed: {
    viewport () {
      const el = document.getElementById('app')
      console.log(el instanceof window.HTMLElement, window.HTMLElement)
      return el
    }
  },
  methods: {
    onInit ($el, index) {
      $el.innerHTML = 'Loading...'
      console.log(index + '-------开始发送请求获取数据...')
      setTimeout(() => {
        $el.innerHTML = '完成----' + index
        console.log(index + '-------数据获取完成...')
      }, 2000)
    }
  }
}
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
  margin: 0;
  padding: 0;
}
#app{
  padding: 1px;
}

.skeleton {
  height: 200px;
  background-color: #cccccc;
  margin: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}
.component {
  height: 200px;
  background-color: green;
  margin: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  line-height: 200px;
  color: white;
}
</style>
