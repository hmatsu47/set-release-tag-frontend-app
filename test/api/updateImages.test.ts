// @vitest-environment jsdom

import { expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockPost } from "vi-fetch";
import { ImageItem, ImageTag } from "../../src/type";
import { baseUri } from "../../src/api/apiHandler";
import { updateImages } from "../../src/api/updateImages";
import { setSelectedTag } from "../../src/signal";

describe("fetchImages", () => {
  beforeEach(() => {
    mockFetch.clearAll();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  const apiCall = [
    {
      digest:
        "sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
      pushedAt: new Date(),
      repositoryName: "hoge",
      size: 10000,
      tags: ["latest", "release"],
      attachTag: "release",
    },
    {
      digest:
        "sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
      pushedAt: new Date(),
      repositoryName: "fuga",
      size: 2000000,
      tags: ["hoge", "fuga", "release"],
      attachTag: "release",
    },
  ];
  apiCall.forEach((testCase) => {
    test(`リリースタグセット API 呼び出し`, async () => {
      setSelectedTag(testCase.attachTag);
      const mock = mockPost(`${baseUri}/images`).willResolve([
        {
          digest: testCase.digest,
          pushed_at: testCase.pushedAt,
          repository_name: testCase.repositoryName,
          size: testCase.size,
          tags: testCase.tags,
        },
      ] as ImageItem[]);
      await updateImages();
      // とりあえず呼び出しが行われたことだけを確認（戻り値は今のところ上手くテストできず）
      expect(mock).toHaveFetched();
      expect(mock).toHaveFetchedWithBody(
        JSON.stringify({
          tag: testCase.attachTag,
        } as ImageTag)
      );
    });
  });
});
