import { downloadFile } from "../../api/sharedStorageApi";

export const fetchImage = async (imageUrl, i) => {
    if (imageUrl) {
      try {
        const imgBlob = await downloadFile(imageUrl);
        const imgURL = URL.createObjectURL(imgBlob);
        return imgURL
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    }
  };