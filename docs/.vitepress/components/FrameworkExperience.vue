<template>
  <div class="framework-experience">
    <div class="fe-try" @click="start">Try it!</div>

    <div class="fe-onion" @mouseleave="hoverIndex = -1">
      <div class="fe-onion-line1" :class="animating && 'animating'" :style="{
        top: '80px',
        height: '20px',
        width: line1Width + 'px',
        backgroundImage: `linear-gradient(90deg, ${colorList[0]},${colorList[1]})`
      }"></div>
      <div class="fe-onion-line2" :class="animating && 'animating'" :style="{
        left: line1Width - 20 + 'px',
        width: 20 + 'px',
        top: '100px',
        height: line2Height + 'px',
        backgroundImage: `linear-gradient(180deg,${colorList[1]},${colorList[2]})`
      }"></div>
      <div class="fe-onion-line3" :class="animating && 'animating'" :style="{
        right: 600 - line1Width + 20 + 'px',
        width: line3Width ? line3Width - 20 + 'px' : '',
        height: '20px',
        top: 80 + line2Height + 'px',
        backgroundImage: `linear-gradient(270deg,${colorList[2]},${colorList[3]})`
      }"></div>
      <div
        class="fe-onion-layer"
        v-for="(m, i) in allMiddlewares"
        @mouseenter="() => {
          if (animating) return
          hoverIndex = i
        }"
        :key="m.name"
        :title="m.name"
        :style="getOnionLayerStyle(i)">
        <div class="fe-onion-layer-halo" :style="getOnionLayerHaloStyle(i)"></div>  
        <div class="fe-onion-layer-name">{{ m.name }}</div>
      </div>
    </div>

    <div class="fe-console" v-show="showLine">
      <div class="fe-console-header">terminal</div>
      <div class="fe-console-content">
        <div class="fe-console-line" v-for="(log, i) in logs" :key="i" v-html="log"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, Ref, computed, onMounted } from 'vue'
interface Middleware {
  name: string
  builtin?: boolean
  handler?: any
  color?: string
}

const middlewares: Ref<Middleware[]> = ref([])
const allMiddlewares: Ref<Middleware[]> = computed(() => {
  const list: Middleware[] = [
    {
      name: 'Retry',
      builtin: true,
    },
    {
      name: 'Init Context',
      builtin: true,
    },
    ...middlewares.value,
    {
      name: 'Res Data',
      builtin: true,
    },
    {
      name: 'Body',
      builtin: true,
    },
    {
      name: 'Timeout',
      builtin: true,
    },
    {
      name: 'Fetch',
      builtin: true,
    },
  ]
  const colorList = [
    "rgb(75, 0, 130)",
    "rgb(109, 0, 137)",
    "rgb(141, 0, 142)",
    "rgb(171, 0, 146)",
    "rgb(200, 0, 147)",
    "rgb(228, 0, 148)",
]
  
  return list.map((m, idx) => Object.assign(m, {
    color: colorList[idx]
  }))
})

const hoverIndex = ref(-1)

const layerWidth = 100

function getOnionLayerStyle(i) {
  if (showLine.value) {
    return {
      width: layerWidth + 'px',
      height: '300px',
      left: (layerWidth + 20) * i + 'px',
      top: 0,
    }
  }
  const len = allMiddlewares.value.length
  const scale = (len - i) / len
  return {
    zIndex: i,
    transform: `translate(-50%, -50%)`,
    width: scale * 600 + 'px',
    height: scale * 500 + 'px',
  }
}

function getOnionLayerHaloStyle(i) {
  
  const isHover = hoverIndex.value === i
  return {
    backgroundColor: allMiddlewares.value[i].color,
    transform: `scale(${(isHover ? 1.05 : 1)}) `,
    borderRadius: showLine.value ? '8px' : '',
  }
}

const showLine = ref(false)

const time = (s) => new Promise((r) => {
  setTimeout(() => {
    r(true)
  }, s * 1000)
})

function log(m: Middleware, text) {
  const { name, color } = m
  if (name === 'Fetch') {
    if (text === 'before') {
      text = 'start'
    } else {
      text = 'done'
    }
  }
  return `[<em style="color:${color}">${name}</em>]request ${text}`
}
async function start() {
  // reset
  line1Width.value = 0
  line2Height.value = 0
  line3Width.value = 0
  logs.value = []
  await time(0)
  // start
  showLine.value = true
  animating.value = true
  const len = allMiddlewares.value.length
  const width = layerWidth + 20
  line1Width.value = len * width - 20
  let i = 0
  hoverIndex.value = i
  logs.value.push(log(allMiddlewares.value[i], 'before'))
  let timer = setInterval(() => {
    i++
    logs.value.push(log(allMiddlewares.value[i], 'before'))
    hoverIndex.value = i
  }, 500)
  await time(2.7)
  clearInterval(timer)
  line2Height.value = 120
  await time(1.2)
  line3Width.value = len * width - 20
  logs.value.push(log(allMiddlewares.value[i], 'after'))
  timer = setInterval(() => {
    logs.value.push(log(allMiddlewares.value[i], 'after'))
    i--
    hoverIndex.value = i
  }, 500)
  await time(3)
  clearInterval(timer)
  animating.value = false
  hoverIndex.value = -1
}

const line1Width = ref(0)
const line2Height = ref(0)
const line3Width = ref(0)
const animating = ref(false)

const logs = ref([])

const colorList = ref([
    "linear-gradient(90deg, rgb(0, 191, 255), rgb(0, 177, 255))",
    "linear-gradient(rgb(0, 177, 255), rgb(0, 161, 255))",
    "linear-gradient(270deg, rgb(0, 161, 255), rgb(30, 144, 255))"
]);


</script>

<style>
.fe-try {
  margin-top: 20px;
  border-radius: 4px;
  padding: 0 4px;
  width: fit-content;
  height: 28px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  background-color: #00AEEC;
  line-height: 28px;
  color: #fff;
}

.fe-onion {
  margin-top: 20px;
  width: 600px;
  height: 500px;
  border-radius: 40%;
  position: relative;
}

.fe-onion-line1 {
  position: absolute;
  z-index: 1;
  left: 0;
  width: 0;
  border-radius: 4px 0 0 4px;
  background-color: #00AEEC;
}
.fe-onion-line1.animating {
  transition: width 2.7s linear;
}
.fe-onion-line2.animating {
  transition: height 1.2s linear;
}
.fe-onion-line3.animating {
  transition: width 3s linear;
}

.fe-onion-line2 {
  position: absolute;
  z-index: 1;
  top: 20px;
  height: 0;
  background-color: #00AEEC;
}

.fe-onion-line3 {
  position: absolute;
  z-index: 1;
  width: 0;
  border-radius: 4px 0 0 4px;
  background-color: #00AEEC;
}

.fe-onion-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 50%;
  top: 50%;
}
.fe-onion-layer-halo {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: all .2s;
  border-radius: 50%;
}
.fe-onion-layer-name {
  position: absolute;
  left: 18%;
  top: 10%;
  z-index: 10;
  color: #FFF;
  overflow: hidden;
  text-align: center;
  width: 70%;
}
.fe-console {
  margin-top: -180px;
  background: #000;
  height: 400px;
  border-radius: 6px;
  overflow: hidden;
}
.fe-console-line {
  font-size: 14px;
}
.fe-console-content {
  padding: 16px;
  font-family: Söhne Mono,Monaco,Andale Mono,Ubuntu Mono,monospace!important;
  color: #fff;
}
.fe-console-header {
  padding: 8px 16px;
  font-size: 12px;
  line-height: 16px;
  color: rgb(217, 217, 227);
  background-color: rgb(52, 53, 65);
  border-color: rgb(217, 217, 227);
}
</style>