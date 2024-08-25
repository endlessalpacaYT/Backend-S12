import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    created: { type: Date, required: true },
    accountId: { type: String, required: true },
    displayName: { type: String, required: true},
    email: { type: String, required: true },
    password: { type: String, required: true},
}, {
    collection: "users"
});


const User = mongoose.model("users", UserSchema)

export default User;