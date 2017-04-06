'use strict';
import Question from '../../../models/Question';
import mongoose from "mongoose"

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
    .get('/', async ctx => {
      ctx.body = { msg: "hello world" }
    })
    .get("/questions", async ctx => {
      let query = ctx.query
      let pageNumber = +query.pageNumber, pageSize = +query.pageSize
      if (isNaN(pageNumber) || isNaN(pageSize)) {
        console.log("query type error", query)
        pageNumber = 1
        pageSize = 10
      }
      let qs = await Question.paginate({}, { page: pageNumber, limit: pageSize })
      if (qs) ctx.body = dataPipe(qs)

    })
    .post("/question", async ctx => {
      const body = ctx.request.body
      let q = new Question(body)
      let res = await q.save()
      ctx.body = { data: res }
    })
    .get("/question/:id", async ctx => {
      const id = ctx.params.id
      let q = await Question.findById(id)
      if (q) ctx.body = { data: q }
    })
    .put("/question/:id", async ctx => {
      const id = ctx.params.id
      const body = ctx.request.body
      let newDoc = await Question.findByIdAndUpdate(id, body, {
        new: true
      })
      ctx.body = { data: newDoc }
    })
    .del("/question/:id", async ctx => {
      let id = ctx.params.id
      console.log(id)
      let q = await Question.findByIdAndRemove(id, { select: "id" })
      ctx.body = { data: q }
    })
    // multi delete
    .post("/questions/del", async ctx => {
      const criteria = ctx.request.body
      console.log(criteria)
      let ids = criteria.id;
      let res = await Question.deleteMany({ _id: { $in: ids.map(function(id){return mongoose.Types.ObjectId(id)}) } })
      console.log(res)
      ctx.body = {data:res}
    })

}

  // $.ajax({
  // url:"http://localhost:4000/api/question",
  // type:"post",
  // data:{
  // question:"asd",
  // options:[1,2,3,4],
  // correct:1,
  // tags:[1,2],
  // whatever:"qwe"
  // }
  // })