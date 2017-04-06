'use strict';

import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    default:[],
    required: false,
    index: true,
  },
  correct: {
    type: Number,
    required: true,
  },
  tags:{
    type:Array,
    required:true
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

QuestionSchema.plugin(mongoosePaginate)

const Question = mongoose.model('Question', QuestionSchema)


export default Question
