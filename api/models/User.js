import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: String,
    email: { type: String, unique: true },
    followers: [{ type: String }],
    following: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;
