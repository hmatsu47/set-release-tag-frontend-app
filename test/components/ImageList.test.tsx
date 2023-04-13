// @vitest-environment jsdom

import { describe, expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { fireEvent, render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { ImageList } from "../../src/components/ImageList";
import { baseUri } from "../../src/api/apiHandler";
import {
  isOpenedConfirm,
  selectedTag,
  setImages,
  setIsOpenedConfirm,
  setSelectedTag,
} from "../../src/signal";
import { ImageItem } from "../../src/type";

describe("<ImageList />", () => {
  beforeEach(() => {
    mockFetch.clearAll();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  // 一覧表示されるケース
  const imageCheckList = [
    {
      title: "Confirm が表示されない（前回選択と同じボタンをクリック）",
      clickTag: "hoge, release",
      attachTag: "release",
      expectedTag: "hoge",
      expectedOpenConfirm: false,
    },
    {
      title: "Confirm が表示される（前回選択と違うボタンをクリック）",
      clickTag: "hoge, release",
      attachTag: "latest",
      expectedTag: "hoge",
      expectedOpenConfirm: true,
    },
  ];
  imageCheckList.forEach((testCase) => {
    test(testCase.title, async () => {
      localStorage.setItem("attachTagName", testCase.attachTag);
      setIsOpenedConfirm(false);
      // まずは一覧非表示の状態
      setSelectedTag(undefined);
      setImages(null);
      const mock = mockGet(`${baseUri}/images`).willResolve();
      const { container, findByText, findByTitle, unmount } = render(() => (
        <ImageList />
      ));
      expect(mock).toHaveFetched();
      // API 呼び出しチェックが終わったら必要項目をセットして確認
      setSelectedTag("hoge");
      setImages([
        {
          digest:
            "sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
          pushed_at: new Date(2022, 8, 12, 14, 45),
          repository_name: "hoge",
          size: 10000,
          tags: ["hoge", "release"],
        } as ImageItem,
        {
          digest:
            "sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
          pushed_at: new Date(2022, 8, 12, 14, 45),
          repository_name: "hoge",
          size: 2000000,
          tags: ["latest"],
        } as ImageItem,
      ]);
      const expectedListedTag = (await findByText(
        testCase.clickTag
      )) as HTMLElement;
      expect(expectedListedTag).toHaveTextContent(testCase.clickTag);
      // css の名前が動的に変わるので固定値に置換
      const htmlBefore = formatSnapshot(container.innerHTML);
      expect(htmlBefore).toMatchSnapshot();
      // ボタンクリック
      const button = (await findByTitle(
        `${testCase.clickTag} を選択`
      )) as HTMLInputElement;
      expect(button).toHaveTextContent("選択");
      fireEvent.click(button);
      expect(isOpenedConfirm()).toBe(testCase.expectedOpenConfirm);
      expect(selectedTag()).toBe(testCase.expectedTag);
      // イメージタグ指定後のスナップショット
      const htmlAfterTagSelect = formatSnapshot(container.innerHTML);
      expect(htmlAfterTagSelect).toMatchSnapshot();
      unmount();
    });
  });
  // 一覧表示されないケース（イメージなし）
  test("一覧未表示（イメージなし）", async () => {
    // すべて無指定
    setIsOpenedConfirm(false);
    setSelectedTag(undefined);
    setImages(null);
    const mock = mockGet(`${baseUri}/images`).willResolve();
    const { container, findByText, unmount } = render(() => <ImageList />);
    expect(mock).toHaveFetched();
    const expected = (await findByText(
      "リポジトリにイメージがありません"
    )) as HTMLElement;
    expect(expected).toHaveTextContent("リポジトリにイメージがありません");
    // css の名前が動的に変わるので固定値に置換
    const html = formatSnapshot(container.innerHTML);
    expect(html).toMatchSnapshot();
    unmount();
  });
});
