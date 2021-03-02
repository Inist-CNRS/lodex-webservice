const schedule = require('node-schedule');
const shell    = require('shelljs');
const { tasks, environnement } = require('./config.json');

console.log("Starting cron with config.json tasks.");
const env = Object.assign(process.env, environnement);
const run = execute => () => shell.exec(execute, {
    silent: !process.env.CRON_VERBOSE,
    env,
});

const crontab = Array(tasks).filter(Boolean).filter((t) => (t.when && t.execute));
crontab.map(({ when, execute }) => schedule.scheduleJob(when, run(execute)));

crontab.map(({ execute }) => run(execute)());
/*
WHEN FORMAT

*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

*/
