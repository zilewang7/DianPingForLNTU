import React, { useEffect, useRef, useState } from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useFrame, useLoader } from "@react-three/fiber/native"
import { useTheme } from "@rneui/themed";
import { THREE } from "expo-three";

type Position = { x: number, y: number, z: number }


export function HandleModel(
  {
    modalFile,
    camPosition,
    onSelectRestaurant,
    selectedFloors,
    setTabSwitchAllowed,
    smoothLookAt,
  }
    : {
      modalFile: any,
      camPosition: Position,
      onSelectRestaurant: (name: string) => void,
      selectedFloors: number[],
      setTabSwitchAllowed: React.Dispatch<React.SetStateAction<boolean>>
      smoothLookAt: (position: Position) => void,
    }) {
  const { theme } = useTheme();

  const gltf = useLoader(GLTFLoader, modalFile)

  const childrenRefs = useRef<any[]>([]); // 为每个子对象创建一个 ref 数组
  const [childrenState, setChildrenState] = useState(() =>
    gltf.scene.children.map((child) => ({
      name: child.name,
      isSelect: false,
      // position: { x: child.position.x / 10, y: child.position.y / 10, z: child.position.z / 10 }
      position: new THREE.Vector3(child.position.x / 10, child.position.y / 10, child.position.z / 10)
    }))
  );

  // 点击事件处理程序
  const handleItemClick = (index, e) => {
    e.stopPropagation();
    // 创建子对象状态的副本
    const newState = [...childrenState];

    // 将点击的子对象状态更新为已选中，并将其他子对象状态更新为未选中
    newState.forEach((childState, i) => {
      if (i === index) {
        childState.isSelect = true;
        smoothLookAt(childState.position);
      } else {
        childState.isSelect = false;
      }
    });

    // 更新子对象状态
    setChildrenState(newState);

    // 选择时回调
    onSelectRestaurant(newState[index].name);
  }

  useFrame((_state, _delta) => {
    childrenRefs.current.forEach((childRef) => {
      // 使用 lookAt 方法将文字底部朝向摄像机
      childRef?.current?.lookAt(camPosition.x, camPosition.y, camPosition.z);

      // 将文字对象绕X轴旋转90度，使其朝向摄像机的方向
      childRef?.current?.rotateX(Math.PI / 2);
    });
  });

  useEffect(() => {
    if (childrenRefs.current) {
      // childrenRefs加载完成
      setTabSwitchAllowed(true)
    }
  }, [childrenRefs]);

  return (
    <group scale={0.1}>
      {/* 渲染模型的每一部分，并为其添加点击事件处理程序 */}
      {gltf.scene.children.map((child, index) => {
        const text = child.children[0];
        const childRef = useRef<any>(null); // 为每个子对象创建一个独立的 ref
        childrenRefs.current[index] = childRef; // 将 ref 存入 ref 数组中

        const place = child.name.split('-');
        if (selectedFloors.includes(+place[1] - 1)) { // 只展示选中楼层
          return (
            <mesh
              key={child.uuid}
              geometry={child.geometry}
              material={child.material}
              position={child.position}
              onClick={(e) => handleItemClick(index, e)} // 将子对象索引传递给点击事件处理程序
            >
              <meshStandardMaterial
                color={childrenState[index].isSelect ? theme?.colors.primary : 'white'}
                transparent // 透明
                opacity={0.7} // 透明度
              />
              <mesh
                key={text.uuid}
                geometry={text.geometry}
                material={text.material}
                position={text.position}
                ref={childRef} // 使用独立的 ref
                raycast={() => { }}
              />
            </mesh>
          )
        }
      })}
    </group>
  );
}
