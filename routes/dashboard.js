const express = require('express');
const router = express.Router();
const {handleGenerateSemesters,handleSubjectCount,handleUpdateMarks,handlePostGpa} = require('../controllers/dashboard');

router.post('/semester',handleGenerateSemesters);


const subjectsDB = require('../models/subjects');
const SubjectCount = require('../models/subjectCount');

router.get('/semester/:id', async (req, res) => {
	const semester = Number(req.params.id);
	const userId = req.user && req.user._id;
	let Subjects = [];
	let showNumberOfSubjectsForm = true;
	let numberOfSubjects = null;
	let subjectCountDoc = null;
	let subjectsSubmitted = false;
	if (userId) {
		Subjects = await subjectsDB.find({ Semester: semester, userId: userId });
		subjectCountDoc = await SubjectCount.findOne({ userId: userId, semester: semester });
		showNumberOfSubjectsForm = !subjectCountDoc;
		subjectsSubmitted = !Subjects;
		if (subjectCountDoc) {
			numberOfSubjects = subjectCountDoc.numberOfSubjects;
		}
		if (Subjects && Subjects.length > 0) {
            subjectsSubmitted = Subjects.length >= numberOfSubjects;
        } else {
			subjectsSubmitted = false;
		}
	}
	return res.render('semester', {
		semester: semester,
		subjects: Subjects,
		numberOfSubjects,
		showNumberOfSubjectsForm,
		subjectsSubmitted,
	
	});
});

router.post('/subject-count', handleSubjectCount);
router.post('/subjects', handleUpdateMarks);

router.post('/semester/gpa',handlePostGpa);

router.post('/subject-update', async (req, res) => {
	const { subjectId, Subject, Grade, Credit } = req.body;
	await subjectsDB.findByIdAndUpdate(subjectId, { Subject, Grade, Credit });
	// Redirect back to the semester page
	const updatedSubject = await subjectsDB.findById(subjectId);
	res.redirect(`/dashboard/semester/${updatedSubject.Semester}`);
});

module.exports = router;