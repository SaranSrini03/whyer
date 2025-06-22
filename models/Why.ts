import mongoose from 'mongoose';

const WhySchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: String,        // 👈 embed for direct access
    userUsername: String,    // 👈 embed for direct access
  },
  { timestamps: true }
);

export default mongoose.models.Why || mongoose.model('Why', WhySchema);
