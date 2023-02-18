const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //Initialize CA("Consulta amigable") page
    await page.goto('https://apps5.mineco.gob.pe/transparencia/Navegador/default.aspx?y=2023&ap=Proyecto');
    await page.setViewport({ width: 1080, height: 1024 });

    //Get the iframe CA uses for internal data
    const elementHandle = await page.$('#frame0');
    const frame = await elementHandle.contentFrame();
    await waitAndClick(frame,'#ctl00_CPH1_BtnTipoGobierno');


    //Start exp
    await waitAndClick(frame,'#ctl00_CPH1_RptData_ctl02_TD0 > input[type=radio]');
    await waitAndClick(frame,'#ctl00_CPH1_BtnSubTipoGobierno');

    

    const result = await GetDataResults(frame);
    const table = new TableResult(result);
    console.log(table); 
    //console.log(table.options); 
    
    
    //Screenshot of last place for reference
    await page.screenshot({
        path: "./test.png",
        type: "png",
        fullPage: true
    })

    await browser.close();
})();

async function waitAndClick(element,selector) {
  await element.waitForSelector(selector);
  await element.click(selector);
}

async function GetDataResults(frame) {
  await frame.waitForSelector('table.Data tr');
  return await frame.$$eval('table.Data tr', rows => {
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      //return Array.from(columns, (column,index) => index==0? column.id: column.innerText);
      return Array.from(columns, column => column.innerText);
    });
  });
}

class RowResult {
  constructor(row) {
    this.id   = row[0];
    this.name = row[1];
    this.pia  = row[2];
    this.pim  = row[3];
    this.cert = row[4];
    this.comp = row[5];
    this.atco = row[6];
    this.devn = row[7];
    this.gira = row[8];
    this.avan = row[9];
  }
}
class TableResult {

  constructor(table) {
    this.rows = [];
    table.forEach(row => {
      this.rows.push(new RowResult(row));
    });
  }
  get options(){
    return this.rows.map(function(v){ return v.name; });
  }
}