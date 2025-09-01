const mongoose = require("mongoose");

const semesterCountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    numberOfSemesters: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const SemesterCount = mongoose.model("SemesterCount", semesterCountSchema);

module.exports = SemesterCount;
