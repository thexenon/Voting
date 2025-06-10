const mongoose = require('mongoose');

const nomineeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A nominee must have a name'],
      trim: true,
      maxlength: [
        60,
        'A nominee name must have less or equal then 90 characters',
      ],
      minlength: [
        10,
        'A nominee name must have more or equal then 10 characters',
      ],
    },
    votes: {
      type: Number,
      default: 0,
      required: [true, 'A nominee must have a minimun number of votes'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A nominee must have a description'],
    },
    image: {
      type: String,
      required: [true, 'A nominee must have an image'],
    },
    event: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
      required: [true, 'Nominee must belong to an event'],
    },
    coordinator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Nominee must belong to an User'],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Nominee must belong to an category'],
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

nomineeSchema.index({ name: 1, category: 1, event: 1 }, { unique: true });

nomineeSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

nomineeSchema.virtual('categories', {
  ref: 'Nominee',
  foreignField: 'nominee',
  localField: '_id',
});

const Nominee = mongoose.model('Nominee', nomineeSchema);

module.exports = Nominee;
