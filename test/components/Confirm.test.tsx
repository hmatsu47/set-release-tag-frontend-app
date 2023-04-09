// @vitest-environment jsdom

import { describe, expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockPost } from "vi-fetch";
import { fireEvent, render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { Confirm } from "../../src/components/Confirm";
import { baseUri } from "../../src/api/apiHandler";
import {
  isOpenedConfirm,
  setIsOpenedConfirm,
  setSelectedTag,
} from "../../src/signal";
import { ImageTag } from "../../src/type";

describe("<Confirm />", () => {
  const confirmList = [
    {
      title: "images の API コールが行われる（「はい」ボタンクリック）",
      digest:
        "sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
      pushedAt: new Date(),
      repositoryName: "hoge",
      size: 10000,
      tags: ["latest", "release"],
      attachTag: "release",
      buttonYes: true,
      testFetch: true,
    },
    {
      title: "images の API コールが行われない（「いいえ」ボタンクリック）",
      digest:
        "sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
      pushedAt: new Date(),
      repositoryName: "fuga",
      size: 2000000,
      tags: ["hoge", "fuga", "release"],
      attachTag: "release",
      buttonYes: false,
      testFetch: false,
    },
  ];
  beforeEach(() => {
    mockFetch.clearAll();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  confirmList.forEach((testCase) => {
    test(testCase.title, async () => {
      setSelectedTag(testCase.attachTag);
      setIsOpenedConfirm(true);
      const mock = mockPost(`${baseUri}/images`)
        .withHeaders([["Content-Type", "application/json;charset=utf8"]])
        .willResolve({ tag: testCase.attachTag } as ImageTag);
      const { findByTitle, unmount } = render(() => <Confirm />);
      // はいボタン
      const buttonYes = (await findByTitle("はい")) as HTMLInputElement;
      expect(buttonYes).toHaveTextContent("はい");
      // いいえボタン
      const buttonNo = (await findByTitle("いいえ")) as HTMLInputElement;
      expect(buttonNo).toHaveTextContent("いいえ");
      const modal = (await findByTitle("modal")) as HTMLElement;
      // css の名前が動的に変わるので固定値に置換
      const htmlModal = formatSnapshot(modal.innerHTML);
      expect(htmlModal).toMatchSnapshot();
      // ボタンクリック
      fireEvent.click(testCase.buttonYes ? buttonYes : buttonNo);
      // API 呼び出しチェック
      if (testCase.testFetch) {
        // とりあえず呼び出しが行われたことだけを確認
        expect(mock).toHaveFetched();
        expect(mock).toHaveFetchedWithBody(
          JSON.stringify({ tag: testCase.attachTag } as ImageTag)
        );
      }
      // モーダルクローズ
      expect(isOpenedConfirm()).toBe(false);
      unmount();
    });
  });
});
