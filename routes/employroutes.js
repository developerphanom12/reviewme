const express = require("express");
const router = express.Router();
const employer = require('../controller/employController');
const { validateEmployersdata, validateeducation } = require("../validation/joivalidation");
const authenticateToken = require("../authentication/token");


// register route //
router.post('/register',validateEmployersdata,employer.registeremploy);

// login route//
router.post('/login',employer.employlogin);

//--education route ----
router.post('/addeducationdates',authenticateToken, validateeducation ,employer.updateemployeeducation);

//--- add skills --- ///
router.post('/addskills', authenticateToken, validateeducation, employer.employlogin)




module.exports =router