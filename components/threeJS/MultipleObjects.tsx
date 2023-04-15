import React, { useRef, useState } from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { LoaderProto, useFrame, useLoader } from "@react-three/fiber/native"
import { TextureLoader } from "expo-three";

type Position = { x: number, y: number, z: number }

export function MultipleObjectsModel({ camPosition }: { camPosition: Position }) {
  useLoader(TextureLoader as LoaderProto<unknown>,
    require('../../assets/texture.jpg'),
  );

  const gltf = useLoader(GLTFLoader, require('../../assets/objects_with_text.glb'))

  const childrenRefs = useRef<any[]>([]); // 为每个子对象创建一个 ref 数组
  const [childrenState, setChildrenState] = useState(() =>
    gltf.scene.children.map(() => ({ isSelect: false }))
  );

  // 点击事件处理程序
  const handleItemClick = (index) => {
    // 创建子对象状态的副本
    const newState = [...childrenState];

    // 将点击的子对象状态更新为已选中，并将其他子对象状态更新为未选中
    newState.forEach((childState, i) => {
      if (i === index) {
        childState.isSelect = true;
      } else {
        childState.isSelect = false;
      }
    });

    // 更新子对象状态
    setChildrenState(newState);
  }

  useFrame((_state, _delta) => {
    childrenRefs.current.forEach((childRef) => {
      // 使用 lookAt 方法将文字底部朝向摄像机
      childRef.current.lookAt(camPosition.x, camPosition.y, camPosition.z);

      // 将文字对象绕X轴旋转90度，使其朝向摄像机的方向
      childRef.current.rotateX(Math.PI / 2);
    });
  });

  return (
    <group scale={0.4}>
      {/* 渲染模型的每一部分，并为其添加点击事件处理程序 */}
      {gltf.scene.children.map((child, index) => {
        const text = child.children[0];
        const childRef = useRef<any>(null); // 为每个子对象创建一个独立的 ref
        childrenRefs.current[index] = childRef; // 将 ref 存入 ref 数组中
        return (
          <mesh
            key={child.uuid}
            geometry={child.geometry}
            material={child.material}
            position={child.position}
            onClick={() => handleItemClick(index)} // 将子对象索引传递给点击事件处理程序
          >
            <meshStandardMaterial
              color={childrenState[index].isSelect ? 'skyblue' : 'white'}
              transparent // 透明
              opacity={0.7} // 透明度
            />
            <mesh
              key={text.uuid}
              geometry={text.geometry}
              material={text.material}
              position={text.position}
              ref={childRef} // 使用独立的 ref
            />
          </mesh>
        )
      })}
    </group>
  );
}
