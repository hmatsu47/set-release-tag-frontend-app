// @vitest-environment jsdom

import { expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { ImageItem } from "../../src/type";
import { baseUri } from "../../src/api/apiHandler";
import { fetchImages } from "../../src/api/fetchImages";

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
    },
    {
      digest:
        "sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
      pushedAt: new Date(),
      repositoryName: "fuga",
      size: 2000000,
      tags: ["hoge", "fuga", "release"],
    },
  ];
  apiCall.forEach((testCase) => {
    test(`コンテナイメージ一覧の取得 API 呼び出し`, async () => {
      const mock = mockGet(`${baseUri}/images`).willResolve([
        {
          digest: testCase.digest,
          pushed_at: testCase.pushedAt,
          repository_name: testCase.repositoryName,
          size: testCase.size,
          tags: testCase.tags,
        },
      ] as ImageItem[]);
      await fetchImages();
      // とりあえず呼び出しが行われたことだけを確認（戻り値は今のところ上手くテストできず）
      expect(mock).toHaveFetched();
    });
  });
});
