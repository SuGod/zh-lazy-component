<template>
  <transition-group
    :tag="tag"
    @before-enter=" e => $emit('before-enter',e)"
    @before-leave="e => $emit('before-leave', e)"
    @after-enter="e => $emit('after-enter', e)"
    @after-leave="e => $emit('after-leave', e)"
    name="zh-lazy-component"
    style="position: relative;"
  >
    <div key="content" v-if="hasInit" ref="content">
      <slot :loading="loading"></slot>
    </div>
    <div key="skeleton" v-else-if="$slots.skeleton">
      <slot name="skeleton"></slot>
    </div>
    <div key="loading" v-else></div>
  </transition-group>
</template>

<script>
/**
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"
  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
 */
export default {
  name: 'zh-lazy-component',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    // 延时渲染
    timeout: {
      type: Number
    },
    viewport: {
      type: typeof window !== 'undefined' ? window.HTMLElement : Object,
      default: () => null
    },
    // 滚动方向:
    direction: {
      type: String,
      validator: val => {
        // 垂直/水平
        return ['vertical', 'horizontal'].includes(val)
      },
      default: 'vertical'
    },
    maxWaitingTime: {
      type: Number,
      default: 50
    },
    // 超出容器的 阈值/临界值
    threshold: {
      type: String,
      validator: val => {
        return ['px', '%'].some(item => val.indexOf(item) !== -1)
      },
      default: '0px'
    }
  },
  data () {
    return {
      loading: false,
      hasInit: false,
      io: null
    }
  },
  watch: {
    hasInit (v) {
      this.$nextTick(() => {
        const _el = this.$refs['content'].children[0]
        this.$emit('after-init', _el)
      })
    }
  },
  computed: {
    rootMargin () {
      let lastChar = this.threshold.charAt(this.threshold.length - 1)
      const _symbol = lastChar === '%' ? lastChar : 'px'
      const _r = {
        vertical: `${this.threshold} 0${_symbol}`,
        horizontal: ` 0${_symbol} ${this.threshold}`
      }
      return _r[this.direction]
    }
  },
  created () {
    // 延时初始化
    this.timer = this.timeout && setTimeout(this.init, this.timeout)
  },
  mounted () {
    if (!this.timeout) {
      // 根据滚动方向来构造视口外边距，用于提前加载
      /**
        * IntersectionObserver.root 只读
          所监听对象的具体祖先元素(element)。如果未传入值或值为null，则默认使用顶级文档的视窗。
        * IntersectionObserver.rootMargin 只读
          计算交叉时添加到根(root)边界盒bounding box的矩形偏移量， 可以有效的缩小或扩大根的判定范围从而满足计算需要。
          此属性返回的值可能与调用构造函数时指定的值不同，因此可能需要更改该值，以匹配内部要求。
          所有的偏移量均可用像素(pixel)(px)或百分比(percentage)(%)来表达, 默认值为"0px 0px 0px 0px"。
        * IntersectionObserver.thresholds 只读
          一个包含阈值的列表, 按升序排列, 列表中的每个阈值都是监听对象的交叉区域与边界区域的比率。当监听对象的任何阈值被越过时，都会生成一个通知(Notification)。如果构造器未传入值, 则默认值为0。
       */
      // 观察视口与组件容器的交叉情况
      this.io = new window.IntersectionObserver(this.intersectionHandler, {
        rootMargin: this.rootMargin,
        root: this.viewport,
        threshold: [0, Number.MIN_VALUE, 0.01]
      })
      this.io.observe(this.$el)
    }
  },
  beforeDestroy () {
    this.timer && clearTimeout(this.timer)
    // 在组件销毁前取消观察
    this.io && this.io.unobserve(this.$el)
  },
  methods: {
    // 初始化
    init () {
      this.$emit('before-init')
      this.loading = true
      // 由于函数会在主线程中执行，加载懒加载组件非常耗时，容易卡顿
      // 所以在requestAnimationFrame回调中延后执行
      this.requestAnimationFrame(() => {
        this.hasInit = true
        this.$emit('init')
      })
    },
    requestAnimationFrame (callback) {
      // 防止等待太久没有执行回调
      // 设置最大等待时间
      // 未初始化 执行callback
      setTimeout(() => {
        if (this.hasInit) return
        callback()
      }, this.maxWaitingTime)

      const _callFn = window.requestAnimationFrame || (callback => setTimeout(callback, 1000 / 60))
      // requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。
      // 兼容不支持requestAnimationFrame 的浏览器
      // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
      return _callFn(callback)
    },
    // 交叉情况变化处理函数
    intersectionHandler (entries) {
      const { isIntersecting, intersectionRatio } = entries[0]
      // 正在交叉 || 交叉率大于0
      if (isIntersecting && intersectionRatio) {
        // console.log(entries, 'entriesentriesentries')
        this.init()
        this.io.unobserve(this.$el)
      }
    }
  }
}
</script>

<style lang="css" scoped>
/* 动画 */
.zh-lazy-component-enter {
  opacity: 0;
}

.zh-lazy-component-enter-to {
  opacity: 1;
}

.zh-lazy-component-enter-active {
  transition: opacity 0.3s 0.2s;
  position: absolute;
  top: 0;
  width: 100%;
}

.zh-lazy-component-leave {
  opacity: 1;
}

.zh-lazy-component-leave-to {
  opacity: 0;
}

.zh-lazy-component-leave-active {
  transition: opacity 0.5s;
}
</style>
