const db = require('../config/configration');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



function getEmployerByName(email,phone_number) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM employer_register WHERE email = ? AND phone_number = ?';
        db.query(query, [email,phone_number], (err, results) => {
            if (err) {
                reject(`Error fetching employer by email or phone_number : ${err.message}`);
            } else {
                resolve(results.length > 0 ? results[0] : null);
            }
        });
    });
}

function insertEmployer(email, password,phone_number) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO employer_register (email,password, phone_number) VALUES (?, ?, ?)';
        db.query(query, [ email, password,phone_number,], (err, result) => {
            if (err) {
                reject(`Error inserting user: ${err.message}`);
            } else {
                resolve(result.insertId);
            }
        });
    });
}




function employlogin(email, password, callback) {

    const query = 'SELECT * FROM employer_register WHERE email = ?';
  
    db.query(query, [email], async (err, results) => {
      if (err) {
        return callback(err, null);
      }
  
      if (results.length === 0) {
        return callback(null, { error: 'employer not found' });
      }
  
      const user = results[0];
  
      if (user.is_deleted === 1) {
        return callback(null, { error: 'employer not found' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return callback(null, { error: 'Invalid password' });
      }
  
      const secretKey = 'secretkey';
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secretKey);
  
      return callback(null, {
        data: {
         
            id: user.id,
            email: user.email,
            role: user.role,
            token: token,
          
        }
      });
    });
  }
  



function addprofileData(profileData) {
  return new Promise((resolve, reject) => {
    const insertSql = `INSERT INTO companyprofile(employer_id, company_name, company_website, tagline, description, sales_email, contact_phone, total_employe, founded_year) 
                           VALUES (?, ?,?,?,?,?,?,?,?)`;

    const values = [
      profileData.employer_id,
      profileData.company_name,
      profileData.company_website,
      profileData.tagline,
      profileData.description,
      profileData.sales_email,
      profileData.contact_phone,
      profileData.total_employe,
      profileData.founded_year,
    ];

    db.query(insertSql, values, (error, result) => {
      if (error) {
        console.error('Error add profile:', error);
        reject(error);
      } else {
        const profileId = result.insertId;

        if (profileId > 0) {
          const successMessage = 'add profile successful';
          resolve(successMessage);
        } else {
          const errorMessage = 'add profile failed';
          reject(errorMessage);
        }
      }
    });
  });
}



function employerAddress(employAddress) {
  return new Promise((resolve, reject) => {
    const insertSql = `INSERT INTO location( time_zone,phone_number,address,total_employee,employer_id,minimum_pojectsize,average_hourly) 
                           VALUES (?, ?,?,?,?,?,?)`;

    const values = [
      employAddress.time_zone,
      employAddress.phone_number,
      employAddress.address,
      employAddress.total_employee,
      employAddress.employer_id,
      employAddress.minimum_pojectsize,
      employAddress.average_hourly
    ];

    db.query(insertSql, values, (error, result) => {
      if (error) {
        console.error("Error adding ticket:", error);
        reject(error);
      } else {
        const addressId = result.insertId;

        if (addressId > 0) {
          const successMessage = "Address added successfully";
          resolve(successMessage);
        } else {
          const errorMessage = "add address failed";
          reject(errorMessage);
        }
      }
    });
  });
}

module.exports = {
    getEmployerByName,
    insertEmployer,
    employlogin,
    addprofileData,
    employerAddress
};
