import { ErrorResponse, ImageItem, ImageTag } from "../type";
import { baseUri, postApiData } from "./apiHandler";
import {
  selectedTag,
  setImages,
  setMessage,
  setMessageSeverity,
  setSelectedTag,
} from "../signal";

export const updateImages = async () => {
  if (!selectedTag()) {
    return;
  }
  const load = async (): Promise<void> => {
    const data: ImageItem[] | ErrorResponse = await postApiData(
      `${baseUri}/images`,
      {
        tag: selectedTag(),
      } as ImageTag
    );
    if (
      typeof data === "object" &&
      data !== null &&
      typeof (data as ErrorResponse).message === "string"
    ) {
      // 戻り値がエラーメッセージの場合
      setImages(undefined);
      setMessage((data as ErrorResponse).message);
      setMessageSeverity("error");
      return;
    }
    setImages(data as ImageItem[]);
    setSelectedTag(undefined);
    setMessage(undefined);
  };
  void load();
};
