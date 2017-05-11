'use strict';

import mongoose from "mongoose"
import Question from '../../../models/Question'
import Test from '../../../models/Test'

// pagination data pipe
function dataPipe(res) {
  let r
  if (!Array.isArray(res)) {
    r = {}
    r.data = {
      list: res.docs,
      pageNumber: res.page,
      pageSize: res.limit,
      totalRecords: res.total
    }
    return r
  }
  return r = Object.assign([], res)
}

export default (router) => {
  router
    .get("/qtests", async ctx => {
      let query = ctx.query
      let pageNumber = +query.pageNumber, pageSize = +query.pageSize
      if (isNaN(pageNumber) || isNaN(pageSize)) {
        console.log("query type error", query)
        pageNumber = 1
        pageSize = 10
      }
      let qs = await Test.paginate({}, { page: pageNumber, limit: pageSize })
      if (qs) ctx.body = dataPipe(qs)

    })
    .post("/qtest", async ctx => {
      const tags = ctx.request.body.tags
      //TODO:how to generate a test
      let r = Math.random()

      //each test has 10 question
      let qs = await Question.find({
        "tags":{$in:tags},
        // "rand":{$gt: r}
      }).limit(10)
      
      
      if(qs.length<10){
        // let l = 10 - qs.length
        console.log(`questions length err: ${qs.length}`)
      }

      // save questions in test collection
      let t = new Test({questions:qs})
      let res = await t.save()

      ctx.body = { data: res }
    })
    .get("/qtest/:id", async ctx => {
      const id = ctx.params.id
      let q = await Test.findById(id)
      if (q) ctx.body = { data: q }
    })
    .put("/qtest/:id", async ctx => {
      // const id = ctx.params.id
      // const body = ctx.request.body
      // let newDoc = await Question.findByIdAndUpdate(id, body, {
      //   new: true
      // })
      // ctx.body = { data: newDoc }
    })
    .del("/qtest/:id", async ctx => {
      let id = ctx.params.id
      let q = await Test.findByIdAndRemove(id, { select: "id" })
      ctx.body = { data: q }
    })
    // multi delete
    .post("/qtests/del", async ctx => {
      const criteria = ctx.request.body
      let ids = criteria.id;
      let res = await Test.deleteMany({ _id: { $in: ids.map(function (id) { return mongoose.Types.ObjectId(id) }) } })
      ctx.body = { data: res }
    })

}