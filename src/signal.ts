import { createSignal } from "solid-js";
import { AlertColor } from "@suid/material/Alert";

import { ImageItem } from "./type";

export const [images, setImages] = createSignal<
  ImageItem[] | null | undefined
>();
export const [selectedTag, setSelectedTag] = createSignal<string | undefined>();
export const [message, setMessage] = createSignal<string | undefined>();
export const [messageSeverity, setMessageSeverity] = createSignal<
  AlertColor | undefined
>();
export const [isOpenedConfirm, setIsOpenedConfirm] =
  createSignal<boolean>(false);
