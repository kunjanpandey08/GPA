const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
        Subject: {
            type: String,
            required: true,
        },
        Grade: {
            type: String,
            required: true,
        },
        Credit: {
            type: Number,
            required: true
        },
        Semester: {
            type: Number,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
} , { timestamps:true } );

const subjects = mongoose.model("subjects", subjectSchema);

module.exports = subjects;