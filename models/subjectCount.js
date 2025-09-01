const mongoose = require("mongoose");

const subjectCountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    semester: {
        type: Number,
        required: true,
    },
    numberOfSubjects: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const SubjectCount = mongoose.model("SubjectCount", subjectCountSchema);

module.exports = SubjectCount;
