import { describe, expect, test } from "vitest";
import { render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { TitleBar } from "../../src/components/TitleBar";

describe("<TitleBar />", () => {
  const titleBarList = [
    {
      title: "本番環境Postfix",
      environment: "本番環境Postfix",
      expected: "本番環境Postfix・コンテナリリース設定",
    },
    {
      title: "テスト環境Postfix",
      environment: "テスト環境Postfix",
      expected: "テスト環境Postfix・コンテナリリース設定",
    },
  ];
  titleBarList.forEach((testCase) => {
    beforeEach(() => {
      // localStorage はモック化すべきかも（うまくいかなかったため一旦モックなしで実装）
      localStorage.removeItem("environment");
    });
    test(testCase.title, async () => {
      if (testCase.environment) {
        localStorage.setItem("environment", testCase.environment);
      }
      const { container, findByText, unmount } = render(() => <TitleBar />);
      const expected = (await findByText(testCase.expected)) as HTMLElement;
      expect(expected).toHaveTextContent(testCase.expected);
      // css の名前が動的に変わるので固定値に置換
      const html = formatSnapshot(container.innerHTML);
      expect(html).toMatchSnapshot();
      unmount();
    });
  });
  afterEach(() => {
    localStorage.removeItem("environment");
  });
});
