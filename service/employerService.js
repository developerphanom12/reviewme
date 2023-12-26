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

function getdataById(UserId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
          c.id,
          c.company_name,
          c.company_website,
          c.tagline,
          c.description,
          c.sales_email,
          c.contact_phone,
          c.total_employe,
          c.founded_year,
          a.employer_id AS employer_id,
          a.time_zone,
          a.phone_number,
          a.address,
          a.total_employee,
          a.minimum_pojectsize,
          a.average_hourly
          FROM companyprofile c
      LEFT JOIN location a ON c.employer_id = a.employer_id
      WHERE c.employer_id = ?;`;

    db.query(query, UserId, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        reject(error);
      } else {
        if (results.length > 0) { 
          const profile = {
            id: results[0].id,
            company_name: results[0].company_name,
            company_website: results[0].company_website,
            tagline: results[0].tagline,
            description: results[0].description,
            sales_email: results[0].sales_email,
            contact_phone: results[0].contact_phone,
            total_employe: results[0].total_employe,
            founded_year: results[0].founded_year,
            address: {
              employer_id: results[0].employer_id,
              time_zone: results[0].time_zone,
              phone_number: results[0].phone_number,
              address: results[0].address,
              total_employee: results[0].total_employee,
              minimum_pojectsize: results[0].minimum_pojectsize,
              average_hourly: results[0].average_hourly
            },
          };

          resolve(profile);

          console.log('All data retrieved successfully');
        } else {
          resolve(null);
          console.log('No data found for the given UserId');
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
    employerAddress,
    getdataById
};
