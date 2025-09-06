const SemesterCount = require("../models/semesterCount");
const subjectsDB = require("../models/subjects")
const SubjectCount = require("../models/subjectCount");
const gpa = require("../models/gpa");

async function handleGenerateSemesters(req, res) {
    const semesterCount = Number(req.body.semesterCount);
    const userId = req.user && req.user._id;
    const cgpa = req.body.cgpa;
    if (!userId) {
        return res.status(401).send("User not authenticated");
    }
    // Upsert semester count for user
    await SemesterCount.findOneAndUpdate(
        { userId },
        { numberOfSemesters: semesterCount },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.render("dashboard", {
        semesterCount: semesterCount,
        cgpa:cgpa,
    });
}

async function handleSubjectCount(req, res) {
    const userId = req.user && req.user._id;
    const { semester, numberOfSubjects } = req.body;
    if (!userId) return res.status(401).send('User not authenticated');
    if (!semester || !numberOfSubjects) return res.status(400).send('Missing data');

    // Upsert subject count for user and semester
    await SubjectCount.findOneAndUpdate(
        { userId, semester },
        { numberOfSubjects },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    // Always delete all previous subjects for this semester and user
    await subjectsDB.deleteMany({ Semester: semester, userId: userId });
    res.redirect(`/dashboard/semester/${semester}`);
}

async function handleUpdateMarks(req, res) {
    const userId = req.user && req.user._id;
    const semester = Number(req.body.semester);
    const numberOfSubjects = Number(req.body.numberOfSubjects);
    console.log(semester,'    ',numberOfSubjects);
    let subjects = [];
    for (let i = 1; i <= numberOfSubjects; i++) {
        const subject = req.body[`subject${i}`];
        console.log(subject);
        const grade = req.body[`grade${i}`];
        const credit = Number(req.body[`credit${i}`]);
        console.log(credit);
        if (subject && grade && credit) {
            await subjectsDB.create({
                Subject: subject,
                Grade: grade,
                Credit: credit,
                Semester: semester,
                userId: userId
            });
            subjects.push({ Subject: subject, Grade: grade, Credit: credit });
        }
    }
    return res.render("semester", {
        semester: semester,
        numberOfSubjects: numberOfSubjects,
        showNumberOfSubjectsForm: false,
        subjects: subjects,
        subjectsSubmitted: true,
    });

}

async function handlePostGpa(req,res) {
    const userId = req.user && req.user._id;
    const semester = Number(req.body.semester);
    const Gpa = Number(req.body.Gpa);
    const totalCredit = Number(req.body.semesterCredit);

    await gpa.create({
        Semester: semester,
        userId: userId,
        Gpa: Gpa,
        SemesterCredit: totalCredit,
    })

    const semesterCountDoc = await SemesterCount.findOne({userId: req.user._id});

    res.redirect("/");
}

module.exports = {
    handleGenerateSemesters,
    handleSubjectCount,
    handleUpdateMarks,
    handlePostGpa,
}