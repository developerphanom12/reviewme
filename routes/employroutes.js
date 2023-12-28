const express = require("express");
const router = express.Router();
const employer = require('../controller/employController');
const { validateEmployersdata, validateeducation, employcompanydetails, employSkilldetails, validUpdateEmploye, ValidateReplyComment } = require("../validation/joivalidation");
const authenticateToken = require("../authentication/token");


router.post('/register',validateEmployersdata,employer.registeremploy);

router.post('/login',employer.employlogin);

router.post('/addeducationdates',authenticateToken, validateeducation ,employer.updateemployeeducation);

router.post('/addcompexpreince', authenticateToken, employcompanydetails, employer.updatemployeCmpanydetails)

router.post('/addcompanydetails', authenticateToken, employSkilldetails, employer.updatemployeSKilldetails)

router.get('/getdetailprofile/', authenticateToken, employer.getbyid)

router.put('/updateProfile',validUpdateEmploye, authenticateToken, employer.updateProfile)

router.get('/getcomment', authenticateToken , employer.getcommentbyID)

router.post('/replycomment', authenticateToken , ValidateReplyComment,employer.replycomment)

router.get('/getcomment/:commentId', authenticateToken, employer.getbyidcmnt)


module.exports =router