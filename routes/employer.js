const express = require("express");
const router = express.Router();
const employer = require('../controller/employerController');
const { validateEmployersdata, validateschema1 } = require("../validation/joivalidation");

router.post('/registerss',validateschema1,employer.registeremployer)


router.post('/login',employer.employlogin)


module.exports =router