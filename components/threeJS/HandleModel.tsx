import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber/native"
import { useTheme } from "@rneui/themed";
import { THREE } from "expo-three";
import { useSelector } from "../../redux/hook";

type Position = { x: number, y: number, z: number }


export function HandleModel(
  {
    scene,
    camPosition,
    onSelectRestaurant,
    selectedFloors,
    setTabSwitchAllowed,
    setTarget,
    setOnSelect,
    businessNeedLocate,
  }
    : {
      scene: any,
      camPosition: Position,
      onSelectRestaurant: (name: string) => void,
      selectedFloors: ("1" | "1.5" | "2")[],
      setTabSwitchAllowed: React.Dispatch<React.SetStateAction<boolean>>
      setTarget: React.Dispatch<any>,
      setOnSelect: React.Dispatch<React.SetStateAction<boolean>>,
      businessNeedLocate: string,
    }) {
  const { theme } = useTheme();
  const businessList = useSelector(state => state.business.businessList)
  const businessMap = useMemo(() => {
    const map = {};
    businessList.forEach(business => {
      map[business.address] = business;
    });
    return map;
  }, [businessList])

  const childrenRefs = useRef<any[]>([]); // 为每个子对象创建一个 ref 数组
  const [childrenState, setChildrenState] = useState(() =>
    scene.children.map((child) => ({
      name: child.name,
      isSelect: false,
      position: { x: child.position.x / 10, y: child.position.y / 10, z: child.position.z / 10 },
      info: businessMap[child.name]
    }))
  );
  const [newTarget, setNewTarget] = useState({ x: 0, y: 0, z: 0 });

  // 点击事件处理程序
  const handleItemClick = (index, e) => {
    e.stopPropagation();
    // 创建子对象状态的副本
    const newState = [...childrenState];

    // 将点击的子对象状态更新为已选中，并将其他子对象状态更新为未选中
    newState.forEach((childState, i) => {
      if (i === index) {
        childState.isSelect = true;
        setNewTarget(childState.position);
        setOnSelect(true);
      } else {
        childState.isSelect = false;
      }
    });

    // 更新子对象状态
    setChildrenState(newState);

    // 选择时回调
    onSelectRestaurant(newState[index].info);
  }

  useFrame((_state, delta) => {
    childrenRefs.current.forEach((childRef) => {
      // 使用 lookAt 方法将文字底部朝向摄像机
      childRef?.current?.lookAt(camPosition.x, camPosition.y, camPosition.z);

      // 将文字对象绕X轴旋转90度，使其朝向摄像机的方向
      childRef?.current?.rotateX(Math.PI / 2);
    });

    // 调整视角到选中餐馆
    setTarget((target) => {
      if (target.x !== newTarget.x
        || target.y !== newTarget.y
        || target.z !== newTarget.z) {
        const x = newTarget.x - target.x;
        const y = newTarget.y - target.y;
        const z = newTarget.z - target.z;

        const absX = Math.abs(x);
        const absY = Math.abs(y);
        const absZ = Math.abs(z);

        if (absX > 0.001 || absY > 0.001 || absZ > 0.001) {
          if (absX < 0.05 && absY < 0.05 && absZ < 0.05) {
            setTimeout(() => {
              setOnSelect(false)
            })
          }
          return new THREE.Vector3(
            target.x + x * delta * 2,
            target.y + y * delta * 2,
            target.z + z * delta * 2,
          )
        } else {
          return new THREE.Vector3(newTarget.x, newTarget.y, newTarget.z);
        }
      }

      return target;
    })
  });

  useEffect(() => {
    if (childrenRefs.current) {
      // childrenRefs加载完成
      setTabSwitchAllowed(true)
    }
  }, [childrenRefs]);

  useEffect(() => {
    if (businessNeedLocate) {
      const newState = [...childrenState];

      newState.forEach((childState) => {
        if (childState.name === businessNeedLocate) {
          childState.isSelect = true;
          setNewTarget(childState.position);
          setOnSelect(true);
        } else {
          childState.isSelect = false;
        }
      });
    }
  }, [businessNeedLocate])

  return (
    <group scale={0.1}>
      {/* 渲染模型的每一部分，并为其添加点击事件处理程序 */}
      {scene.children.map((child, index) => {
        const text = child.children[0];
        const childRef = useRef<any>(null); // 为每个子对象创建一个独立的 ref
        childrenRefs.current[index] = childRef; // 将 ref 存入 ref 数组中

        const place = child.name.split('-');
        if (selectedFloors.includes(place[1])) { // 只展示选中楼层
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
