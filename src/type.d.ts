export type ImageItem = {
  digest: string;
  pushed_at: Date;
  repository_name: string;
  size: number;
  tags: string[];
};
export type ImageTag = {
  tag: string;
};
export type ErrorResponse = {
  message: string;
};
