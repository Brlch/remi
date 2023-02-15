const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://apps5.mineco.gob.pe/transparencia/Navegador/default.aspx?y=2023&ap=Proyecto');

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });



    const elementHandle = await page.$(
        '#frame0',
    );
    const frame = await elementHandle.contentFrame();
    // Wait and click on first result
    const searchResultSelector = '#ctl00_CPH1_BtnTipoGobierno';
    await frame.click(searchResultSelector);

    // Locate the full title with a unique string
    const firstRadio = await frame.waitForSelector('#ctl00_CPH1_RptData_ctl02_TD0 > input[type=radio]');
    await frame.click('#ctl00_CPH1_RptData_ctl02_TD0 > input[type=radio]');
    const gobmanc = await frame.waitForSelector('#ctl00_CPH1_BtnSubTipoGobierno');
    await frame.click('#ctl00_CPH1_BtnSubTipoGobierno');
    //let v = await frame.$eval('#ctl00_CPH1_BtnSector', element=> element.getAttribute("value"))
    await frame.waitForSelector('#ctl00_CPH1_BtnMancomunidad');

    const result = await page.$$eval('table.Data tr', rows => {
        return Array.from(rows, row => {
          const columns = row.querySelectorAll('td');
          return Array.from(columns, column => column.innerText);
        });
      });
      
      console.log(result); // "C2"
      
    //console.log(v);
    const screenShot = await page.screenshot({
        path: "./test.png",
        type: "png",
        fullPage: true
    })

    //const fullTitle = await textSelector.evaluate(el => el.textContent);

    // Print the full title
    console.log('Lets see....');

    await browser.close();
})();