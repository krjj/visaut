const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');


(async function example() {
    let page = await new webdriver.Builder().forBrowser('chrome').build();
    try {
        await page.get('https://beta.echannels.moi.gov.ae/echannels/web/client/default.html#/login');
        await page.wait(webdriver.until.elementLocated(webdriver.By.xpath('/html/body/div[3]/ui-view/div[4]/div[3]/div[7]/form')), 10000);
        await page.findElement(webdriver.By.xpath('/html/body/div[3]/ui-view/div[4]/div[3]/div[7]/form/div[1]/input')).sendKeys('harish@musafir.com')
        await page.findElement(webdriver.By.xpath('//*[@id="password"]')).sendKeys('Har@2018')
        await page.findElement(webdriver.By.xpath('/html/body/div[3]/ui-view/div[4]/div[3]/div[7]/form/div[4]/div[1]/button')).click()
        await page.sleep(5000)
        await page.findElement(webdriver.By.xpath('/html/body/div[1]/div/div/div[1]/h3/button')).click()
        await page.sleep(2000)
        await page.get('https://beta.echannels.moi.gov.ae/echannels/web/client/establishment/index.html#/visa/request/2/step1?withException=false');
        await page.sleep(5000)
        
        // Fill Arrival Port Field
        await page.findElement(webdriver.By.xpath('//*[@id="form-views"]/div/form/div[1]/div[1]/tahaluf-dropdownlist/div[1]/div/a')).click()
        await page.sleep(1000)
        await page.findElement(webdriver.By.xpath('//*[@id="form-views"]/div/form/div[1]/div[1]/tahaluf-dropdownlist/div[1]/div/div/div[1]/input')).sendKeys('Abu Dhabi')
        await page.findElement(webdriver.By.xpath('//*[@id="form-views"]/div/form/div[1]/div[1]/tahaluf-dropdownlist/div[1]/div/div/div[1]/input')).sendKeys(webdriver.Key.RETURN)
        await page.sleep(3000)

        // Fill Come From Field
        await page.findElement(webdriver.By.xpath('//*[@id="form-views"]/div/form/div[1]/div[3]/tahaluf-dropdownlist/div[1]/div/a')).click()
        await page.sleep(1000)
        await page.findElement(webdriver.By.xpath('//*[@id="form-views"]/div/form/div[1]/div[3]/tahaluf-dropdownlist/div[1]/div/div/div[1]/input')).sendKeys('India')
        await page.findElement(webdriver.By.xpath('//*[@id="form-views"]/div/form/div[1]/div[3]/tahaluf-dropdownlist/div[1]/div/div/div[1]/input')).sendKeys(webdriver.Key.RETURN)
        await page.sleep(3000)

        // Fill Arrival Date Field
        await page.findElement(webdriver.By.xpath('//*[@id="form-views"]/div/form/div[1]/div[7]/p/input')).sendKeys('01082018')
        await page.sleep(5000)

        // Press next 
        await page.findElement(webdriver.By.xpath('//*[@id="form-views"]/div/form/div[4]/button')).click()
        await page.sleep(5000)

        //Upload Passport Image Field
        fileinput = await page.findElement(webdriver.By.xpath('//*[@id="form-views"]/form/div[1]/div[3]/div[3]/div/button')).click()
        await fileinput.send_keys('file:///home/kshitij/Desktop/kij-9LMQ_400x400.jpg')
        
        await page.sleep(5000)
    } finally {
        await page.quit();
    }
})();