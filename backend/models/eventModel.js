const mongoose = require('mongoose');
const slugify = require('slugify');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A event must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        60,
        'A event name must have less or equal then 60 characters',
      ],
      minlength: [
        10,
        'A event name must have more or equal then 10 characters',
      ],
    },
    slug: String,
    coordinator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Event must belong to a user'],
      unique: true,
    },
    duration: {
      type: Date,
      required: [true, 'A event must have a duration of votes'],
    },
    price: {
      type: Number,
      required: [true, 'A event must have a price per vote'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A event must have a description'],
    },
    image: {
      type: String,
      required: [true, 'A event must have a cover image'],
    },
    date: {
      type: Date,
      required: [true, 'A event must have a date of event'],
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

eventSchema.index({ name: 1, unique: true });
eventSchema.index({ coordinator: 1, unique: true });
eventSchema.index({ slug: 1 });

eventSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

eventSchema.virtual('categories', {
  ref: 'Category',
  foreignField: 'event',
  localField: '_id',
});

eventSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
