import { sendMessage } from "./bot";
import { Pair, UniPairListResponse } from "./uni.types";
import { default as dayjs } from "dayjs";
import { compare, subtract } from 'mathjs';

let last_check_unix = dayjs().unix();

const delay = (ms: number) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(true);
      }, ms);
    } catch (err) {
      reject(err);
    }
  });
};

const requestPairList = (first = 20): Promise<UniPairListResponse> => {
  try {
    const query = `
        query Pairs {
            pairs(orderBy: createdAtTimestamp, orderDirection: desc, first: ${first}, skip: 0) {
                token0 {
                  totalLiquidity
                  totalSupply
                  symbol
                  id
                }
                token1 {
                    totalLiquidity
                    totalSupply
                    symbol
                    id
                }
                id
                txCount
                reserveUSD
                trackedReserveETH
                volumeUSD
                untrackedVolumeUSD
                createdAtTimestamp
            }
        }
    `;
  
    return fetch(
      "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-dev",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      }
    ).then((r) => r.json());
  } catch (err) {
    console.log('err', err);
    throw err;
  }
};

const parse = (paris: Pair[]) => {
  return paris.map((pair) => ({
    id: pair.id,
    token0: pair.token0,
    token1: pair.token1,
    pairSymbol: `${pair.token0.symbol}/${pair.token1.symbol}`,
    reserveUSD: pair.reserveUSD,
    txCount: pair.txCount,
    createdAtTimestamp: pair.createdAtTimestamp,
  }));
};

const filter = (pairs: Pair[]) => {
  if (pairs.length > 0) {
    console.log(`last_check_unix: ${last_check_unix}, first_pair ${pairs[0].token0.symbol}/${pairs[0].token1.symbol},  first_pair_createdAtTimestamp: ${pairs[0].createdAtTimestamp}`)
    console.log('last_check_unix - first_pair_createdAtTimestamp', last_check_unix - (+pairs[0].createdAtTimestamp));
  }
  return pairs.filter((pair) => {
    return (subtract(last_check_unix, +pair.createdAtTimestamp) < 5) && (compare(pair.reserveUSD, 1000) === 1) && pair.token0.symbol !== 'WETH'
  });
  
};
const main = async () => {
  while (true) {
    console.log('Tic');
    try {
      const response = await requestPairList(10);
      const pairs = parse(filter(response.data.pairs));
      for(let pair of pairs) {
        console.log('OH!');
        // await sendMessage(`🚨🚨🚨🚨🚨\nToken Address ${pair.token0.id}\nToken ${pair.token0.symbol}\nPair ${pair.pairSymbol}\nCreatedAtTimestamp ${pair.createdAtTimestamp}\nTxCount ${pair.txCount}\nreserveUSD ${pair.reserveUSD}\n<a href='https://www.dextools.io/app/en/ether/pair-explorer/${pair.id}'>DexTool</a>`);
        await sendMessage(`🚨🚨🚨🚨🚨\nToken Address ${pair.token0.id}\nToken ${pair.token0.symbol}\nPair ${pair.pairSymbol}\nCreatedAtTimestamp ${pair.createdAtTimestamp}\nTxCount ${pair.txCount}\nreserveUSD ${pair.reserveUSD}\n<a href='https://www.dextools.io/app/en/ether/pair-explorer/${pair.id}'>DexTool</a>`);
      }
      last_check_unix = dayjs().unix();
      await delay(60000);
    } catch (err) {
      throw "Error";
    }
    
  }
};

main();
