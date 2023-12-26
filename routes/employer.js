const express = require("express");
const router = express.Router();
const employer = require('../controller/employerController');
const { validateEmployersdata, validateschema1, ValidateCOmpanyProfile, ValidateAssress } = require("../validation/joivalidation");
const authenticateToken = require("../authentication/token");

router.post('/registerss',validateschema1,employer.registeremployer)


router.post('/login',employer.employlogin)

router.post('/addprofile',authenticateToken, ValidateCOmpanyProfile,employer.addprofiledata)

router.post('/addAddress',ValidateAssress,authenticateToken,employer.addAddress)

module.exports =router 