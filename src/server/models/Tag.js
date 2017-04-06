'use strict';

import mongoose from 'mongoose'

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: 'es5'
  }
}, {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  });

const Tag = mongoose.model('Tag', TagSchema)


export default Tag
