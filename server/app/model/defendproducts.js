'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const defendproductsSchema = new Schema({
    companyId: { type: String },
    formData: [{
      studio: { type: String },
      pname: { type: String },
      sku: { type: String },
      quantity: { type: String },
      date: { type: String },
      receiveMan: { type: String },
      companyName: { type: String },
    }],
    invoice: { type: String },
  });
  return mongoose.model('defendproducts', defendproductsSchema);
};
