const express = require("express");
const router = express.Router();
const employer = require('../controller/employerController');
const { validateEmployersdata } = require("../validation/joivalidation");

router.post('/registerss',validateEmployersdata,employer.registeremployer)


router.post('/login',employer.employlogin)


module.exports =router