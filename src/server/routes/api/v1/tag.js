'use strict';
import mongoose from 'mongoose'
import Tag from '../../../models/Tag';

export default (router) => {
  router
    .get("/tags", async ctx => {
      let ts = await Tag.find({})
      if (ts) {
        ctx.body = { data: ts }
        // ctx.data = ts
      }
    })
    .get("/tag/:id", async ctx => {
      const id = ctx.params.id
      let t = await Tag.findById(id)
      if (t) ctx.body = t
    })
    .post("/tag", async ctx => {
      const body = ctx.request.body
      let t = new Tag(body)
      let res = await t.save()
      ctx.body = { data: res }
    })
    .put("/tag/:id", async ctx => {
      const id = ctx.params.id
      const body = ctx.request.body
      let newDoc = await Tag.findByIdAndUpdate(id, body, {
        new: true
      })
      ctx.body = newDoc
    })
    .del("/tag/:id", async ctx => {
      let id = ctx.params.id
      let t = await Tag.findByIdAndRemove(id, { select: "id" })
      if (t.id) t.status = "ok"
      ctx.body = t
    })
    // multi delete
    .post("/tags/del", async ctx => {
      const criteria = ctx.request.body
      let ids = criteria.id;//id array
      let res = await Tag.deleteMany({ _id: { $in: ids.map(function (id) { return mongoose.Types.ObjectId(id) }) } })
      ctx.body = { data: res }
    })

}
