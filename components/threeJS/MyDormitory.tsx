import useControls from "r3f-native-orbitcontrols"
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber/native"
import { View } from "react-native"
import { MultipleObjectsModel } from "./MultipleObjects";



export function MyDormitory() {
    const [OrbitControls, events] = useControls()
    const [camPosition, setCamPosition] = useState({ x: 0, y: 0, z: 5 });


    return (
        <View {...events} style={{ flex: 1 }}>
            <Canvas>
                <OrbitControls onChange={(event) => {
                    setCamPosition(event.target.camera.position);
                    // console.log(event.target.camera.position);
                }} />
                <ambientLight intensity={0.7} />
                <pointLight position={[-10, 10, 5]} />
                <MultipleObjectsModel camPosition={camPosition} />
            </Canvas>
        </View>

    )
}

