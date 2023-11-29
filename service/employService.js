const db = require('../config/configration');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



function getEmployByName(email,phone_number) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM employe_register WHERE email = ? AND phone_number = ?';
        db.query(query, [email,phone_number], (err, results) => {
            if (err) {
                reject(`Error fetching employer by email or phone_number : ${err.message}`);
            } else {
                resolve(results.length > 0 ? results[0] : null);
            }
        });
    });
}

function insertEmploy(email, password,phone_number) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO employe_register (email,password, phone_number) VALUES (?, ?, ?)';
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

    const query = 'SELECT * FROM employe_register WHERE email = ?';
  
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
  
module.exports = {
    getEmployByName,
    insertEmploy,
    employlogin
};
