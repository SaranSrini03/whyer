import mongoose, { Schema, model, models } from 'mongoose';

const WhySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Why question is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // make required once user system is in
    },
    wires: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wire',
      },
    ],
    tags: [String], // optional: for discoverability
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Why = models.Why || model('Why', WhySchema);
export default Why;
