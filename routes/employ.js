const express = require("express");
const router = express.Router();
const employer = require('../controller/employController');
const { validateEmployersdata } = require("../validation/joivalidation");

router.post('/register',validateEmployersdata,employer.registeremploy)


router.post('/login',employer.employlogin)


module.exports =router