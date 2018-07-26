const { Cluster } = require('puppeteer-cluster');
var bot = require('./bot.js');


(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 5,
        retryLimit : 3,
        puppeteerOptions: {
            headless: false
        },
        monitor: true,
        timeout: 300000
    });


    cluster.task(async ({ page }) => {
        await bot.run(page)

    });
    cluster.on('taskerror', (err, data) => {
        console.log(`Error  ${data}: ${err.message}`);
    });

    for (i = 0; i < 10; i++) {
        await cluster.queue('Running BOT > Processing Form [ID]   ' + i)
    }

    await cluster.idle()
    await cluster.close()
})();
