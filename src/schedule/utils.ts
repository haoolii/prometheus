import { PosSide, Record, Side } from "./types";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);


export const parseRecord = (record: Record) => {
// 賣出平多	Bit浪浪 以均價 0.2382 USDT 賣出平多 GODSUSDT 永續 5.00x	10月22日 23:58:14
  const orderType = parseOrderType(record.side, record.posSide);
  const uTimeFormat = dayjs.utc(record.uTime).format('YYYY/MM/DD hh:mm:ss');
  const msgTimeFormat = dayjs(dayjs()).diff(record.uTime, 'seconds');
  return `🚨🚨🚨🚨🚨\n<b>${orderType} ${record.lever}x</b>\n均價: ${record.avgPx} ${record.quoteName}\n時間: ${uTimeFormat}\n訊息: ${msgTimeFormat}s`;
};

export const parseOrderType = (side: Side, posSide: PosSide) => {
  if (!(posSide && side)) return "😨😨😨😨";
  return {
    [Side.BUY]: {
      [PosSide.LONG]: "買入開多",
      [PosSide.SHORT]: "買入平空",
    },
    [Side.SELL]: {
      [PosSide.LONG]: "賣出平多",
      [PosSide.SHORT]: "賣出開空",
    },
  }[side][posSide];
};

