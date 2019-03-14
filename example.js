const puppeteer = require('puppeteer');
const express = require('express');
const app = express();


async function scrapingTottus(searchproduct = 'radio', quantity = 15) {
  try {
    //Puppeteer with headless:true is extremely slow: https://github.com/GoogleChrome/puppeteer/issues/1718
    //const browser = await puppeteer.launch({args: ["--proxy-server='direct://'", '--proxy-bypass-list=*']})
    const browser = await puppeteer.launch({args: ["--proxy-server='direct://'", '--proxy-bypass-list=*']});
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font'){
            req.abort();
        }
        else {
            req.continue();
        }
    });
    await page.goto('http://www.tottus.com.pe/tottus/search?Nrpp=' + quantity + '&Ntt=' + searchproduct);
    await page.waitFor(10000);
    const products = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".caption-bottom-wrapper .title a h5 div")).map(product => product.innerText.trim())
    );
    console.log(products);
    await browser.close();
  } catch (e) {
    console.log(e);
  }
}

async function scrapingMetro(searchproduct = 'radio', quantity = 15) {
  try {
    const browser = await puppeteer.launch({args: ["--proxy-server='direct://'", '--proxy-bypass-list=*']});
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font'){
            req.abort();
        }
        else {
            req.continue();
        }
    });
    await page.goto('https://www.metro.pe/busca/?ft=' + searchproduct);
    await page.waitFor(10000);
    const products = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".product-item__bottom .product-item__info a.product-item__name")).map(product => product.innerText.trim())
    );
    console.log(products);
    await browser.close();
  } catch (e) {
    console.log(e);
  }
}

async function scrapingPlazaVea(searchproduct = 'radio', quantity = 15) {
  try {
    const browser = await puppeteer.launch({args: ["--proxy-server='direct://'", '--proxy-bypass-list=*']});
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font'){
            req.abort();
        }
        else {
            req.continue();
        }
    });
    await page.goto('https://www.plazavea.com.pe/Busca/?PS=20&cc=24&sm=0&PageNumber=1&ft=' + searchproduct + '&sc=1');
    await page.waitFor(10000);
    const products = await page.evaluate(() =>
      Array.from(document.querySelectorAll("div.g-inner-prod .g-divaux .g-nombre-prod")).map(product => product.innerText.trim())
    );
    console.log(products);
    await browser.close();
  } catch (e) {
    console.log(e);
  }
}

async function startScraping(product = 'radio') {
  console.log('Tottus:');
  await scrapingTottus(product);
  console.log('Metro:');
  await scrapingMetro(product);
  console.log('PlazaVea:');
  await scrapingPlazaVea(product);
}

startScraping('TV');
//scrapingTottus();

/*app.get('/', (req, res) => {
  startScraping('TV')
  //res.send('HOLa Mundo hola mundo!')
});

app.listen(8000, '0.0.0.0', () => {
  //await startScraping('TV');
  console.log('Example app listening on port 8000!')
});*/

