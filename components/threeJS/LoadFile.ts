import { resolveAsync } from "expo-asset-utils";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { GLTFLoader } from "three-stdlib";

async function loadFileAsync({ asset, funcName }) {
  if (!asset)
    throw new Error(`ExpoTHREE.${funcName}: Cannot parse a null asset`);
  return (await resolveAsync(asset)).localUri ?? null;
}

export async function loadGLTFAsync({ asset, onAssetRequested }) {
  const uri = await loadFileAsync({
    asset,
    funcName: "loadGLTFAsync",
  });

  if (!uri) return;

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const arrayBuffer = decode(base64);
  const loader = new GLTFLoader();

  return new Promise<GLTF>((resolve, reject) => {
    loader.parse(
      arrayBuffer,
      onAssetRequested,
      (result) => {
        resolve(result);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

export const loadFile = (file) => {
  return loadGLTFAsync({
    asset: file,
    onAssetRequested: (...args) => console.log(args),
  }).catch((...args) => console.error("LoadFileError" + JSON.stringify(args)));
};
