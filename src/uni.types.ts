export interface UniPairListResponse {
  data: Data;
}

export interface Data {
  pairs: Pair[];
}

export interface Pair {
  id: string;
  txCount: string;
  token0: Token0;
  token1: Token1;
  reserveUSD: string;
  trackedReserveETH: string;
  volumeUSD: string;
  untrackedVolumeUSD: string;
  createdAtTimestamp: string;
}

export interface Token0 {
  totalLiquidity: string;
  totalSupply: string;
  symbol: string;
  id: string;
}

export interface Token1 {
  totalLiquidity: string;
  totalSupply: string;
  symbol: string;
  id: string;
}
