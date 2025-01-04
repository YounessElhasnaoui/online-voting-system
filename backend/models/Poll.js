const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Poll question is required'],
    },
    options: [
      {
        text: {
          type: String,
          required: true,
        },
        votes: {
          type: Number,
          default: 0,
        },
      },
    ],
    allowedSelections: {
      type: Number,
      required: true,
      min: [1, 'At least one selection is required'],
    },
    selectionType: {
      type: String,
      enum: ['strict', 'soft'],
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a 'User' model for user authentication
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

// This is optional, but if you want to add additional methods or virtuals, you can add them here
PollSchema.methods.updateTimestamp = function () {
  this.updatedAt = Date.now();
  return this.save();
};

module.exports = mongoose.model('Poll', PollSchema);
