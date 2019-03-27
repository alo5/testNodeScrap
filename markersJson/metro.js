let Metro = {
  url: "https://www.metro.pe/buscapagina",
  parameters: {
    sl: "19ccd66b-b568-43cb-a106-b52f9796f5cd",
    PS: 15,
    cc: 15,
    sm: 0,
    PageNumber: 1,
    ft: 'radio'
  },
  domfields: {
    rootNode: "li div.product-item",
    body: {
      id: "data-id",
      description: "div.product-item__info a.product-item__name",
      brand: "div.product-item__info div.product-item__brand",
      price: "div.product-prices__wrapper span.product-prices__value",
      image: "div.product-item__image-wrapper img",
      quantity: ""
    }
  },
  setQuantity: function(q) {this.parameters.PS = q; this.parameters.cc = q;},
  setProduct: function(p) {this.parameters.ft = p},
  setCategory: function(c) {this.parameters.sl = c},
  processParameters: function() {
    let p = "?";
    for (let k in this.parameters) {
      p += (k + "=" + this.parameters[k] + "&");
    }
    return p;
  }
};

module.exports = Metro;
