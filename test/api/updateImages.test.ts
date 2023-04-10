// @vitest-environment jsdom

import { expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockPost } from "vi-fetch";
import { baseUri } from "../../src/api/apiHandler";
import { updateImages } from "../../src/api/updateImages";
import { setSelectedTag } from "../../src/signal";
import { ImageItem, ImageTag } from "../../src/type";

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
      tags: ["latest", "hoge"],
      attachTag: "release",
      selectedTag: "latest",
    },
    {
      digest:
        "sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
      pushedAt: new Date(),
      repositoryName: "fuga",
      size: 2000000,
      tags: ["hoge", "fuga", "release"],
      attachTag: "latest",
      selectedTag: "hoge",
    },
  ];
  apiCall.forEach((testCase) => {
    test(`リリースタグセット API 呼び出し`, async () => {
      localStorage.setItem("attachTagName", testCase.attachTag);
      setSelectedTag(testCase.selectedTag);
      const mock = mockPost(`${baseUri}/images`)
        .withHeaders([["Content-Type", "application/json;charset=utf8"]])
        .willResolve([
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
          tag: testCase.selectedTag,
        } as ImageTag)
      );
    });
  });
});
