import useControls from "r3f-native-orbitcontrols"

import { Canvas } from "@react-three/fiber/native"
import { View } from "react-native"
// The import bellow is used only in Canvases:
import { PerspectiveCamera } from "three"

export function SingleCanvas() {
  const [OrbitControls, events] = useControls()

  return (
    // If this isn't working check if you have set the size of the View.
    // The easiest way to do it is use the full size, e.g.:
    //   <View style={{ flex: 1 }} />
    <View {...events}>
      <Canvas>
        <OrbitControls />

        {/* Place the scene elements here as usual */}
      </Canvas>
    </View>
  )
}

export function Canvases() {
  // You also can use the same OrbitControls for multiple canvases
  // creating an effect like the game
  // The Medium (https://store.steampowered.com/app/1293160)
  const [OrbitControls, events] = useControls()

  // In this case the same camera must be used in all the canvases
  const camera = new PerspectiveCamera()
  // You need to configure the camera too. Follow three.js' documentation.
  // Default configuration:
  //   camera.position.set(10, 10, 10)
  //   camera.lookAt(0, 0, 0)

  return (
    <View {...events}>
      <Canvas camera={camera}>
        <OrbitControls />
      </Canvas>
      <Canvas camera={camera}>
        <OrbitControls />
      </Canvas>
    </View>
  )
}