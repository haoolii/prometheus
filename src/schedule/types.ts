export interface Record {
  alias: string;
  avgPx: string;
  baseName: string;
  cTime: string;
  fillTime: string;
  instFamily: string;
  instId: string;
  instType: string;
  lever: string;
  nickName: string;
  ordId: string;
  ordType: string;
  posSide: PosSide;
  px: string;
  quoteName: string;
  side: Side;
  uTime: string;
  uly: string;
  uniqueName: string;
}


export enum PosSide {
  LONG = 'long',
  SHORT = 'short'
}

export enum Side {
  BUY = 'buy',
  SELL = 'sell'
}