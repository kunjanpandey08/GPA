const mongoose = require("mongoose");

const gpaSchema = new mongoose.Schema({
        Semester: {
            type: Number,
            required: true,
        },
        Gpa: {
            type: Number,
            required: true,
        },
        SemesterCredit: {
            type: Number,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }
} , { timestamps:true } );

const GPA = mongoose.model("GPA", gpaSchema);

module.exports = GPA;