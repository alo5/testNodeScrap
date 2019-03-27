let Tottus = {
  url: "http://www.tottus.com.pe/tottus/search",
  parameters: {
    Nrpp: 15,
    Ntt: 'radio'
  },
  domfields: {
    rootNode: "div.item-product-caption",
    body: {
      id: ["div i", "id"],
      description: "div.caption-bottom-wrapper h5 div",
      brand: "div.caption-bottom-wrapper h5 span",
      price: "div.caption-bottom-wrapper div.prices span.active-price span",
      image: "div.caption-top-wrapper img",
      quantity: "div.caption-bottom-wrapper div.statement"
    }
  },
  setQuantity: function(q) {this.parameters.Nrpp = q},
  setProduct: function(p) {this.parameters.Ntt = p},
  processParameters: function() {
    let p = "?";
    for (let k in this.parameters) {
      p += (k + "=" + this.parameters[k] + "&");
    }
    return p;
  }
};

module.exports = Tottus;
