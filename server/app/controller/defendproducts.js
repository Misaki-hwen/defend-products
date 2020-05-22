'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
// const awaitWriteStream = require('await-stream-ready').write;
// 管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
const pump = require('pump');

class DefendProductsController extends Controller {
  async uploadImg() {
    const { ctx, config } = this;
    // 获取文件流
    // 多个图片/文件
    const parts = await ctx.multipart({ autoFields: true });
    // 如果要获取同时上传的多个文件，不能通过ctx.getFileStream()来获取
    // 需要通过 ctx.multipart({ autoFields:true }) 获取
    // autoFields: true 表示获取除了文件字段以外的其他信息字段
    const files = [];
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) { // 注意如果没有传入直接返回
        return;
      }
      console.log(stream);
      // fieldname 获取文件表单提交的字段名称
      const fieldname = stream.fieldname;
      console.log('--------------------------------------------------------------------');
      console.log(fieldname);
      const filename = Math.random().toString(36).substr(2) + new Date().getTime() + path.extname(stream.filename).toLocaleLowerCase();
      // 图片存放在静态资源public/img文件夹下
      console.log(filename);
      const target = path.resolve(config.uploadPath, filename);
      // 生成一个文件写入 文件流
      const writeStream = fs.createWriteStream(target);

      try {
        // 异步把文件流 写入
        await pump(stream, writeStream); // 写入并销毁当前流
        // await awaitWriteStream(stream.pipe(writeStream));
        files.push({
          [fieldname]: target,
        });
      } catch (error) {
        console.log(error);
        // 如果出现错误，关闭管道,防止浏览器响应卡死
        await sendToWormhole(stream);
        writeStream.destroy();
        throw error;
      }
      ctx.body = {
        files,
        fields: parts.fields,
      };
      console.log(parts.fields);
    }
    const params = ctx.body.fields;
    const obj2 = {};
    for (let i = 0; i < params.length; i++) {
      obj2[params[i][0]] = params[i][1];
    }
    console.log(obj2);
    const obj1 = {};
    for (let j = 0; j < files.length; j++) {
      const key = Object.keys(files[j])[0];
      obj1[key] = files[j][key];
    }
    const obj = { ...obj2, ...obj1 };
    console.log(obj);
    return obj;
  }
  /* async uploadImg() {
    // 获取文件流
    const { ctx, config } = this;
    // const stream = await ctx.getFileStream();
    const parts = ctx.multipart({ autoFields: true });
     let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) { // 注意如果没有传入直接返回
        return;
      }
      console.log(stream);
      console.log('=================================================');
      const filedname = stream.filedname;
      console.log(filedname);
      const formData = stream.formData;
      const companyId = stream.companyId;

      // 文件名:随机数+时间戳+原文件后缀
      const filename = Math.random().toString(36).substr(2) + new Date().getTime() + path.extname(stream.filename).toLocaleLowerCase();
      const params = { companyId, formData, invoice: filename };
      // JSON.parse()
      // 图片存放在静态资源public/img文件夹下
      const target = path.resolve(config.uploadPath, filename);
      try {
      // 生成一个文件写入 文件流
        const writeStream = fs.createWriteStream(target);
        // 异步把文件流 写入
        await awaitWriteStream(stream.pipe(writeStream));
      } catch (error) {
      // 如果出现错误，关闭管道,要不然浏览器响应会卡死
        await sendToWormhole(stream);
        throw error;
      }
      return params;
    }
  }*/
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async get() {
    const { ctx } = this;
    const res = await ctx.service.defendproducts.get({ companyId: '人生无极限有限公司' });
    ctx.body = { code: 200, data: res };
  }
  async add() {
    const { ctx } = this;
    const params = await this.uploadImg();
    // const params = ctx.request.body;
    console.log('add里的params');
    console.log(params);
    const res = await ctx.service.defendproducts.add(params);
    ctx.body = { code: 200, data: res };
  }
  async update() {
    const ctx = this.ctx;
    const params = ctx.request.body;
    console.log(params);
    const res = await this.ctx.service.defendproducts.update(params);
    ctx.body = { code: 200, data: res };
  }
  async delete() {
    const { ctx } = this;
    const params = ctx.request.body;
    console.log(params);
    const res = await ctx.service.defendproducts.delete(params);
    ctx.body = { code: 200, data: res };
  }
}

module.exports = DefendProductsController;
