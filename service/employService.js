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



function getemployedetail(userId) {
  return new Promise((resolve, reject) => {
      const query = `
      SELECT 
          c.id,
          c.first_name,
          c.last_name,
          c.phone_number,
          c.email,
          c.gender,
          a.education_id,
          a.employe_id AS id,
          a.school,
          a.degree,
          a.start_date,
          a.end_date,
          a.grade,
          a.typeof_grade,
          u.employe_id AS id,
          u.title,
          u.employment_type,
          u.location,
          u.location_type,
          u.exprience,
          u.start_date,
          u.end_date,
          u.description
      FROM employe_register c
      LEFT JOIN employe_company_details u ON c.id = u.employe_id
      LEFT JOIN employe_education_table a ON c.id = a.employe_id
      WHERE c.id = ?;`;

      db.query(query, [userId], (error, results) => {
          if (error) {
              console.error('Error executing query:', error);
              reject(error);
              console.error('Error getting employe by ID:', error);
          } else {
              if (results.length === 0) {
                  reject(new Error('employe not found'));
              } else {
                  const employe = {};
                  results.forEach((row) => {
                      if (!employe[row.id]) {
                        employe[row.id] = {
                              id: row.id,
                              first_name: row.first_name,
                              last_name: row.last_name,
                              phone_number: row.phone_number,
                              email: row.email,
                              gender: row.gender,
                              company: {
                                  company_id: row.company_id,
                                  employment_type: row.employment_type,
                                  location: row.location,
                                  location_type: row.location_type,
                                  exprience: row.exprience,
                                  start_date : row.start_date,
                                  end_date: row.end_date,
                                  description : row.description
                              },
                              education : {
                                education_id: row.education_id,
                                school : row.school,
                                degree : row.degree,
                                start_date : row.start_date,
                                end_date : row.end_date,
                                grade : row.grade,
                                typeof_grade : row.typeof_grade
                              }
            
                          };
                      }

                     
                  });

                  resolve(Object.values(employe));
                  console.log('employe retrieved by ID successfully');
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
  updateskillsdetails,
  getemployedetail
};
