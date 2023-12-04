import AuthCheck from "@/components/AuthCheck";
import { AuthContext } from "@/context/AuthContext";
import { NextPage } from "next";
import { useContext, useState } from "react";
// import ModalSpSize from "@/components/ModalSpSize";
import CloseIcon from "@/components/CloseIcon";
import axios from "@/lib/axios";

const GutImageRegister: NextPage = () => {
  const { isAuth, user } = useContext(AuthContext);

  const [imageFile, setImageFile] = useState<File | null>();
  console.log('imageFile', imageFile);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setImageFile(files[0])
    }
    console.log(imageFile);
  }

  const csrf = async () => await axios.get('/sanctum/csrf-cookie');
  

  // const [showingModal, setShowingModal] = useState<boolean>(false);

  // const toggleModal = () => {
  //   setShowingModal(prev => !prev);
  // }
  
  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            <h1>ストリング画像登録</h1>

            <div className="container mx-auto">


              <div>
                <form action="">
                  {/* <label htmlFor="gut_image_file"></label>
                  <input type="file" name="gut_image" id="gut_image" onChange={} /> */}

                  <div className="flex flex-col mb-6">
                      <label htmlFor="gut_image_file">ストリング画像ファイル</label>
                      <input type="file" name="gut_image_file" accept=".jpg, .jpeg, .png" onChange={onChangeFile} className="h-8" />
                      {/* {errors.file.length !== 0 &&
                        errors.file.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                    </div>
                </form>
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
      </AuthCheck>
    </>
  );
}

export default GutImageRegister;
