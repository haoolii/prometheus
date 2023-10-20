import schedule from "node-schedule";

const JOB_RULE = "*/5 * * * * *";

type JobCancelFun = () => Promise<void> | void;
type JobExecuteFun = () => Promise<void> | void;

type JobFunObj = {
  execute: JobExecuteFun;
  cancel: JobCancelFun;
};

export const createJob = () => {
  const jobs: Array<JobFunObj> = [];
  try {
    const job = schedule.scheduleJob(JOB_RULE, async () => {
        for (let job of jobs) {
            try {
                await job.execute();
            } catch (err) {
                console.log('Single job error');
            }
        }
    });
    return {
      schedule: (execute: JobExecuteFun, cancel: JobCancelFun = () => new Promise((r, j) => {})) => {
        jobs.push({
          execute,
          cancel,
        });
      },
    };

  } catch (err) {
    console.log("Job Error");
    throw '';
  }
};
