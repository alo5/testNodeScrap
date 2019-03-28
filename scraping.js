const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
let metro = require('./markersJson/metro.js');
let tottus = require('./markersJson/tottus.js');
let plazavea = require('./markersJson/plazavea.js');

async function scrapingTottus(searchproduct = 'radio', quantity = 15) {
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

async function scrapGeneral(url, parameters, domfields) {
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
    await page.goto(url+parameters);
    await page.waitFor(10000);

    let products = await page.evaluate((domfields) => {
      return Array.from(document.querySelectorAll(domfields['rootNode']))
        .map(product => {
          let prodObj = {};
          let body = domfields['body'];
          for (let k in body) {
            if (k == 'id') {
              if (Array.isArray(body[k])) {
                prodObj[k] = product.querySelector(body[k][0]).getAttribute(body[k][1]);
              } else {
                prodObj[k] = product.getAttribute(body[k]);
              }
            } else if(k == 'image') {
              prodObj[k] = product.querySelector(body[k]).src;
            } else {
              if (body[k] != '') {
                prodObj[k] = product.querySelector(body[k]).innerText.trim();
              } else {
                prodObj[k] = "";
              }
            }
          }
          return prodObj;
        });
    }, domfields);
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

async function startScrapingGeneral(product = 'radio', quantity = 15) {
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
  metro.setProduct(product);
  metro.setQuantity(quantity);
  tottus.setProduct(product);
  tottus.setQuantity(quantity);
  plazavea.setProduct(product);
  plazavea.setQuantity(quantity);
  objMarkets.tottus.products = await scrapGeneral(tottus.url, tottus.processParameters(), tottus.domfields);
  objMarkets.metro.products = await scrapGeneral(metro.url, metro.processParameters(), metro.domfields);
  objMarkets.vea.products = await scrapGeneral(plazavea.url, plazavea.processParameters(), plazavea.domfields);
  return objMarkets;
}

app.get('/scrap/', (req, res) => {
  startScrapingGeneral(req.query.prod).then(o => {
    res.send(o);
  });
});

app.listen(8000, '0.0.0.0', () => {
  console.log('Server listening on port 8000!')
});

