import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { Alert } from "react-native";
import { ImgOssHost } from "./http";
import { getUserToken } from "./user";
import { store } from "../redux/store";
import { getUploadSign, updateAvatarUrl, uploadImage } from "../api/img.api";

const compressImg = async (uri: string, maxSize = 1000) => {
  let preSize: number = Infinity;
  while (true) {
    const fileInfo = (await FileSystem.getInfoAsync(
      uri
    )) as FileSystem.FileInfo & { size: number };
    let action = [];

    if (preSize * 0.9 < fileInfo.size) {
      const { width, height } = await manipulateAsync(uri, []);
      action[0] = {
        resize: {
          height: Math.floor(height * 0.8),
          width: Math.floor(width * 0.8),
        },
      };
    }

    preSize = fileInfo.size;
    if (fileInfo.size / 1000 < maxSize) {
      break;
    }
    const { uri: newUri } = await manipulateAsync(uri, action, {
      compress: 0.5,
      format: SaveFormat.JPEG,
      base64: false,
    });
    uri = newUri;
  }
  return uri;
};

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
      const uri = result.assets[0].uri;
      let newResultUri;
      if (isAvatar) {
        newResultUri = await cutImg(uri);
      } else {
        newResultUri = uri;
      }
      const compressImgUri = await compressImg(newResultUri);
      return compressImgUri;
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
  const token = await getUserToken();
  if (!token) return;

  const sign = await getUploadSign(token);

  if (sign.ok) {
    const { policy, OSSAccessKeyId, signature, userId } = sign.json;

    const fileName = uri.substring(uri.lastIndexOf("/") + 1);
    const key = `dianping/${type}/${userId}/${
      store.getState().user.username
    }/${fileName}`;

    const formData = new FormData();
    formData.append("key", key);
    formData.append("policy", policy);
    formData.append("OSSAccessKeyId", OSSAccessKeyId);
    formData.append("Signature", signature);
    formData.append("Cache-Control", "public");
    formData.append("file", {
      uri: uri,
      type: "image/jpeg",
      name: fileName,
    } as unknown as Blob);

    try {
      const response = await uploadImage(formData);

      if (response.ok) {
        const imgUrl = `http://${ImgOssHost}/${key}`;

        if (type === "Avatar") {
          await updateAvatarUrl(token, imgUrl);
        }

        return imgUrl;
      }
    } catch {
      Alert.alert("上传失败");
    }
  }
};
