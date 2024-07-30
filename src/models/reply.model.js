import mongoose from "mongoose";

const replySchema = mongoose.Schema({
    replyAuthor: {
        type: String
    },
    replyText: {
        type: String,
        required: true
    },
    replyDate: {
        type: String
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    }
}, {timestamps: true})

const Reply = mongoose.model("Reply", replySchema);

export default Reply