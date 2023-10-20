import { default as dayjs } from "dayjs";
import { sendMessage } from '../bot';
import { createJob } from './job';
const job = createJob();

let last_check_unix: number | null = null;

job.schedule(async () => {
    const URL = `https://www.okx.com/priapi/v5/ecotrade/public/trade-records?t=${dayjs().valueOf()}&limit=20&startModify=1689782400000&endModify=1697817599000&uniqueName=563E3A78CDBAFB4E`;
    try {
        const response = await fetch(URL)
        const data = await response.json();
        const records = data?.data?.sort((a: any, b: any) => b.uTime - a.uTime) || [];

        if (last_check_unix !== null) {
            for(let i = 0; i < records.length; i++) {
                const record =  records[i];
                if (record.uTime > last_check_unix) {
                    await sendMessage(`🚨🚨🚨🚨🚨\nTarget:<b>${record.instFamily}</b>\nPosSide:${record.posSide}\nSide:${record.side}\nAvgPx:${record.avgPx}\nLever:<b>${record.lever}</b>\nuTime:${record.uTime}`);
                }
            }
        }
        console.log('Tick last_check_unix:',last_check_unix);
        
        last_check_unix = records[0].uTime;
    } catch (err) {
        console.log('error')
    }
});
