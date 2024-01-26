// 使用法：
// 基本的にImageCropAreaコンポーネント一緒に使用する
// 使用先にて、このカスタムフックの各exportしている値、メソッドと
// 使用先でinput:fileより取得変換したimageFileUrlを使って利用する

import getCroppedImg, { CropedImageInfo } from "@/modules/cropImage";
import { useState } from "react";
import { Area, Point } from "react-easy-crop";

const useImageCrop = () => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()
  const [croppedImage, setCroppedImage] = useState<File>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>();

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  };

  const showCroppedImage = async (imageFileUrl: string) => {
    try {
      const cropedImageInfo: CropedImageInfo = await getCroppedImg(
        imageFileUrl,
        croppedAreaPixels as Area,
        rotation
      ) as CropedImageInfo

      const croppedImage = cropedImageInfo.file;

      const croppedImageUrl = cropedImageInfo.url

      setCroppedImage(croppedImage);

      setCroppedImageUrl(croppedImageUrl);
    } catch (e) {
      console.error(e)
    }
  }

  const onClose = () => {
    setCroppedImage(undefined);
  }

  return {
    crop,
    setCrop,

    rotation,
    setRotation,

    zoom,
    setZoom,

    croppedAreaPixels,
    setCroppedAreaPixels,

    croppedImage,
    setCroppedImage,

    croppedImageUrl,
    setCroppedImageUrl,

    onCropComplete,
    showCroppedImage,
    onClose
  }
}

export {useImageCrop};
