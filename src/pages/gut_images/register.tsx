import AuthCheck from "@/components/AuthCheck";
import { AuthContext } from "@/context/AuthContext";
import { NextPage } from "next";
import { useContext, useState } from "react";
// import ModalSpSize from "@/components/ModalSpSize";
import CloseIcon from "@/components/CloseIcon";
import axios from "@/lib/axios";
import Cookies from "js-cookie";

import Cropper, { type Point, Area } from "react-easy-crop";
import getCroppedImg, { CropedImageInfo } from "@/modules/cropImage";
import { useRouter } from "next/router";
import PrimaryHeading from "@/components/PrimaryHeading";

const GutImageRegister: NextPage = () => {
  const router = useRouter();

  const { isAuth, user } = useContext(AuthContext);

  const [title, setTitle] = useState<string>('');
  console.log('title', title);

  const [imageFileUrl, setImageFileUrl] = useState<string>('');
  console.log(imageFileUrl);

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
  console.log('state cropppedImage', croppedImage);
  console.log('croppedImageUrl', croppedImageUrl);


  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    // console.log(croppedArea, croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels)
  };

  const showCroppedImage = async () => {
    try {
      // const croppedImage: File = await getCroppedImg(
      const cropedImageInfo: CropedImageInfo = await getCroppedImg(
        imageFileUrl,
        croppedAreaPixels as Area,
        rotation
      ) as CropedImageInfo

      const croppedImage = cropedImageInfo.file;

      const croppedImageUrl = cropedImageInfo.url

      console.log('型', typeof (croppedImage), croppedImage);

      setCroppedImage(croppedImage);

      setCroppedImageUrl(croppedImageUrl);

      // const croppedImage: File = await getCroppedImg(
      //   imageFileUrl,
      //   croppedAreaPixels as Area,
      //   rotation
      // ) as File

      // console.log('型', typeof (croppedImage), croppedImage);
      // setCroppedImage(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }

  const onClose = () => {
    setCroppedImage(undefined);
  }


  // const [showingModal, setShowingModal] = useState<boolean>(false);

  // const toggleModal = () => {
  //   setShowingModal(prev => !prev);
  // }

  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const uploadGutImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registerData = {
      file: croppedImage,
      title: title,
    }

    await csrf();

    await axios.post('api/gut_images', registerData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
        'Content-Type': 'multipart/form-data;'
      }
    }).then(async (res) => {
      setCroppedImage(undefined);
      setCrop({ x: 0, y: 0 });
      setRotation(0);
      setZoom(1);
      setCroppedAreaPixels(undefined);
      setTitle('');
      console.log('ストリング画像を登録しました');
    }).catch((e) => {
      console.log(e);
      // const newErrors = {name: [], email: [], password: [], file: [], ...e.response.data.errors };
      // setErrors(newErrors);

      console.log('基本プロフィール更新に失敗しました。');
    })
  }

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            {/* <h1>ストリング画像登録</h1> */}

            <div className="container mx-auto mb-[48px]">
              <div className="text-center mb-6">
                <PrimaryHeading text="ストリング画像登録" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              <div>
                <div className="w-[100%] max-w-[320px] mx-auto">
                  <form action="" onSubmit={uploadGutImage}>
                    <div className="mb-6">
                      <label htmlFor="title" className="block">画像タイトル</label>
                      <input type="text" name="title" onChange={(e) => setTitle(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                      {/* {errors.name.length !== 0 &&
                        errors.name.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                    </div>

                    <div className="flex flex-col mb-6">
                      <label htmlFor="gut_image_file">画像ファイル</label>
                      <input type="file" name="gut_image_file" accept=".jpg, .jpeg, .png" onChange={onChangeFile} className="h-8" />
                      {/* {errors.file.length !== 0 &&
                        errors.file.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                    </div>

                    {/* トリミングエリア */}
                    <div className="mb-6 ">
                      <p>画像トリミング</p>
                      <div className="border-t rounded min-h-[40px]">

                        {imageFileUrl && (
                          <>
                            <div className="h-[300px] relative mb-8">
                              <Cropper
                                image={imageFileUrl}
                                crop={crop}
                                rotation={rotation}
                                zoom={zoom}
                                aspect={1 / 1}
                                onCropChange={setCrop}
                                onRotationChange={setRotation}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                              />
                            </div>

                            <div className="flex justify-start w-[100%] max-w-[288px] mx-auto mb-8">
                              <span className="inline-block h-[16px] text-[14px] text-center w-[100%] max-w-[68px]">ズーム：</span>
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
                                className="inline-block h-[16px] w-[100%] max-w-[220px]"
                              />
                            </div>

                            <div className="flex justify-center mt-6 mb-[40px]">

                              <span className="inline-block h-[16px] text-[14px] text-center w-[100%] max-w-[68px]" >回転：</span>
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
                                className="inline-block h-[16px] w-[100%] max-w-[220px]"
                              />
                            </div>

                            <div className="flex justify-end">
                              <p onClick={showCroppedImage} className="inline-block border  hover:cursor-pointer hover:opacity-60 font-semibold text-white text-[14px] w-[192px] h-8 rounded  bg-sub-green text-center leading-[32px]">トリミングを完了</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mb-[64px]">
                      {croppedImageUrl && (
                        <>
                          <p className="text-[14px] mb-1">プレビュー</p>
                          <img src={croppedImageUrl} alt="" className="w-[100%] max-w-[160px]" />
                        </>

                      )}
                    </div>


                    <div className="flex justify-center ">
                      {croppedImage &&
                        <button type="submit" className="text-white text-[14px] w-[200px] h-8 rounded  bg-sub-green">画像を追加する</button>
                      }
                    </div>

                  </form>
                </div>
              </div>

              {/* //モーダル */}
              {/* <div className="h-screen bg-sub-gray bg-opacity-30">
                <div className="pt-6">
                  <div className="flex justify-end w-[100%] max-w-[320px] mx-auto">
                    <span className="inline-block" onClick={toggleModal}>
                      <CloseIcon size={32} />
                    </span>
                  </div>
                </div>
              </div> */}

            </div>

          </>
        )}
      </AuthCheck >
    </>
  );
}

export default GutImageRegister;
