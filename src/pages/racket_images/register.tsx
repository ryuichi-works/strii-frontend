import type { NextPage } from "next";

import axios from "@/lib/axios";
import Cookies from "js-cookie";
import Cropper, { type Point, Area } from "react-easy-crop";
import getCroppedImg, { CropedImageInfo } from "@/modules/cropImage";

import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

import AuthCheck from "@/components/AuthCheck";
import PrimaryHeading from "@/components/PrimaryHeading";

const GutImageRegister: NextPage = () => {
  const router = useRouter();

  const { isAuth, user, isAuthAdmin } = useContext(AuthContext);

  const [title, setTitle] = useState<string>('');

  const [imageFileUrl, setImageFileUrl] = useState<string>('');

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        if (reader.result) {
          setImageFileUrl(reader.result.toString() || '');
        }
      })
      reader.readAsDataURL(files[0]);
    }
  }

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()
  const [croppedImage, setCroppedImage] = useState<File>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>();

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  };

  const showCroppedImage = async () => {
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

  type Errors = {
    title: string[],
    file: string[]
  }

  const [errors, setErrors] = useState<Errors>({ title: [], file: [] });


  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const uploadGutImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registerData = {
      file: croppedImage,
      title: title,
    }

    await csrf();

    await axios.post('api/racket_images', registerData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
        'Content-Type': 'multipart/form-data;'
      }
    }).then(async (res) => {
      console.log('ラケット画像を登録しました');

      router.push('/racket_images');
    }).catch((e) => {
      console.log(e);
      const newErrors = { title: [], file: [], ...e.response.data.errors };
      setErrors(newErrors);

      console.log('ラケット画像登録に失敗しました。');
    })
  }

  return (
    <>
      <AuthCheck>
        {(isAuth || isAuthAdmin) && (
          <>
            <div className="container mx-auto mb-[48px]">
              <div className="text-center mb-6 md:mb-[48px]">
                <PrimaryHeading text="ラケット画像登録" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              <div>
                <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[380px]">
                  <form action="" onSubmit={uploadGutImage}>
                    <div className="mb-6">
                      <label htmlFor="title" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">画像タイトル</label>
                      <input type="text" name="title" onChange={(e) => setTitle(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                      {errors.title.length !== 0 &&
                        errors.title.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className="flex flex-col mb-6">
                      <label htmlFor="gut_image_file" className="text-[14px] mb-1 md:text-[16px] md:mb-2">画像ファイル</label>
                      <input type="file" name="gut_image_file" accept=".jpg, .jpeg, .png" onChange={onChangeFile} className="h-8" />
                      {errors.file.length !== 0 &&
                        errors.file.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    {/* トリミングエリア */}
                    <div className="mb-6 ">
                      <p>画像トリミング</p>
                      <div className="border-t rounded min-h-[40px] w-[100%] max-w-[320px] md:max-w-[380px]">

                        {imageFileUrl && (
                          <>
                            <div className="h-[300px] relative mb-8">
                              <Cropper
                                image={imageFileUrl}
                                crop={crop}
                                rotation={rotation}
                                zoom={zoom}
                                aspect={3 / 4}
                                onCropChange={setCrop}
                                onRotationChange={setRotation}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                              />
                            </div>

                            <div className="flex justify-start w-[100%] max-w-[288px] mx-auto mb-8">
                              <span className="inline-block h-[16px] text-[14px] text-center w-[100%] max-w-[68px] md:text-[16px] md:h-[18px] leading-[18px]">ズーム：</span>
                              <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => {
                                  setZoom(Number(e.target.value))
                                }}
                                className="inline-block h-[16px] w-[100%] max-w-[220px] md:h-[18px]"
                              />
                            </div>

                            <div className="flex justify-center mt-6 mb-[40px]">

                              <span className="inline-block h-[16px] text-[14px] text-center w-[100%] max-w-[68px] md:text-[16px] md:h-[18px] leading-[18px]" >回転：</span>
                              <input
                                type="range"
                                value={rotation}
                                min={0}
                                max={360}
                                step={0.5}
                                aria-labelledby="Rotation"
                                onChange={(e) => {
                                  setRotation(Number(e.target.value))
                                }}
                                className="inline-block h-[16px] w-[100%] max-w-[220px] md:h-[18px]"
                              />
                            </div>

                            <div className="flex justify-end">
                              <p onClick={showCroppedImage} className="inline-block border  hover:cursor-pointer hover:opacity-60 font-semibold text-white text-[14px] w-[192px] h-8 rounded  bg-sub-green text-center leading-[32px] md:text-[16px]">トリミングを完了</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="md:flex justify-between items-start md:w-[100%] md:max-w-[380px] ">
                      {/* プレビュー */}
                      <div className="mb-[64px] md:mb-0">
                        {croppedImageUrl && (
                          <>
                            <p className="text-[14px] mb-1 md:text-[16px] md:mb-2">プレビュー</p>
                            <img src={croppedImageUrl} alt="" className="w-[100%] max-w-[160px] md:max-w-[180px]" />
                          </>
                        )}
                      </div>


                      <div className="flex justify-center md:mt-[32px]">
                        {croppedImage && (
                          <>
                            <div>
                              <button type="submit" className="text-white text-[14px] w-[200px] h-8 rounded  bg-sub-green md:w-[150px] md:text-[16px] md:block md:ml-auto">画像を追加する</button>
                              {errors.title.length !== 0 &&
                                errors.title.map((message, i) => <p key={i} className="text-red-400 mt-2">{message}</p>)
                              }
                              {errors.file.length !== 0 &&
                                errors.file.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                              }
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </AuthCheck >
    </>
  );
}

export default GutImageRegister;
