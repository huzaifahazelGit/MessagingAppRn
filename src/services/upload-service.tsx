import {
  StorageReference,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

export const getExtension = (uri: string): string => {
  if (uri) {
    let split = uri.split(".");
    if (split.length > 0) {
      return split[split.length - 1];
    }
  }
  return "";
};

export const getBlob = async (uri: string): Promise<Blob> => {
  const blob: Blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {};
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  return blob;
};

export const getRefForStorage = (storage, uri, prefix): StorageReference => {
  const filename = `${Math.floor(Math.random() * 10000000 + 1)}.${getExtension(
    uri
  )}`;

  const uploadRef = ref(storage, `${prefix}/${filename}`);

  return uploadRef;
};

export const uploadFileAsync = async (storage, uri, prefix) => {
  try {
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {};
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const filename = `${Math.floor(
      Math.random() * 10000000 + 1
    )}.${getExtension(uri)}`;

    const uploadRef = ref(storage, `${prefix}/${filename}`);

    await uploadBytesResumable(uploadRef, blob);
    // @ts-ignore
    blob.close();

    const url = await getDownloadURL(uploadRef);

    return url;
  } catch (err) {
    console.log("upload err", err);
  }
};
