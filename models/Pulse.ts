import mongoose, { Schema, models, model } from 'mongoose';

const ReplySchema = new Schema({
    content: String,
    createdAt: { type: Date, default: Date.now }
});

// models/Pulse.ts
const PulseSchema = new mongoose.Schema({
  whyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Why', required: true },
  replies: [
    {
      content: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });



export default models.Pulse || model('Pulse', PulseSchema);
