import useControls from "r3f-native-orbitcontrols"
import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber/native"
import { View } from "react-native"
import { THREE } from "expo-three";
import { HandleModel } from "./HandleModel";
import { loadFile } from "./LoadFile";



export function CanteenModel({ onSelectRestaurant, setTabSwitchAllowed, modalFile, selectedFloors, reloadModel, onSelect, setOnSelect, businessNeedLocate }) {
    const [OrbitControls, events] = useControls()
    const [camPosition, setCamPosition] = useState({ x: 0, y: 0, z: 5 });
    const [target, setTarget] = useState(new THREE.Vector3());

    const [gltf, setGLTF] = useState<any>()

    useEffect(() => {
        setGLTF(undefined);

        const loadGLTF = async () => {
            if (!modalFile) return;
            return await loadFile(modalFile)
        }
        loadGLTF().then((gl) => {
            setGLTF(gl)
        })

    }, [modalFile]);

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
                    (!reloadModel && gltf?.scene) ?
                        <HandleModel
                            scene={gltf.scene}
                            camPosition={camPosition}
                            onSelectRestaurant={onSelectRestaurant}
                            setTabSwitchAllowed={setTabSwitchAllowed}
                            selectedFloors={selectedFloors}
                            setTarget={setTarget}
                            setOnSelect={setOnSelect}
                            businessNeedLocate={businessNeedLocate}
                        /> : <></>
                }
            </Canvas>
        </View>
    )
}
