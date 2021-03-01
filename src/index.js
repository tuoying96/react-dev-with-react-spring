// Original: https://github.com/chenglou/react-motion/tree/master/demos/demo8-draggable-list

import { render } from 'react-dom'
import React, { useRef, useState } from 'react'
import clamp from 'lodash-es/clamp'
import swap from 'lodash-move'
import { useGesture } from 'react-use-gesture'
import { useSprings, useSpring, animated, interpolate, useTrail } from 'react-spring'
// import './stylesDrag.css'

import { add, scale } from 'vec-la'
import Goo from './Goo/Goo.js'
// import TarotComp from './Tarot/TarotComponent.js'
import DraggableList from './DraggableList/DraggableList'
import Gallery from './Gallery/Gallery'

function App() {
  return (
    // <div className="main">
    <div>
      {/* <DraggableList items={'Lorem ipsum dolor sit'.split(' ')}></DraggableList> */}
      {/* <TarotComp></TarotComp> */}
      {/* <SpringCSDN></SpringCSDN> */}
      {/* <ToggleCom></ToggleCom>
      <InterpolateComp></InterpolateComp>
      <MimickingKeyframesComp></MimickingKeyframesComp> */}
      {/* <Goo></Goo> */}
      <Gallery></Gallery>
    </div>
  )
}

// mass: Affects the speed and how far it overshoots the transition.
// mass ：影响速度及其对过渡的超调程度。

// tension: Affects the overall velocity.
// tension ：影响整体速度。

// friction: Controls the resistance and how quickly it decelerates.
// friction ：控制阻力及其减速的速度。

// clamp: Whether it should ever overshoot the transitions.
// clamp ：是否过冲过渡。

// Simple animation
function SpringCSDN() {
  const animation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: {
      mass: 20,
      tension: 50,
      friction: 25,
      clamp: true
    }
  })

  // config.default { mass: 1, tension: 170, friction: 26 }
  // config.default {质量：1，张力：170，摩擦：26}

  // config.gentle { mass: 1, tension: 120, friction: 14 }
  // config.gentle {质量：1，张力：120，摩擦：14}

  // config.wobbly { mass: 1, tension: 180, friction: 12 }
  // config.wobbly {质量：1，张力：180，摩擦：12}
  // config.stiff { mass: 1, tension: 210, friction: 20 }
  // config.slow { mass: 1, tension: 280, friction: 60 }
  // config.molasses { mass: 1, tension: 280, friction: 120 }

  const colorAnimation = useSpring({
    from: { color: 'blue' },
    to: { color: `rgb(255,0,0)` }
    // config: config.wobbly // 不能用，为啥
  })

  const multiAnimation = useSpring({
    from: { opacity: 0, color: 'red' },
    to: [
      { opacity: 1, color: '#ffaaee' },
      { opacity: 1, color: 'red' },
      { opacity: 0.5, color: '#008000' },
      { opacity: 0.8, color: 'black' }
    ]
  })

  return (
    <div>
      <animated.h1 style={animation}> animation opacity from 0 to 1 </animated.h1>
      <animated.h1 style={colorAnimation}>colorAnimation</animated.h1>
      <animated.h1 style={multiAnimation}>Hello World</animated.h1>
    </div>
  )
}

// toggle
function ToggleCom() {
  const [on, toggle] = useState(false)
  const animation = useSpring({
    color: on ? 'blue' : 'red'
  })

  return (
    <div>
      <animated.h1 style={animation}>{!on ? 'I am red' : 'I am blue'}</animated.h1>
      <button onClick={() => toggle(!on)}>Change</button>
    </div>
  )
}

//
function InterpolateComp() {
  const [on, toggle] = useState(false)

  const { xy, co } = useSpring({
    from: { xy: [0, 0], co: 'green' },
    xy: on ? [800, 200] : [0, 0],
    co: on ? 'red' : 'green'
  })
  return (
    <div>
      <animated.h1
        style={{
          transform: xy.interpolate((x, y) => `translate(${x}px, ${y}px)`),
          color: co.interpolate((co) => co)
        }}>
        {!on ? "I'm here" : "Now I'm over here"}
      </animated.h1>
      <button onClick={() => toggle(!on)}>Change</button>
    </div>
  )
}

//

function MimickingKeyframesComp() {
  const [on, toggle] = useState(false)

  const { x, c } = useSpring({
    from: { xy: [0, 0], c: 0 },
    x: on ? 1 : 0,
    c: on ? 1 : 0
  })

  return (
    <div>
      <animated.h1
        style={{
          transform: x
            .interpolate({
              range: [0, 0.25, 0.5, 0.75, 1],
              output: [0, 500, 200, 800, 500]
            })
            .interpolate((x) => `translateX(${x}px)`),

          color: c
            .interpolate({
              range: [0, 0.5, 1],
              output: ['red', 'blue', 'green']
            })
            .interpolate((c) => c)
        }}>
        {!on ? "I'm here" : "Now don't know where I'm going"}
      </animated.h1>
      <button onClick={() => toggle(!on)}>Change</button>
    </div>
  )
}

function Decay() {
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))
  // direction calculates pointer direction
  // temp is like a cache, it contains the values that you return inside "set"
  // this way we can inject the springs current coordinates on the initial event and
  // add delta to it for convenience
  const bind = useGesture({
    onDrag: ({ down, delta, velocity, direction, temp = xy.getValue() }) => {
      set({ xy: add(delta, temp), immediate: down, config: { velocity: scale(direction, velocity), decay: true } })
      return temp
    }
  })
  return <animated.div {...bind()} style={{ transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`) }} />
}

render(<App />, document.getElementById('root'))
