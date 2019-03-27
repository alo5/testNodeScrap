let PlazaVea = {
  url: "https://www.plazavea.com.pe/buscapagina",
  parameters: {
    sl: "fa216ec0-d8f9-442d-8a3d-18e6fcc683b1",
    PS: 15,
    cc: 15,
    sm: 0,
    PageNumber: 1,
    ft: 'radio'
  },
  domfields: {
    rootNode: "li div.g-producto",
    body: {
      id: "data-prod",
      description: "div.g-divaux span.g-nombre-complete",
      brand: "div.g-divaux a.brand",
      price: "div.g-divaux div.gi-l p",
      image: "div.g-cnt-img img",
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

module.exports = PlazaVea;
