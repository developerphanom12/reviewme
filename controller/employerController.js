const bcrypt = require("bcrypt");
const employerservice = require("../service/employerService");
const messages = require("../constants/message");
const { YourSpecificError } = require("../error/error");

const registeremployer = async (req, res) => {
  const { email, password, phone_number } = req.body;

  try {
    const existingUser = await employerservice.getEmployerByName(
      email,
      phone_number
    );
    if (existingUser) {
      return res.status(400).json({
        error: "check your email or phonenumber is already register.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await employerservice.insertEmployer(
      email,
      hashedPassword,
      phone_number
    );

    res.status(messages.EMPLOYER.EMPLOYER_CREATE.status).json({
      message: messages.EMPLOYER.EMPLOYER_CREATE.message,
      status: 201,
      data: userId,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred during employer registration." });
  }
};

const employlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    employerservice.employlogin(email, password, (err, result) => {
      if (err) {
        console.error("Error:", err);
        return res
          .status(500)
          .json({ error: "An internal server error occurred" });
      }

      if (result.error) {
        return res.status(401).json({ error: result.error });
      }

      res.status(messages.EMPLOYER.EMPLOYER_LOGIN_SUCCESS.status).json({
        message: messages.EMPLOYER.EMPLOYER_LOGIN_SUCCESS.message,
        status: 201,
        data: result.data,
        token: result.token,
      });
    });
  } catch (error) {
    console.error("Error logging in employer:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

const addprofiledata = async (req, res) => {
  const userId = req.user.id;
  try {
    if (req.user.role !== "employer") {
      throw {
        status: 403,
        error: "Forbidden. Only employer can see this.",
      };
    }
    const {
      employer_id,
      company_name,
      company_website,
      tagline,
      description,
      sales_email,
      contact_phone,
      total_employe,
      founded_year,
    } = req.body;

    await employerservice.addprofileData({
      employer_id: userId,
      company_name,
      company_website,
      tagline,
      description,
      sales_email,
      contact_phone,
      total_employe,
      founded_year,
    });

    const responseMessage = "add profile data successfull";
    const responseStatus = 201;

    res.status(responseStatus).json({
      message: responseMessage,
      status: responseStatus,
    });
  } catch (error) {
    if (error instanceof YourSpecificError) {
      return res
        .status(400)
        .json({ error: "An error occurred while processing your request." });
    }

    if (error.name === "UnauthorizedError") {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    console.error("Internal Server Error:", error);

    res
      .status(500)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
};

const addAddress = async (req, res) => {
  const userId = req.user.id;
  const userole = req.user.role;
  console.log("userrrororor", userole, userId);

  console.log("useriddd", userId);
  const {
    time_zone,
    phone_number,
    address,
    total_employee,
    employer_id,
    minimum_pojectsize,
    average_hourly,
  } = req.body;

  try {
    if (req.user.role !== "employer") {
      throw {
        status: 403,
        error: "Forbidden. Only employer can see this.",
      };
    }
    const addressData = await employerservice.employerAddress({
      time_zone,
      phone_number,
      address,
      total_employee,
      employer_id: userId,
      minimum_pojectsize,
      average_hourly,
    });

    res.status(201).json({
      message: addressData,
      status: 201,
    });
  } catch (error) {
    console.error("Error adding address:", error);

    if (error.code === "404") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res
        .status(error.status || 500)
        .json({ error: error.message || "Internal Server Error" });
    }
  }
};

const getprofiledata = async (req, res) => {
  try {
    const UserId = req.user.id;
    console.log("sdfsdfsdf", UserId);

    if (!UserId) {
      return res.status(400).json({
        message: "please provide postid",
        status: 400,
      });
    }

    let profile;
    profile = await employerservice.getdataById(UserId);
    console.log(profile);

    if (profile !== null) {
      res.status(201).json({
        message: "data fetched successfully",
        status: 201,
        data: profile,
      });
    } else {
      const responseMessage = "No data found for the provided ID.";
      res.status(404).json({
        message: responseMessage,
        status: 404,
      });
    }
  } catch (error) {
    if (error instanceof YourSpecificError) {
      return res
        .status(400)
        .json({ error: "An error occurred while processing your request." });
    }

    if (error.name === "UnauthorizedError") {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    console.error("Internal Server Error:", error);

    res
      .status(500)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
};


const reviewAdd = async (req, res) => {
  try {
  
    const userId = req.user.id;
    const { rating, employe_type, performance, employ_id } = req.body;

    if (!req.file) {
      return res.status(400).json({
        status:400,
        error: 'attachment_file  file is required.',
      });
    }
    const imagePath = req.file.filename;

    const dataCommnet = await employerservice.addReview({
      company_id: userId,
      attachment_file: imagePath,
      rating,
      employe_type,
      performance,
      employ_id
    });

    res.status(201).json({
      message: dataCommnet,
      status: 201,
    });
  } catch (error) {
    if (error instanceof YourSpecificError) {
      return res.status(400).json({ error: 'An error occurred while processing your request.' });
    }

    if (error.name === 'UnauthorizedError') {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    console.error('Internal Server Error:', error);

    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  }
};




module.exports = {
  registeremployer,
  employlogin,
  addprofiledata,
  addAddress,
  getprofiledata,
  reviewAdd
};
