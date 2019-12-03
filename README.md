## 使用

### 2. 模版语法

```html
 <zh-lazy-component @init="init" @beforeInit="beforeInit" >
  <!-- real component-->
  <component />
  <!-- skeleton component -->
  <skeleton slot="skeleton"/>
</zh-lazy-component>
```

## Props

| 参数                    | 说明  | 类型 | 可选值 | 默认值 |
|-------------------------|-------|------|--------|--------|
| viewport | 组件所在的视口，如果组件是在页面容器内滚动，视口就是该容器 | HTMLElement | true      | `null`，代表视窗 |
| direction | 视口的滚动方向, `vertical`代表垂直方向，`horizontal`代表水平方向  | String | true      | `vertical` |
| threshold | 预加载阈值, `px`/`%`  | String | true      | `0px` |
| tag | 包裹组件的外层容器的标签名  | String | true  | `div` |
| timeout | 等待时间，如果指定了时间，不论可见与否，在指定时间之后自动加载  | Number | true    | - |

## Events

| 事件名                    | 说明  | 事件参数
|-------------------------|-------|------|
| before-init | 模块可见或延时截止导致准备开始加载懒加载模块 | - |
| init | 开始加载懒加载模块，此时骨架组件开始消失 | - |
| before-enter | 懒加载模块开始进入 | el |
| before-leave | 骨架组件开始离开 | el |
| after-leave | 骨架组件已经离开 | el |
| after-enter | 懒加载模快已经进入 | el |
| after-init | 初始化完成 | - | el |
