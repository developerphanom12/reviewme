const express = require("express");
const router = express.Router();
const employer = require('../controller/employerController');
const { validateEmployersdata, validateschema1, ValidateCOmpanyProfile, ValidateAssress, ValidateReview } = require("../validation/joivalidation");
const authenticateToken = require("../authentication/token");
const { upload } = require("../middleware/multer");

router.post('/registerss',validateschema1,employer.registeremployer)


router.post('/login',employer.employlogin)

router.post('/addprofile',authenticateToken, ValidateCOmpanyProfile,employer.addprofiledata)

router.post('/addAddress',ValidateAssress,authenticateToken,employer.addAddress)

router.get('/getprofiledata',authenticateToken,employer.getprofiledata)

router.post('/addComment',authenticateToken,upload.single('attachment_file'), ValidateReview,employer.reviewAdd) 


module.exports =router 