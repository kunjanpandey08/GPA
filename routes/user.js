const express = require("express");
const {handleUserSignup,handleUserLogin} = require("../controllers/user");
const router = express.Router();

router.post('/',handleUserSignup);
router.post('/login',handleUserLogin);
router.post('/logout', (req, res) => {
    res.clearCookie('uid');
    return res.redirect('/login');
});
module.exports = router;