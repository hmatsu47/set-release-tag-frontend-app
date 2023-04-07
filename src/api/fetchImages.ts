import { ErrorResponse, ImageItem } from "../type";
import { baseUri, getApiData } from "./apiHandler";
import { setImages, setMessage, setMessageSeverity } from "../signal";

export const fetchImages = async () => {
  const load = async (): Promise<void> => {
    const data: ImageItem[] | ErrorResponse = await getApiData(
      `${baseUri}/images`
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
    setMessage(undefined);
  };
  void load();
};
