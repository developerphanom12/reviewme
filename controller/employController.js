const bcrypt = require('bcrypt')
const employerservice = require('../service/employService')
const messages = require('../constants/message')



const registeremploy = async (req, res) => {
    const { email, password, phone_number,first_name,last_name,gender} = req.body;
  
    try {
        
      const existingUser = await employerservice.getEmployByName(email,phone_number,);
      if (existingUser) {
        return res.status(400).json({ error: 'check your email or phonenumber is already register.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const userId = await employerservice.insertEmploy(
        email,
        hashedPassword,
        phone_number,
        first_name,
        last_name,
        gender
      );
  
      res.status(messages.EMPLOYER.EMPLOYER_CREATE.status).json({
        message: messages.EMPLOYER.EMPLOYER_CREATE.message,
        status: 201,
        data: {id : userId},
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred during employer registration.' });
    }
  };
  



const employlogin = async(req,res) => {
    try {
      const { email, password } = req.body;
  
      employerservice.employlogin(email, password, (err, result) => {
        if (err) {
          console.error('Error:', err);
          return res.status(500).json({ error: 'An internal server error occurred' });
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
      console.error('Error logging in employer:', error);
      res.status(500).json({ error: 'An internal server error occurred' });
    }


}




const updateemployeeducation = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
console.log("userid and userrole", userId,userRole)
  try {
      if (userRole === 'employ') {
        const { employe_id,school, degree, 	start_date,end_date, grade ,typeof_grade} = req.body;
          const updateemploye = await employerservice.updateeducation(userId, {
           employe_id: userId,
            school,
            degree,
            start_date,
            end_date,
            grade,
            typeof_grade
          }).catch((error) => {
              return res.status(400).json({ error: error.message });
          });

          if (!updateemploye) {
              return res.status(400).json({ error: "employ not found" });
          }

          res.status(200).json({
              message: "employe education data add",
              status:200
          });
      }else{
        res.status(400).json({
          status:400,
          messages : "forbidden for regular user"
        })
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};



const updatemployeCmpanydetails = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
console.log("userid and userrole", userId,userRole)
  try {
      if (userRole === 'employ') {
        const { employe_id, title, employment_type, company_name, location, location_type, exprience,start_date,end_date,description } = req.body;
        const updateemploye = await employerservice.updatecompanydetails(userId, {
           employe_id: userId,
           title,
           employment_type,
           company_name,
           location,
           location_type,
           exprience,
            start_date,
            end_date,
           description
          }).catch((error) => {
              return res.status(400).json({ error: error.message });
          });

          if (!updateemploye) {
              return res.status(400).json({ error: "employ not found" });
          }

          res.status(200).json({
              message: "employe company data add",
              status:200
          });
      }else{
        res.status(400).json({
          status:400,
          messages : "forbidden for regular user"
        })
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};





const updatemployeSKilldetails = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
console.log("userid and userrole", userId,userRole)
  try {
      if (userRole === 'employ') {
        const { employe_id, skills} = req.body;
        const updateemploye = await employerservice.updateskillsdetails(userId, {
           employe_id: userId,
           skills,
         
          }).catch((error) => {
              return res.status(400).json({ error: error.message });
          });

          if (!updateemploye) {
              return res.status(400).json({ error: "employ not found" });
          }

          res.status(200).json({
              message: "employe company data add",
              status:200
          });
      }else{
        res.status(400).json({
          status:400,
          messages : "forbidden for regular user"
        })
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};




const getbyid = async (req, res) => {

  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'employ id provide please.' });
    }
    const userApplications = await employerservice.getemployedetail(userId);

    if (userApplications.length === 0) {
      return res.status(404).json({ status: 404, message: 'employ not found' });
    }

    res.status(201).json({
      message: 'data feth succesffully with employ id ',
      status: 201,
      data: userApplications,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
    registeremploy,
    employlogin,
    updateemployeeducation,
    updatemployeCmpanydetails,
    updatemployeSKilldetails,
    getbyid
}