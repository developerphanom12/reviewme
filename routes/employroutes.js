const express = require("express");
const router = express.Router();
const employer = require('../controller/employController');
const { validateEmployersdata, validateeducation, employcompanydetails, employSkilldetails } = require("../validation/joivalidation");
const authenticateToken = require("../authentication/token");


// register route //
router.post('/register',validateEmployersdata,employer.registeremploy);

// login route//
router.post('/login',employer.employlogin);

//--education route ----
router.post('/addeducationdates',authenticateToken, validateeducation ,employer.updateemployeeducation);

//--- add skills --- ///


router.post('/addcompexpreince', authenticateToken, employcompanydetails, employer.updatemployeCmpanydetails)

router.post('/addcompanydetails', authenticateToken, employSkilldetails, employer.updatemployeSKilldetails)

router.get('/getdetailprofile/', authenticateToken, employer.getbyid)
module.exports =router