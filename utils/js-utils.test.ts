import { round } from "react-native-reanimated";
import { textInputMask2Decimal } from "./js-utils";

const fn = textInputMask2Decimal;
describe("textInputMask2Decimal", () => {
  test("main", () => {
    expect(fn("123")).toBe("123");
    expect(fn("123.00")).toBe("123.00");
    expect(fn("123.00.")).toBe("123.00");
    expect(fn("123.6777")).toBe("123.67");
    expect(fn(".4")).toBe("0.4");
    expect(fn("1.1")).toBe("1.1");

    expect(fn("123.00A")).toBe("123.00");

    expect(fn(Math.round(0.29 * 100).toString())).toBe("29");
  });
});
