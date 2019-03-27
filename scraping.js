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
    let products = await page.evaluate(() =>
      Array.from(document.querySelectorAll("div.item-product-caption"))
        .map(product => ({
          id: product.querySelector("div i").getAttribute('id'),
          description: product.querySelector("div.caption-bottom-wrapper h5 div").innerText.trim(),
          brand: product.querySelector("div.caption-bottom-wrapper h5 span").innerText.trim(),
          price: product.querySelector("div.caption-bottom-wrapper div.prices span.active-price span").innerText.trim(),
          image: product.querySelector("div.caption-top-wrapper img").src,
          quantity: product.querySelector("div.caption-bottom-wrapper div.statement").innerText.trim()
        }))
    );
    await browser.close();
    return products;
  } catch (e) {
    console.log(e);
    return e;
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
    await page.goto('https://www.metro.pe/buscapagina?sl=19ccd66b-b568-43cb-a106-b52f9796f5cd&PS=' + quantity + '&cc=' + quantity +'&sm=0&PageNumber=1&&&ft=' + searchproduct);
    await page.waitFor(10000);
    let products = await page.evaluate(() =>
      Array.from(document.querySelectorAll("li div.product-item"))
        .map(product => ({
          id: product.getAttribute('data-id'),
          description: product.querySelector("div.product-item__info a.product-item__name").innerText.trim(),
          brand: product.querySelector("div.product-item__info div.product-item__brand").innerText.trim(),
          price: product.querySelector("div.product-prices__wrapper span.product-prices__value").innerText.trim(),
          image: product.querySelector("div.product-item__image-wrapper img").src,
          quantity: ""
        }))
    );
    await browser.close();
    return products;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function scrapingPlazaVea(searchproduct = 'radio', quantity = 15, category = 'SU') {
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
    let keyCategory = '';
    if (category == "SU") {
      keyCategory = "fa216ec0-d8f9-442d-8a3d-18e6fcc683b1";
    } else {
      keyCategory = "3fae6b43-f32a-4e46-9aa1-44d37576301a";
    }
    await page.goto('https://www.plazavea.com.pe/buscapagina?sl='+keyCategory+'&&PS='+quantity+'&&cc='+quantity+'&&sm=0&&PageNumber=1&&ft=' + searchproduct);
    await page.waitFor(10000);
    let products = await page.evaluate(() =>
      Array.from(document.querySelectorAll("li div.g-producto"))
        .map(product => ({
          id: product.getAttribute('data-prod'),
          description: product.querySelector("div.g-divaux span.g-nombre-complete").innerText.trim(),
          brand: product.querySelector("div.g-divaux a.brand").innerText.trim(),
          price: product.querySelector("div.g-divaux div.gi-l p").innerText.trim(),
          image: product.querySelector("div.g-cnt-img img").src,
          quantity: ""
        }))
    );
    await browser.close();
    return products;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function startScraping(product = 'radio') {
  let objMarkets = {
    "vea": {
      "name": "Plaza Vea",
      "products": []
    },
    "tottus": {
      "name": "Tottus",
      "products": []
    },
    "metro": {
      "name": "Metro",
      "products": []
    }
  };
  objMarkets.tottus.products = await scrapingTottus(product);
  objMarkets.metro.products = await scrapingMetro(product);
  objMarkets.vea.products = await scrapingPlazaVea(product);
  return objMarkets;
}

app.get('/scrap/', (req, res) => {
  startScraping(req.query.prod).then(obj => {
    res.send(obj);
  });
});

app.listen(8000, '0.0.0.0', () => {
  console.log('Server listening on port 8000!')
});

