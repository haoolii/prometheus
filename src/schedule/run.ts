import { sendMessage } from '../bot';
import { Record } from './types';
import { createJob } from './job';
import { parseRecord } from './utils';
import config from '../config';
const job = createJob();

let last_check_unix: number | null = null;

job.schedule(async () => {
    const URL = `https://www.okx.com/priapi/v5/ecotrade/public/trade-records?limit=20&uniqueName=563E3A78CDBAFB4E`;
    try {
        const response = await fetch(URL)
        const data = await response.json();
        const records = data?.data?.sort((a: any, b: any) => b.uTime - a.uTime) as Array<Record> || [] ;
        if (last_check_unix !== null) {
            for(let i = 0; i < records.length; i++) {
                const record =  records[i];
                if (+record.uTime > last_check_unix) {
                    await sendMessage(parseRecord(record));
                }
            }
        }
        console.log(`${config.VERSION}-Tick last_check_unix:`,last_check_unix);
        
        last_check_unix = +records[0].uTime;
    } catch (err) {
        console.log('error')
    }
});
