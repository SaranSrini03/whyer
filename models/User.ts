import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  dob: Date;
  password: string;

  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];

  questionsCount: number;
  pulsesCount: number;

  createdAt: Date;
  updatedAt: Date;

  followersCount?: number; // from virtual
  followingCount?: number; // from virtual
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    dob: { type: Date },
    password: { type: String, required: true },

    followers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],

    questionsCount: { type: Number, default: 0 },
    pulsesCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals for follower/following counts
UserSchema.virtual('followersCount').get(function (this: IUser) {
  return this.followers.length;
});

UserSchema.virtual('followingCount').get(function (this: IUser) {
  return this.following.length;
});

// Final export
const User = models.User || model<IUser>('User', UserSchema);
export default User;
