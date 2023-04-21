import * as ImagePicker from "expo-image-picker";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";

const cutImg = async (uri) => {
  const { width, height } = await manipulateAsync(uri, []);
  const minDimension = Math.min(width, height);
  const cropSize = minDimension;
  return await manipulateAsync(
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
    { compress: 1, format: SaveFormat.PNG }
  );
};

export const pickImage = async (isAvatar = false) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: isAvatar ? [1, 1] : undefined,
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
