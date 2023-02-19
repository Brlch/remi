
const puppeteer = require('puppeteer');

async function startRemi(optionsPath = []) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  //Initialize CA("Consulta amigable") page
  await page.goto('https://apps5.mineco.gob.pe/transparencia/Navegador/default.aspx?y=2023&ap=Proyecto');
  await page.setViewport({ width: 1080, height: 1024 });

  //Get the iframe CA uses for internal data
  let elementHandle = await page.$('#frame0');
  let frame = await elementHandle.contentFrame();
  const firstButton = '#ctl00_CPH1_BtnTipoGobierno';
  await waitAndClick(frame, firstButton);
  await waitCALoading(frame);


  let table = null;

  // follow the path
  const promises = optionsPath.map(async element => {
    table = await GetDataResults(frame);
    const row = table.rows.find(x => x.name == element);
    
    // select path
    await waitAndClick(frame, `#${row.id} > input[type=radio]`);
    
    // select button
    await waitAndClick(frame, '#ctl00_CPH1_BtnSubTipoGobierno');
    await waitCALoading(frame);
    
    frame = await getNewFrame(page, frame);
  });

  // wait for all steps to execute
  await Promise.all(promises);

  // close browser and return the options
  table = await GetDataResults(frame);
  await browser.close();
  return table.options;

}

async function getNewFrame(page, frame) {
  const elementHandle = await page.$('#frame0');
  frame = await elementHandle.contentFrame();
  return frame;
}

async function screenshot(page, name) {
  await page.screenshot({
    path: `./${name}.png`,
    type: "png",
    fullPage: true
  });
}

async function waitCALoading(frame) {
  await frame.waitForSelector('#DivProgress:not([style*="display: none"])');
  await frame.waitForSelector('#DivProgress[style*="display: none"]');
}

async function waitAndClick(element, selector) {
  const selectedToClick = await element.waitForSelector(selector);
  try {
    await selectedToClick.evaluate(b => b.click());
  } catch (ex) {
    console.log("Exception: ", ex);
  }
}

async function GetDataResults(frame) {
  //May fail if this runs before the reload
  await frame.waitForSelector('table.Data tr');
  const result = await frame.$$eval('table.Data tr', rows => {
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, (column, index) => index == 0 ? column.id : column.innerText.trim());

    });
  });
  return new TableResult(result);

}

class RowResult {
  constructor(row) {
    this.id = row[0];
    this.name = row[1];
    this.pia = row[2];
    this.pim = row[3];
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
  get options() {
    return this.rows.map(function (v) { return v.name; });
  }
}
module.exports = { startRemi };