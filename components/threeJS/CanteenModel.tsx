import useControls from "r3f-native-orbitcontrols"
import React, { useState } from "react";
import { Canvas, LoaderProto, useLoader } from "@react-three/fiber/native"
import { View } from "react-native"
import { THREE, TextureLoader } from "expo-three";
import { HandleModel } from "./HandleModel";



export function CanteenModel({ onSelectRestaurant, setTabSwitchAllowed, modalFile, selectedFloors, reloadModel, onSelect, setOnSelect }) {
    const [OrbitControls, events] = useControls()
    const [camPosition, setCamPosition] = useState({ x: 0, y: 0, z: 5 });
    const [target, setTarget] = useState(new THREE.Vector3());

    useLoader(TextureLoader as LoaderProto<unknown>,
        require('../../assets/texture.jpg'),
    );

    return (
        <View {...events} style={{ flex: 1 }}>
            <Canvas>
                <OrbitControls
                    onChange={(event) => {
                        setCamPosition(event.target.camera.position);
                    }}
                    target={target}
                    maxDistance={onSelect ? 2.5 : 10}
                />
                <ambientLight intensity={0.7} />
                <pointLight position={[-10, 10, 5]} />
                {
                    reloadModel ||
                    <HandleModel
                        modalFile={modalFile}
                        camPosition={camPosition}
                        onSelectRestaurant={onSelectRestaurant}
                        setTabSwitchAllowed={setTabSwitchAllowed}
                        selectedFloors={selectedFloors}
                        setTarget={setTarget}
                        setOnSelect={setOnSelect}
                    />
                }
            </Canvas>
        </View>
    )
}
