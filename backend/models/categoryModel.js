const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A category must have a name'],
      trim: true,
      maxlength: [
        60,
        'A category name must have less or equal then 60 characters',
      ],
      minlength: [
        10,
        'A category name must have more or equal then 10 characters',
      ],
    },
    minVote: {
      type: Number,
      required: [true, 'A category must have a minimun number of votes'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A category must have a description'],
    },
    award: {
      type: String,
      required: [true, 'A category must have an award for winner'],
    },
    event: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
      required: [true, 'Category must belong to an event'],
    },
    coordinator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Category must belong to an event'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

categorySchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

categorySchema.virtual('nominees', {
  ref: 'Nominee',
  foreignField: 'category',
  localField: '_id',
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
