import useControls from "r3f-native-orbitcontrols"

import { Canvas, LoaderProto, useFrame, useLoader } from "@react-three/fiber/native"
import { View } from "react-native"
import { TextureLoader, THREE } from "expo-three";
import React, { useLayoutEffect, useRef } from "react";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { MultipleObjectsModel } from "./MultipleObjects";

import { Preload } from '@react-three/drei/native'

function Box(props) {

    const mesh = useRef<any>();

    useFrame((state, delta) => {
        mesh.current.rotation.y += delta * 2;
    });


    return (
        <mesh {...props} ref={mesh}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
    );
}

function Something(props) {

    const mesh = useRef<any>();

    useFrame((state, delta) => {
        mesh.current.rotation.z += delta;
        mesh.current.rotation.y -= delta;
    });

    return (
        <mesh {...props} ref={mesh}>
            <torusKnotGeometry args={[10, 1, 150, 10, 6, 13]} />
            <meshStandardMaterial color="blue" />
        </mesh>
    );
}

function MyRoom(props) {
    const material = useLoader(MTLLoader, require('../../assets/Untitled_Scan_18_20_11/textured_output.mtl'));

    const base = useLoader(TextureLoader as LoaderProto<unknown>,
        require('../../assets/Untitled_Scan_18_20_11/textured_output.jpg'),
    );

    const obj = useLoader(
        OBJLoader,
        require('../../assets/Untitled_Scan_18_20_11/textured_output.obj'),
        async (loader) => {
            await material.preload();
            loader.setMaterials(material);
        }
    );

    useLayoutEffect(() => {
        obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.map = base;
            }
        });
    }, [obj]);

    return (
        <mesh {...props} scale={0.4}>
            <primitive object={obj} />
        </mesh>
    );
}

export function MyDormitory() {
    const [OrbitControls, events] = useControls()


    return (
        <View {...events} style={{ flex: 1 }}>
            <Canvas>
                <OrbitControls onChange={(event) => {
                    console.log(event.target.camera.position);
                }} />
                <ambientLight intensity={0.8} />
                <pointLight position={[-10, 10, 5]} />
                {/* <MyRoom /> */}
                {/* <MultipleObjectsModel /> */}
                {/* <Preload /> */}
            </Canvas>
        </View>

    )
}
