import mongoose from 'mongoose'

const ProfilesSchema = new mongoose.Schema({
    accountId: { type: String, required: true},
    profiles: {type: Object, required: true},
    created: {type: Date, required: true},
    access_token: {type: String, default: ""},
    refresh_token: {type: String, default: ""},
},
{
    collection: "profiles"
})

const Profiles = mongoose.model("Profiles", ProfilesSchema);

export default Profiles;
