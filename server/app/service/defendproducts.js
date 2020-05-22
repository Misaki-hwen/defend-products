'use strict';

const Service = require('egg').Service;

class DefendProductsService extends Service {
  async get(e) {
    const { ctx } = this;
    try {
      const res = await ctx.model.Defendproducts.findOne({ companyId: e.companyId });
      return res;
    } catch (error) {
      throw error;
    }
  }
  async add(params) {
    const { ctx } = this;
    console.log('传给service的参数');
    console.log(params);
    const data = {
      formData: params.formData,
      companyId: params.companyId,
      invoice: params.invoice,
    };
    try {
      const res = await ctx.model.Defendproducts.update({ companyId: data.companyId }, data, { upsert: true });
      // const res = await ctx.model.Defendproducts.create(params);
      console.log(res);
    } catch (error) {
      throw error;
    }
  }
  async update(params) {
    const { ctx } = this;
    try {
      const res = await ctx.model.Defendproducts.updateMany({}, params, { upsert: true });
      console.log(res);
    } catch (error) {
      throw error;
    }
  }
  async delete(params) {
    const { ctx } = this;
    try {
      const res = await ctx.model.Defendproducts.remove({ _id: params._id });
      console.log(res);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DefendProductsService;
