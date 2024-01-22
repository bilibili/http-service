<template>
    <div id="wonderland">
        <div id="viewport">
            <div id="content" ref="content">
                <div id="emiter" @click="launch" :count="countText"><img src="../../assets/musk.png" alt=""></div>
                <div id="sky">
                    <div class="cloud" v-for="c in clouds" :style="{
                        left: c.left,
                        top: c.top,
                    }"></div>
                </div>
                <div id="rocket" ref="rocket">
                    <div id="fetch" :style="{
                        opacity: back ? 1 : 0,
                    }">💡Fetch Done</div>
                    <div id="head"></div>
                    <div id="body">
                        <div v-for="(t, i) in list" :class="idx === i ? 'active' : ''">{{t}}</div>
                    </div>
                    <div id="foot">
                        <div id="part1"></div>
                        <div id="part2"></div>
                    </div>
                </div>
                <div id="land"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
const content = ref<HTMLElement>(null)
const rocket = ref<HTMLElement>(null)
const list = ref([
    'Timeout',
    'Body',
    'ResData',
    'InitCtx',
    'Retry',
].reverse())
const height = 6000
const idx = ref(-1)
const start = ref(false)
const back = ref(false)
const clouds = ref([
    { left: '10%', top: '30px' },
])

const countText = computed(() => {
    if (back.value) return ''
    const left = list.value.length - idx.value
    if (idx.value === -1) return 'Launch'
    if (left === 0) return 'Ignition'
    if (left === -1) return 'Liftoff!'
    return left
})

let y = 0
let bottom = 0
let v = 0

function startFn() {
    if (bottom < y) {
        v+= .01
        bottom += v
        content.value.style.bottom = `-${bottom}px`
        rocket.value.style.bottom = `${bottom + 50}px`
        if (bottom > y / 5) {
            rocket.value.style.transform = `scale(${Math.max(1 - (bottom - y / 5) / y, .3)})`
        }
        requestAnimationFrame(startFn)
    } else {
        back.value = true
        v = 0
        time(1500).then(returnFn)
    }
}
function returnFn() {
    if (bottom > 0) {
        v+= .01
        bottom -= v
        content.value.style.bottom = `-${bottom}px`
        rocket.value.style.bottom = `${bottom + 50}px`
        if (bottom > y / 5) {
            rocket.value.style.transform = `scale(${Math.max(1 - (bottom - y / 5) / y, .3)})`
        } else {
            rocket.value.style.transform = ''
        }
        requestAnimationFrame(returnFn)
    } else {
        countup()
    }
}



function time(delay: number): Promise<boolean> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true)
        }, delay)
    })
}

async function countup() {
    let p = Promise.resolve(true)
    while (idx.value >= 0) {
        await p
        idx.value = idx.value - 1
        p = time(1000)
    }
}
async function countdown() {
    let p = Promise.resolve(true)
    while (idx.value < list.value.length + 1) {
        await p
        idx.value = idx.value + 1
        p = time(1000)
    }
}

async function launch() {
    if (start.value) return
    start.value = true
    const el = content.value
    el.style.height = `${height}px`
    y = height - el.parentNode.offsetHeight
    clouds.value= new Array(Math.round(height / 50)).fill(0).map((_, i) => {
        return {
            left: `${Math.random() * 100}%`,
            top: `${i * 50}px`,
        }
    }).filter((i) => {
        const target = Math.random() > .5
        if (!target) return false
        const top = Number(i.top.replace('px', ''))
        return top > 100 && top < height - 700
    })

    await countdown()
    startFn()
}

</script>

<style scoped>
#wonderland {
    width: 100%;
    padding-bottom: 75%;
    position: relative;
}
#control button {
    border: 1px solid #000;
    cursor: pointer;
}
#viewport, #content {
    width: 100%;
    position: absolute;
    left: 0;
}
#viewport {
    top: 0;
    height: 100%;
    overflow: hidden;
}
#content {
    bottom: 0;
}
#sky {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 50px;
    right: 0;
    left: 0;
    pointer-events: none;
}
#sky .cloud {
    position: absolute;
}
#sky .cloud:nth-child(1) {
    top: 10%;
    left: 60%;
}
#sky .cloud:nth-child(2) {
    top: 20%;
    left: 40%;
}
#sky .cloud:nth-child(3) {
    top: 30%;
    left: 70%;
}

.cloud {
    background-color: #fff;
    background-image: -webkit-linear-gradient(hsla(0,0%,0%,0), hsla(0,0%,0%,.1));
    border-radius: 1em;
    box-shadow: inset 0 0 0 1px hsla(0,0%,100%,.5);
    display: inline-block;
    height: 1em;
    left: 50%;
    margin-left: -1.5em;
    position: absolute;
    top: 50%;
    width: 3em;
    -webkit-filter: drop-shadow(0 2px 3px hsla(0,0%,0%,.25));
}
.cloud:after,
.cloud:before {
    background-color: #fff;
    content: '';
    border-radius: 100%;
    position: absolute;
}
.cloud:after {
    background-image: -webkit-linear-gradient(hsla(0,0%,0%,0) 50%, hsla(0,0%,0%,.025));
    height: 1em;
    right: .4em;
    top: -.5em;
    width: 1em;
}
.cloud:before {
    background-image: -webkit-linear-gradient(hsla(0,0%,0%,0) 50%, hsla(0,0%,0%,.075));
    height: 1.6em;
    left: .4em;
    top: -.75em;
    width: 1.6em;
}​
#land {
    height: 50px;
    border-top: 1px solid grey;
    position: absolute;
    width: 100%;
    bottom: 0;
}
#rocket {
    width: 100px;
    position: absolute;
    bottom: 50px;
    left: calc(50% - 25px);
    pointer-events: none;
}
#rocket #fetch {
    text-align: center;
    font-size: 13px;
}
#rocket #body {
    display: flex;
    flex-direction: column-reverse;
}
#rocket #body > div {
    background-color: #f1f1f1;
    border-top: 1px solid #ddd;
    border-bottom: none;
    text-align: center;
    height: 50px;
    font-size: 12px;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 50px;

}
#rocket #body > div.active {
    background-color: #69aadc;
    transition: .2s;
}
#rocket #foot #part1 {
    border-top: 1px solid #ddd;
    background-color: #f1f1f1;
    height: 30px;
    width: 200%;
    clip-path: polygon(25% 0, 75% 0, 100% 100%, 0 100%);
    transform: translateX(-25%)
}
#rocket #foot #part2 {
    background-color: #f1f1f1;
    height: 50px;
    width: 200%;
    transform: translateX(-25%)
}
#rocket #head {
    background-color: #f1f2f3;
    width: 100%;
    height: 80px;
    clip-path: polygon(50% 0, 50% 0, 100% 100%, 0 100%);
}
#emiter {
    width: 50px;
    position: absolute;
    bottom: 50px;
    left: 0;
    cursor: pointer;
}
#emiter::after {
    content: attr(count);
    position: absolute;
    top: 0;
    left: 100%;
    font-size: 12px;
    width: 200px;
    transition: transform .2s;
}
</style>