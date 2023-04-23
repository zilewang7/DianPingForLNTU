import * as ImagePicker from "expo-image-picker";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { getAPI, postAPI } from "./http";
import { Alert } from "react-native";

const cutImg = async (uri) => {
  const { width, height } = await manipulateAsync(uri, []);
  if (width === height) {
    return uri;
  }
  const minDimension = Math.min(width, height);
  const cropSize = minDimension;
  const result = await manipulateAsync(
    uri,
    [
      {
        crop: {
          originX: (width - cropSize) / 2, // 水平居中
          originY: (height - cropSize) / 2, // 垂直居中
          width: cropSize,
          height: cropSize,
        },
      },
    ],
    { format: SaveFormat.JPEG }
  );
  return result.uri;
};

export const pickImage = async (isAvatar = false) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: isAvatar ? [1, 1] : undefined,
      quality: 0.7,
    });

    if (!result.canceled) {
      if (isAvatar) {
        const newResult = await cutImg(result.assets[0].uri);
        return newResult;
      }
      return result;
    }
  } catch (err) {
    console.error("Error picking an image", err);
  }
};

export const saveImg = async (imageUri) => {
  if (imageUri) {
    await MediaLibrary.requestPermissionsAsync();

    const asset = await MediaLibrary.createAssetAsync(imageUri);
    await MediaLibrary.createAlbumAsync("工大点评", asset, false);
    alert("图片已保存到相册！");
  }
};

export const uploadImg = async (uri, type = "unclassified") => {
  const sign = await getAPI("/oos/uploadSgin");

  if (sign.ok) {
    const { policy, OSSAccessKeyId, signature } = sign.json;

    const fileName = uri.substring(uri.lastIndexOf("/") + 1);

    const formData = new FormData();
    formData.append("key", `dianping/${type}/${fileName}`);
    formData.append("policy", policy);
    formData.append("OSSAccessKeyId", OSSAccessKeyId);
    formData.append("Signature", signature);
    formData.append("Cache-Control", 'public');
    formData.append("file", {
      uri: uri,
      type: "image/jpeg",
      name: fileName,
    } as unknown as Blob);

    try {
      const response = await fetch("http://img.heimao.icu", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        return `http://img.heimao.icu/dianping/${type}/${fileName}`;
      }
    } catch {
      Alert.alert("上传失败");
    }
  }
};
