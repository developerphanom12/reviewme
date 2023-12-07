const db = require('../config/configration');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



function getEmployByName(email, phone_number) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM employe_register WHERE email = ? AND phone_number = ?';
    db.query(query, [email, phone_number], (err, results) => {
      if (err) {
        reject(`Error fetching employer by email or phone_number : ${err.message}`);
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
}

function insertEmploy(email, password, phone_number, first_name, last_name, gender) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO employe_register (email,password, phone_number,first_name,last_name,gender) VALUES (?, ?, ?,?,?,?)';
    db.query(query, [email, password, phone_number, first_name, last_name, gender], (err, result) => {
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




function updateeducation(userId, updatemploye) {
  return new Promise((resolve, reject) => {
    const { employe_id, school, degree, start_date, end_date, grade, typeof_grade } = updatemploye;

    const query = `
        INSERT INTO  employe_education_table (employe_id,
          school,degree,
           start_date,
           end_date,
           grade,
           typeof_grade
           ) VALUES (?,?, ?, ?,?,?,?)
      `;


    db.query(query, [userId, school, degree, start_date, end_date, grade, typeof_grade], (error, result) => {
      if (error) {
        reject(error);
        console.log('Error updating employeee:', error);
      } else {
        if (result.affectedRows > 0) {

          const fetchQuery = `
              SELECT * FROM employe_education_table WHERE education_id = ?;
            `;

          db.query(fetchQuery, [userId], (fetchError, fetchResult) => {
            if (fetchError) {
              reject(fetchError);
              logger.error('Error fetching updated employeee:', fetchError);
            } else {
              if (fetchResult.length > 0) {
                const updatyemployee = fetchResult[0];
                resolve(updatyemployee);
                console.log('employeee updated successfully', updatyemployee);
              } else {
                resolve(null);
              }
            }
          });
        } else {
          resolve(null);
        }
      }
    });
  });
}


function updatecompanydetails(userId, updatemploye) {
  return new Promise((resolve, reject) => {
    const { employe_id, title, employment_type, company_name, location, location_type, exprience, start_date, end_date, description } = updatemploye;

    const query = `
        INSERT INTO  employe_company_details (employe_id,
          title,employment_type,
           company_name,
           location,
           location_type,
           exprience,
           start_date,
           end_date,
           description
           ) VALUES (?,?, ?, ?,?,?,?,?,?,?)
      `;


    db.query(query, [userId, title, employment_type, company_name, location, location_type, exprience, start_date, end_date, description], (error, result) => {
      if (error) {
        reject(error);
        console.log('Error updating employeee:', error);
      } else {
        if (result.affectedRows > 0) {

          const fetchQuery = `
              SELECT * FROM employe_company_details WHERE employe_id = ?;
            `;

          db.query(fetchQuery, [userId], (fetchError, fetchResult) => {
            if (fetchError) {
              reject(fetchError);
              logger.error('Error fetching updated employeee:', fetchError);
            } else {
              if (fetchResult.length > 0) {
                const updatyemployee = fetchResult[0];
                resolve(updatyemployee);
                console.log('employeee updated successfully', updatyemployee);
              } else {
                resolve(null);
              }
            }
          });
        } else {
          resolve(null);
        }
      }
    });
  });
}

function updateskillsdetails(userId, updatemploye) {
  return new Promise((resolve, reject) => {
    const { employe_id, skills } = updatemploye;

    const query = `
    INSERT INTO employe_skills_details (employe_id, skills)
    VALUES ${skills.map(skill => '(?, ?)').join(', ')}
`;

    const queryParams = skills.reduce((params, skill) => {
      params.push(userId, skill);
      return params;
    }, []);

    db.query(query, queryParams, (error, result) => {
      if (error) {
        reject(error);
        console.log('Error updating employee:', error);
      } else {
        if (result.affectedRows > 0) {

          const fetchQuery = `
              SELECT * FROM employe_skills_details WHERE employe_id = ?;
            `;

          db.query(fetchQuery, [userId], (fetchError, fetchResult) => {
            if (fetchError) {
              reject(fetchError);
              logger.error('Error fetching updated employeee:', fetchError);
            } else {
              if (fetchResult.length > 0) {
                const updatyemployee = fetchResult[0];
                resolve(updatyemployee);
                console.log('employeee updated successfully', updatyemployee);
              } else {
                resolve(null);
              }
            }
          });
        } else {
          resolve(null);
        }
      }
    });
  });
}
module.exports = {
  getEmployByName,
  insertEmploy,
  employlogin,
  updateeducation,
  updatecompanydetails,
  updateskillsdetails
};
