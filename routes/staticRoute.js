const express = require('express');
const gpa = require("../models/gpa");
const SemesterCount = require('../models/semesterCount');
const router = express.Router();

router.get('/' ,async(req,res)=>{
    if(!req.user) return res.redirect('/login')
    const userId = req.user._id;
    const semesterCountDoc = await SemesterCount.findOne({userId});
    let semesterCount = semesterCountDoc ? semesterCountDoc.numberOfSemesters : null;
    // Fetch all GPA docs for this user
    const gpaDocs = await gpa.find({userId});
    let cgpa = null;
    if (gpaDocs && gpaDocs.length > 0) {
        let totalWeightedGpa = 0;
        let totalCredits = 0;
        gpaDocs.forEach(doc => {
            totalWeightedGpa += doc.Gpa * doc.SemesterCredit;
            totalCredits += doc.SemesterCredit;
        });
        cgpa = totalCredits ? (totalWeightedGpa / totalCredits).toFixed(2) : null;
    }
    return res.render("dashboard",{
        semesterCount: semesterCount,
        cgpa: cgpa
    });
})

router.get('/signup', async(req,res)=>{
    return res.render("signup");
})

router.get('/login', async(req,res)=>{
    return res.render("login");
})


module.exports = router;