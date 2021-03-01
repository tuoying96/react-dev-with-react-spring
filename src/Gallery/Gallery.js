// https://codesandbox.io/embed/react-spring-animated-image-gallery-5vs9d?fontsize=14&hidenavigation=1&theme=dark
// https://codesandbox.io/s/react-spring-animated-image-gallery-5vs9d?from-embed=&file=/src/Gallery.js:530-537

import React, { useCallback, useState } from 'react'
import { animated, useTransition, config } from 'react-spring'

import mountains from './images/mountains.jpg'
import beach from './images/beach.jpg'
import desert from './images/desert.jpg'

import './gallery.css'

const images = [
  ({ style }) => <animated.img src={mountains} alt="Mountains" style={style} />,
  ({ style }) => <animated.img src={beach} alt="Beach" style={style} />,
  ({ style }) => <animated.img src={desert} alt="Desert" style={style} />
]

export default function Gallery() {
  const [index, setIndex] = useState(0)
  const onClick = useCallback(() => setIndex((state) => (state + 1) % 3), [])

  const transitions = useTransition(index, (p) => p, {
    from: { opacity: 0, transform: 'translateX(100%)' },
    enter: { opacity: 1, transform: 'translateX(0%)' },
    leave: { opacity: 0, transform: 'translateX(-150%)' },
    config: config.slow
  })

  return (
    <div className="gallery" onClick={onClick}>
      <p className="gallery-directions">Click anywhere to see the next image</p>
      {transitions.map(({ item, props, key }) => {
        const Image = images[item]
        return <Image key={key} style={props} />
      })}
    </div>
  )
}
