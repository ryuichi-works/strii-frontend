import { useState } from "react";

const useImageFile = () => {
  const [imageFileUrl, setImageFileUrl] = useState<string>('');

  const changeImageFileToLocationUrl = (files: FileList | null) => {
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

  return {
    imageFileUrl,
    setImageFileUrl,
    changeImageFileToLocationUrl,
  }
}

export { useImageFile }
