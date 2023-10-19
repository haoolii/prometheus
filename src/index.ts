import Web3 from "web3";
import { graphql, buildSchema } from 'graphql';

const web3Connect = () => {
  return new Web3(
    new Web3.providers.HttpProvider(
      "https://mainnet.infura.io/v3/c322381dc1634bbba67da769e720c4a2"
    )
  );
};

const get_latest_block = (web3: Web3) => {
  return web3.eth.getBlock("latest");
};

const get_latest_block_id = (block_information: any) => {
  return block_information["number"];
};

const search_new_contracts = async (web3: Web3, block_information: any) => {
  const block_transactions = block_information["transactions"];
  for (const transaction of block_transactions) {
    const transaction_data = await web3.eth.getTransaction(transaction);
    const inputData = transaction_data.input;
    const isERC20Deploy = inputData.startsWith("0x6060604052");
    if (isERC20Deploy) {
      const tokenContractData = await web3.eth.getTransactionReceipt(
        transaction_data.hash
      );
      console.log(
        "========================================================================"
      );
      console.log(`Is ERC-20 Deployment`);
      console.log(`Address:`, tokenContractData.contractAddress);
      console.log(`Deploy Data`, transaction_data);
      console.log(
        "========================================================================"
      );
    } else {
    //   console.log("Negative => ", transaction);
    }
  }
};

let current_block_number = 0;

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

const main = async () => {
  while (true) {
      const web3Connection = await web3Connect();
      const latest_block = await get_latest_block(web3Connection)
      const latest_block_id = get_latest_block_id(latest_block)

      console.log('latest_block_id', latest_block_id)

    if (current_block_number !== latest_block_id) {
        console.log(`New block detected: ${latest_block_id}`)
        console.log(`Block transactions count`, latest_block.transactions)
        // await search_new_contracts(web3Connection, latest_block)
        current_block_number = latest_block_id
    }

    await delay(1 * 1000);
  }

};

const test = async () => {
    const web3Connection = await web3Connect();

    const transaction_data = await web3Connection.eth.getTransaction('0x19bd4a83408ae3b6e45c746eae866776d838b1c460238d9d934f8d1cb6941580')
    // console.log(transaction_data)

   const data = await web3Connection.eth.getTransactionReceipt('0x19bd4a83408ae3b6e45c746eae866776d838b1c460238d9d934f8d1cb6941580')
   console.log('data', data.contractAddress)

    if (data.contractAddress) {
        const code = await web3Connection.eth.getCode(data.contractAddress);
        // console.log('getCode', code)
        // fetch('https://api.etherscan.io/api?module=contract&action=getsourcecode&address=0x6d199a486bf9cebfb3c80411334584989b9d92be&apikey=P1UIT2WDMN9GCC9YZWGJ8XTI7GGZVYQEW8')
    }

}

main();
// test()
