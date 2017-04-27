'use strict';
// can this use the save Question model file?

import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

const TestSchema = new mongoose.Schema({
  questions: {
    type: Array,
    required: true
  }
}, {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  });

TestSchema.plugin(mongoosePaginate)

const Test = mongoose.model('Test', TestSchema)


export default Test
