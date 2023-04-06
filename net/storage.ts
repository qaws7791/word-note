import firebaseApp from "./firebase";
import { getBlob, getDownloadURL, getStorage,ref,uploadBytes } from 'firebase/storage'
import { v4 } from "uuid";

const storage = getStorage(firebaseApp);

export const uploadImage = async(file) => {
  const imageRef = ref(storage, `images/userProfile/${file.name + v4() }`);
  await uploadBytes(imageRef, file);
  const response = await getDownloadURL(imageRef);
  console.log(response)
  return response
}

export const downloadDefaultProfileImage = async()=> {
  return await getBlob(ref(storage, 'images/default-profile.png'))
}