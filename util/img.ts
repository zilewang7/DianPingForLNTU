import * as ImagePicker from "expo-image-picker";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { getAPI, postAPI } from "./http";

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
    { format: SaveFormat.PNG }
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

    if (!result.canceled && isAvatar) {
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

export const uploadImg = async (uri, type = "unclassifi") => {
  const sign = await getAPI("/oos/uploadSgin");

  if (sign.ok) {
    const { policy, OSSAccessKeyId, signature } = sign.json;

    // const result = await postAPI("http://img.heimao.icu", {
    //   OSSAccessKeyId: OSSAccessKeyId,
    //   key: `dianping/${type}`,
    //   policy: policy,
    //   success_action_status: "200", // 如果不设置success_action_status为200，则文件上传成功后返回204状态码。
    //   signature: signature,
    // });

    // return result;

    const formData = new FormData();
    formData.append("key", `dianping/${type}`);
    formData.append("policy", policy);
    formData.append("OSSAccessKeyId", OSSAccessKeyId);
    formData.append("signature", signature);
    formData.append("file", uri);

    fetch("http://img.heimao.icu", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        // 处理上传成功的响应
        console.log("上传成功", response);
      })
      .catch((error) => {
        // 处理上传失败的错误
        console.log("上传失败", error);
      });
  }
};
