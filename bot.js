const puppeteer = require('puppeteer');
const fs = require('fs');

async function run(page) {/* 
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage(); */
    page.setViewport({ width: 1366, height: 768 })
    await page.goto('https://beta.echannels.moi.gov.ae/echannels/web/client/default.html#/login', { timeout: 60000 });
    await page.waitForSelector('body > div.app.container > ui-view > div.landingServices.ng-scope > div.servicedatails.service1 > div.col-md-4.loginService.animated.fadeInRightBig > form > div:nth-child(1) > input', { timeout: 60000 });
    await page.type('body > div.app.container > ui-view > div.landingServices.ng-scope > div.servicedatails.service1 > div.col-md-4.loginService.animated.fadeInRightBig > form > div:nth-child(1) > input', 'harish@musafir.com', { delay: 1 });
    await page.type('#password', 'Har@2018', { delay: 1 });
    await page.click("body > div.app.container > ui-view > div.landingServices.ng-scope > div.servicedatails.service1 > div.col-md-4.loginService.animated.fadeInRightBig > form > div:nth-child(4) > div:nth-child(1) > button");
    await page.waitForSelector('body > div.modal.fade.ng-isolate-scope.in > div > div > div.modal-header.ng-scope > h3 > button', { timeout: 60000 }).then(async () => {
        //console.log('Popup window detected');
        await page.waitFor(2000);
        await page.click('body > div.modal.fade.ng-isolate-scope.in > div > div > div.modal-header.ng-scope > h3 > button');
    }).catch(async (e) => {
        //console.log('No popup window detected');
        await page.click('#header > div.pos-rlt.navbar-collapse.box-shadow.mrt22.ng-scope > div.navbar-header');
        await page.click('#header > div.pos-rlt.navbar-collapse.box-shadow.mrt22.ng-scope > div.navbar-header');
    })


    //console.log('Navigating to Form > Step 1')
    await page.goto('https://beta.echannels.moi.gov.ae/echannels/web/client/establishment/index.html#/visa/request/2/step1?withException=false');
    await page.waitForSelector('#form-views > div > form > div:nth-child(1) > div:nth-child(1) > tahaluf-dropdownlist > div:nth-child(1) > div > a > span.select2-chosen.ng-binding', { timeout: 30000 });
    await page.waitFor(10000) // wait for 10secs to fully load the page.

    // Fill Arrival Port Field
    await page.click('#form-views > div > form > div:nth-child(1) > div:nth-child(1) > tahaluf-dropdownlist > div:nth-child(1) > div > a');
    await page.waitForSelector('#form-views > div > form > div:nth-child(1) > div:nth-child(1) > tahaluf-dropdownlist > div:nth-child(1) > div > a > span.select2-chosen.ng-binding', { timeout: 30000 }).then(async (p) => {
        await page.type('#form-views > div > form > div:nth-child(1) > div:nth-child(1) > tahaluf-dropdownlist > div:nth-child(1) > div > a > span.select2-chosen.ng-binding', 'AL HUR PORT')
        await page.type('#form-views > div > form > div:nth-child(1) > div:nth-child(1) > tahaluf-dropdownlist > div:nth-child(1) > div > a > span.select2-chosen.ng-binding', String.fromCharCode(13));
    }).catch((e) => {

    })

    // Fill Come From Field
    await page.click('#form-views > div > form > div:nth-child(1) > div:nth-child(3) > tahaluf-dropdownlist');
    await page.waitForSelector('#form-views > div > form > div:nth-child(1) > div:nth-child(3) > tahaluf-dropdownlist > div:nth-child(1) > div > a > span:nth-child(2)', { timeout: 30000 }).then(async (p) => {
        await page.type('#form-views > div > form > div:nth-child(1) > div:nth-child(3) > tahaluf-dropdownlist > div:nth-child(1) > div > a > span:nth-child(2)', 'INDIA')
        await page.type('#form-views > div > form > div:nth-child(1) > div:nth-child(3) > tahaluf-dropdownlist > div:nth-child(1) > div > a > span:nth-child(2)', String.fromCharCode(13));
    }).catch((e) => {

    })

    /*
        // Fill Departure Port Field
        await page.click('#form-views > div > form > div:nth-child(1) > div:nth-child(1) > tahaluf-dropdownlist > div:nth-child(1) > div > a');
        await page.waitForSelector('#form-views > div > form > div:nth-child(1) > div:nth-child(1) > tahaluf-dropdownlist > div:nth-child(1) > div > a > span.select2-chosen.ng-binding', { timeout: 30000 })
    */

    // Fill Arrival Date Field
    await page.click('#form-views > div > form > div:nth-child(1) > div:nth-child(7) > p > input');
    await page.type('#form-views > div > form > div:nth-child(1) > div:nth-child(7) > p > input', '02/08/2018', { delay: 150 })

    await page.waitFor(2000)

    // Wait for Next button to be available in step2 then click 
    await page.waitForSelector('#form-views > div > form > div.actionbar.container.row > button', { timeout: 30000 }).then(() => {
        page.click('#form-views > div > form > div.actionbar.container.row > button')
    })

    //console.log('Step 1 Complete')

    await page.waitFor(5000)

    // Load Passport Image from file system
    pImage = fs.readFileSync('./q.jpg', 'base64');

    // Inject and run the js code in browser context
    await page.evaluate('var base64=' + '`' + pImage + '`') // set base64 var value , contains image data encoded as base64
    // Run code in browser context -> select passport image programatically by directly calling appropriate angular controller function
    await page.evaluate(() => {
        fixBinary = function (bin) {
            var length = bin.length;
            var buf = new ArrayBuffer(length);
            var arr = new Uint8Array(buf);
            for (var i = 0; i < length; i++) {
                arr[i] = bin.charCodeAt(i);
            }
            return buf;
        }

        var binary = fixBinary(atob(base64));
        var blob = new Blob([binary], { type: 'image/jpeg' });

        a = angular.element(document.querySelector('#form-views > form > div.ng-scope > div:nth-child(3) > div:nth-child(4) > div > button')).scope()
        a.uploadPassportFile(blob, [])

        //console.log("code injected")
    })

    // Click on Crop Button available 
    await page.waitForSelector('#actions > div > div > div:nth-child(7) > button', { visible: true, timeout: 60000 }).then(async () => {
        await page.click('#actions > div > div > div:nth-child(7) > button')
        //console.log('Passport Image Selected')
        await page.waitFor(5000)

    }).catch((e) => {
        //err handle close page
        //console.log(e)
    })


    // Fill Insurance Policy No Field
    await page.click(`div[heading='Health insurance policy information'] a[placeholder='Please select']`);
    await page.waitForSelector(`div[heading='Health insurance policy information'] input`, { timeout: 30000 }).then(async (p) => {
        await page.type(`div[heading='Health insurance policy information'] input`, String.fromCharCode(13));
    }).catch((e) => {

    })

    // Fill Name field
    await page.type('input[placeholder="Name (English)"]', 'John Doe');

    // Fill Current Nationality Field
    await page.click(`div[heading='Personal Information For Sponsored (Service Beneficiary)'] div > div > div:nth-child(6) > tahaluf-dropdownlist > div:nth-child(1) > div`);
    await page.waitForSelector('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(6) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', { timeout: 30000 }).then(async (p) => {
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(6) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', 'India');
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(6) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', String.fromCharCode(13));
    }).catch((e) => {

    })

    ///////////

    // Fill Previous Nationality Field
    await page.click('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(7) > tahaluf-dropdownlist > div:nth-child(1) > div > a');
    await page.waitForSelector('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(7) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', { timeout: 30000 }).then(async (p) => {
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(7) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', 'India');
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(7) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', String.fromCharCode(13));
    }).catch((e) => {

    })

    // Fill Gender Field
    await page.click('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(9) > tahaluf-dropdownlist > div:nth-child(1) > div > a');
    await page.waitForSelector('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(9) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', { timeout: 30000 }).then(async (p) => {
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(9) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', 'MALE');
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(9) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', String.fromCharCode(13));
    }).catch((e) => {

    })


    // Fill Date Of Birth Field
    await page.click('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(10) > p > input');
    await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(10) > p > input', '02/08/2000', { delay: 150 })

    // Fill Birth Country Field
    await page.click('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(12) > tahaluf-dropdownlist > div:nth-child(1) > div > a');
    await page.waitForSelector('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(12) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', { timeout: 30000 }).then(async (p) => {
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(12) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', 'India');
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(12) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', String.fromCharCode(13));
    }).catch((e) => {

    })

    // Fill Marital Status Field
    await page.click('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(13) > tahaluf-dropdownlist > div:nth-child(1) > div > a');
    await page.waitForSelector('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(13) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', { timeout: 30000 }).then(async (p) => {
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(13) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', 'SINGLE');
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(13) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', String.fromCharCode(13));
    }).catch((e) => {

    })

    // Fill Place Of Birth Field
    await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(16) > input', 'India');


    // Fill Mother's Name Field
    await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(19) > input', 'India');

    // Fill Religion Field
    await page.click('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(22) > tahaluf-dropdownlist > div:nth-child(1) > div > a');
    await page.waitForSelector('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(22) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', { timeout: 30000 }).then(async (p) => {
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(22) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', 'HINDUISM');
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(22) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', String.fromCharCode(13));
        await page.waitFor(5000)
    }).catch((e) => {

    })


    // Fill Qualification Field
    await page.click('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(25) > tahaluf-dropdownlist > div:nth-child(1) > div > a');
    await page.waitForSelector('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(25) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', { timeout: 30000 }).then(async (p) => {
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(25) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', 'BACHELOR');
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(25) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', String.fromCharCode(13));
    }).catch((e) => {

    })

    // Fill Profession Field
    await page.click('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(26) > tahaluf-dropdownlist > div:nth-child(1) > div > a');
    await page.waitForSelector('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(26) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', { timeout: 30000 }).then(async (p) => {
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(26) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', 'SOFTWARE SPECIALIST', { delay: 250 });
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(26) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', String.fromCharCode(13));
        await page.waitFor(3000)
    }).catch((e) => {

    })


    // Fill Faith Field
    await page.click('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(23) > tahaluf-dropdownlist > div:nth-child(1) > div > a');
    await page.waitForSelector('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(23) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', { timeout: 30000 }).then(async (p) => {
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(23) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', 'HINDU');
        await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(23) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', String.fromCharCode(13));
    }).catch((e) => {

    })



    // Fill Visit Reason Field
    await page.type('div[heading="Personal Information For Sponsored (Service Beneficiary)"] div > div > div:nth-child(29) > input', 'Business Trip');





    // Fill Passport Type Field
    await page.click('div[heading="Passport Information"] div > div > div:nth-child(2) > tahaluf-dropdownlist > div:nth-child(1) > div > a');
    await page.waitForSelector('div[heading="Passport Information"] div > div > div:nth-child(2) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', { timeout: 30000 }).then(async (p) => {
        await page.type('div[heading="Passport Information"] div > div > div:nth-child(2) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', 'ORDINARY PASSPORT');
        await page.type('div[heading="Passport Information"] div > div > div:nth-child(2) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', String.fromCharCode(13));
    }).catch((e) => {

    })

    // Fill Passport No Field
    await page.type('div[heading="Passport Information"] div > div > div:nth-child(3) > input', '123456');


    // Fill Passport Issue Date
    await page.click('div[heading="Passport Information"] div > div > div:nth-child(5) > p');
    await page.type('div[heading="Passport Information"] div > div > div:nth-child(5) > p > input', '02/01/2018', { delay: 150 })


    // Fill Passport Expire Date
    await page.click('div[heading="Passport Information"] div > div > div:nth-child(6) > p');
    await page.type('div[heading="Passport Information"] div > div > div:nth-child(6) > p > input', '02/08/2019', { delay: 150 })

    // Fill Passport Issue Place
    await page.type('div[heading="Passport Information"] div > div > div:nth-child(8) > input', 'India');

    // Fill Passport Issue Country
    await page.click('div[heading="Passport Information"] div > div > div:nth-child(11) > tahaluf-dropdownlist > div:nth-child(1) > div > a');
    await page.waitForSelector('div[heading="Passport Information"] div > div > div:nth-child(11) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', { timeout: 30000 }).then(async (p) => {
        await page.type('div[heading="Passport Information"] div > div > div:nth-child(11) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', 'INDIA');
        await page.type('div[heading="Passport Information"] div > div > div:nth-child(11) > tahaluf-dropdownlist > div:nth-child(1) > div > div > div.search-container.select2-search > input', String.fromCharCode(13));
    }).catch((e) => {

    })

    //console.log('Step 2 Complete')

    await page.waitFor(15000);
    await page.close();
}

module.exports.run = run