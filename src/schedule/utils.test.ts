import { parseOrderType } from "./utils";
import { Side, PosSide } from "./types";
test("測試類型判斷", () => {
  expect(parseOrderType(Side.BUY, PosSide.LONG)).toBe('買入開多');
  expect(parseOrderType(Side.BUY, PosSide.SHORT)).toBe('買入平空');
  expect(parseOrderType(Side.SELL, PosSide.LONG)).toBe('賣出平多');
  expect(parseOrderType(Side.SELL, PosSide.SHORT)).toBe('賣出開空');
});
