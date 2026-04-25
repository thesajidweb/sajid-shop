"use server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export const deleteImage = async (fileId: string) => {
  return imagekit.deleteFile(fileId);
};
export const deleteMultipleImage = async (fileIds: string[]) => {
  return imagekit.bulkDeleteFiles(fileIds);
};
