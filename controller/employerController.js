const bcrypt = require('bcrypt')
const employerservice = require('../service/employerService')
const messages = require('../constants/message')



const registeremployer = async (req, res) => {
    const { email, password, phone_number} = req.body;
  
    try {
        
      const existingUser = await employerservice.getEmployerByName(email,phone_number);
      if (existingUser) {
        return res.status(400).json({ error: 'check your email or phonenumber is already register.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const userId = await employerservice.insertEmployer(
        email,
        hashedPassword,
        phone_number,
      );
  
      res.status(messages.EMPLOYER.EMPLOYER_CREATE.status).json({
        message: messages.EMPLOYER.EMPLOYER_CREATE.message,
        status: 201,
        data: userId,
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



module.exports = {
    registeremployer,
    employlogin
}