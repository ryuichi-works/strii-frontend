import React from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import InputRange from "./inputRange";

type Props = {
  imageFileUrl: string,
  crop: Point,
  rotation: number,
  zoom: number,
  aspect: number,
  setCrop: React.Dispatch<React.SetStateAction<Point>>,
  setRotation:React.Dispatch<React.SetStateAction<number>>,
  setZoom: React.Dispatch<React.SetStateAction<number>>,
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void,
  showCroppedImage: (imageFileUrl: string) => Promise<void>,
  zoomMin: number,
  zoomMax: number,
  zoomStep: number,
  rotationMin: number,
  rotationMax: number,
  rotationStep: number,
  clopperClassName?: string,
  // inputZoomClassName?: string,
  // inputRotationClassName?: string,
}

const ImageCropArea: React.FC<Props> = ({
  imageFileUrl,
  crop,
  rotation,
  zoom,
  aspect,
  setCrop,
  setRotation,
  setZoom,
  onCropComplete,
  showCroppedImage,
  zoomMin,
  zoomMax,
  zoomStep,
  rotationMin,
  rotationMax,
  rotationStep,
  clopperClassName = 'h-[300px]  mb-8',
  // inputZoomClassName = 'h-[16px] w-[100%] max-w-[220px] md:h-[18px]',
  // inputRotationClassName = 'h-[16px] w-[100%] max-w-[220px] md:h-[18px]',
}) => {
  return (
    <>
      <div className={`!relative ${clopperClassName}`}>
        <Cropper
          image={imageFileUrl}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      <div className="flex justify-start w-[100%] mx-auto mb-8">
        <span className="inline-block h-[16px] text-[14px] text-center w-[100%] max-w-[68px] md:text-[16px] md:h-[18px] leading-[18px]">ズーム：</span>
        <InputRange
          min={zoomMin}
          max={zoomMax}
          step={zoomStep}
          value={zoom}
          chengeHandler={(e) => setZoom(Number(e.target.value))}
        />
      </div>

      <div className="flex justify-center mt-6 mb-[40px]">

        <span className="inline-block h-[16px] text-[14px] text-center w-[100%] max-w-[68px] md:text-[16px] md:h-[18px] leading-[18px]" >回転：</span>
        <InputRange
          min={rotationMin}
          max={rotationMax}
          step={rotationStep}
          value={rotation}
          chengeHandler={(e) =>  setRotation(Number(e.target.value))}
        />
      </div>

      <div className="flex justify-end">
        <p onClick={() => showCroppedImage(imageFileUrl)} className="inline-block border  hover:cursor-pointer hover:opacity-60 font-semibold text-white text-[14px] w-[192px] h-8 rounded  bg-sub-green text-center leading-[32px] md:text-[16px]">トリミングを完了</p>
      </div>
    </>
  );
}

export default ImageCropArea;
