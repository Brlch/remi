
const puppeteer = require('puppeteer');

const ALL = "ALL";

async function processPath(optionsPath = [], scope = "Proyecto", year = "2023") {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    timeout: 10000,
    headless: true
  });
  const page = await browser.newPage();

  //Initialize CA("Consulta amigable") page
  await page.goto('https://apps5.mineco.gob.pe/transparencia/Navegador/default.aspx?y='+ year + '&ap=' + scope);
  await page.setViewport({ width: 1080, height: 1024 });

  //Get the iframe CA uses for internal data
  let elementHandle = await page.$('#frame0');
  let frame = await elementHandle.contentFrame();
  const firstButton = '#ctl00_CPH1_BtnTipoGobierno';
  await waitAndClick(frame, firstButton);
  await waitCALoading(frame);


  let table = null;

  // follow the path
  const promises = [];
  for (const element of optionsPath) {
    await Promise.all(promises);

    console.log("ELEMENT", element);
    if (element.includes("_Btn")) {
      // select button
      promises.push(waitAndClick(frame, `#${element}`));
      promises.push(waitCALoading(frame));
      promises.push(getNewFrame(page, frame).then(newFrame => frame = newFrame));
    } else {
      table = await GetDataResults(frame);
      let row = null;
      if (element === ALL)
        row = table.rows[0];
      else
        row = table.rows.find(x => x.name == element);

      // select path
      promises.push(waitAndClick(frame, `#${row.id} > input[type=radio]`));
    }
  }


  // wait for all steps to execute
  await Promise.all(promises);

  // screenshot(page, "afterAll");
  // close browser and return the options
  table = await GetDataResults(frame);
  await browser.close();
  return table;

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
  console.log("Searching for:", selector);
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
  const buttonsObj = await frame.$x('.//*[contains(@id,"_Btn") and not(contains(@style, "display: none"))]');
  let buttons = [];
  for (let i = 0; i < buttonsObj.length; i++) {
    const btn = await buttonsObj[i].evaluate(objEval => ({
      id: objEval.id, text: objEval.value
    }));
    buttons.push(btn);
  }
  return new TableResult(result, buttons);

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

  constructor(table, buttons) {
    this.rows = [];
    this.buttons = buttons;
    table.forEach(row => {
      this.rows.push(new RowResult(row));
    });

  }
  get options() {
    return this.rows.map(function (v) { return v.name; });
  }

}
module.exports = { processPath };