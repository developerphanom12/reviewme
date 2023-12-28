const db = require("../config/configration");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function getEmployByName(email, phone_number) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM employe_register WHERE email = ? AND phone_number = ?";
    db.query(query, [email, phone_number], (err, results) => {
      if (err) {
        reject(
          `Error fetching employer by email or phone_number : ${err.message}`
        );
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
}

function insertEmploy(
  email,
  password,
  phone_number,
  first_name,
  last_name,
  gender
) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO employe_register (email,password, phone_number,first_name,last_name,gender) VALUES (?, ?, ?,?,?,?)";
    db.query(
      query,
      [email, password, phone_number, first_name, last_name, gender],
      (err, result) => {
        if (err) {
          reject(`Error inserting user: ${err.message}`);
        } else {
          resolve(result.insertId);
        }
      }
    );
  });
}

function employlogin(email, password, callback) {
  const query = "SELECT * FROM employe_register WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err) {
      return callback(err, null);
    }

    if (results.length === 0) {
      return callback(null, { error: "employer not found" });
    }

    const user = results[0];

    if (user.is_deleted === 1) {
      return callback(null, { error: "employer not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return callback(null, { error: "Invalid password" });
    }

    const secretKey = "secretkey";
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secretKey
    );

    return callback(null, {
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          token: token,
        },
      },
    });
  });
}

function updateeducation(userId, updatemploye) {
  return new Promise((resolve, reject) => {
    const {
      employe_id,
      school,
      degree,
      start_date,
      end_date,
      grade,
      typeof_grade,
    } = updatemploye;

    const query = `
        INSERT INTO  employe_education_table (employe_id,
          school,degree,
           start_date,
           end_date,
           grade,
           typeof_grade
           ) VALUES (?,?, ?, ?,?,?,?)
      `;

    db.query(
      query,
      [userId, school, degree, start_date, end_date, grade, typeof_grade],
      (error, result) => {
        if (error) {
          reject(error);
          console.log("Error updating employeee:", error);
        } else {
          if (result.affectedRows > 0) {
            const fetchQuery = `
              SELECT * FROM employe_education_table WHERE education_id = ?;
            `;

            db.query(fetchQuery, [userId], (fetchError, fetchResult) => {
              if (fetchError) {
                reject(fetchError);
                logger.error("Error fetching updated employeee:", fetchError);
              } else {
                if (fetchResult.length > 0) {
                  const updatyemployee = fetchResult[0];
                  resolve(updatyemployee);
                  console.log("employeee updated successfully", updatyemployee);
                } else {
                  resolve(null);
                }
              }
            });
          } else {
            resolve(null);
          }
        }
      }
    );
  });
}

function updatecompanydetails(userId, updatemploye) {
  return new Promise((resolve, reject) => {
    const {
      employe_id,
      title,
      employment_type,
      company_name,
      location,
      location_type,
      exprience,
      start_date,
      end_date,
      description,
    } = updatemploye;

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

    db.query(
      query,
      [
        userId,
        title,
        employment_type,
        company_name,
        location,
        location_type,
        exprience,
        start_date,
        end_date,
        description,
      ],
      (error, result) => {
        if (error) {
          reject(error);
          console.log("Error updating employeee:", error);
        } else {
          if (result.affectedRows > 0) {
            const fetchQuery = `
              SELECT * FROM employe_company_details WHERE employe_id = ?;
            `;

            db.query(fetchQuery, [userId], (fetchError, fetchResult) => {
              if (fetchError) {
                reject(fetchError);
                logger.error("Error fetching updated employeee:", fetchError);
              } else {
                if (fetchResult.length > 0) {
                  const updatyemployee = fetchResult[0];
                  resolve(updatyemployee);
                  console.log("employeee updated successfully", updatyemployee);
                } else {
                  resolve(null);
                }
              }
            });
          } else {
            resolve(null);
          }
        }
      }
    );
  });
}

function updateskillsdetails(userId, updatemploye) {
  return new Promise((resolve, reject) => {
    const { employe_id, skills } = updatemploye;

    const query = `
    INSERT INTO employe_skills_details (employe_id, skills)
    VALUES ${skills.map((skill) => "(?, ?)").join(", ")}
`;

    const queryParams = skills.reduce((params, skill) => {
      params.push(userId, skill);
      return params;
    }, []);

    db.query(query, queryParams, (error, result) => {
      if (error) {
        reject(error);
        console.log("Error updating employee:", error);
      } else {
        if (result.affectedRows > 0) {
          const fetchQuery = `
              SELECT * FROM employe_skills_details WHERE employe_id = ?;
            `;

          db.query(fetchQuery, [userId], (fetchError, fetchResult) => {
            if (fetchError) {
              reject(fetchError);
              logger.error("Error fetching updated employeee:", fetchError);
            } else {
              if (fetchResult.length > 0) {
                const updatyemployee = fetchResult[0];
                resolve(updatyemployee);
                console.log("employeee updated successfully", updatyemployee);
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
        console.error("Error executing query:", error);
        reject(error);
        console.error("Error getting employe by ID:", error);
      } else {
        if (results.length === 0) {
          reject(new Error("employe not found"));
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
                  start_date: row.start_date,
                  end_date: row.end_date,
                  description: row.description,
                },
                education: {
                  education_id: row.education_id,
                  school: row.school,
                  degree: row.degree,
                  start_date: row.start_date,
                  end_date: row.end_date,
                  grade: row.grade,
                  typeof_grade: row.typeof_grade,
                },
              };
            }
          });

          resolve(Object.values(employe));
          console.log("employe retrieved by ID successfully");
        }
      }
    });
  });
}

function updateProfile(id, updatedProfileData) {
  return new Promise((resolve, reject) => {
    const {
      email,
      phone_number,
      first_name,
      last_name,
      gender,
      headline,
      school,
      degree,
      start_date,
      end_date,
      grade,
      title,
      employment_type,
      company_name,
      location,
      location_type,
      exprience,
      description,
    } = updatedProfileData;

    const updateQuery = `
          UPDATE employe_register u
          JOIN employe_education_table a ON u.id = a.employe_id
          JOIN employe_company_details au ON u.id = au.employe_id
          SET 
              u.email = COALESCE(?, u.email),
              u.phone_number = COALESCE(?, u.phone_number),
              u.first_name = COALESCE(?, u.first_name),
              u.last_name = COALESCE(?, u.last_name),
              u.gender = COALESCE(?, u.gender),
              u.headline = COALESCE(?, u.headline), 
              a.school = COALESCE(?, a.school),
              a.degree = COALESCE(?, a.degree),
              a.start_date = COALESCE(?, a.start_date),
              a.end_date = COALESCE(?, a.end_date),
              a.grade = COALESCE(?, a.grade),
              au.title = COALESCE(?,au.title),
              au.employment_type = COALESCE(?,au.employment_type),
              au.company_name = COALESCE(?,au.company_name),
              au.location = COALESCE(?,au.location),
              au.location_type = COALESCE(?,au.location_type),
              au.exprience = COALESCE(?,au.exprience),
              au.description = COALESCE(?,au.description)
          WHERE u.id = ?;
      `;
    const values = [
      email,
      phone_number,
      first_name,
      last_name,
      gender,
      headline,
      school,
      degree,
      start_date,
      end_date,
      grade,
      title,
      employment_type,
      company_name,
      location,
      location_type,
      exprience,
      description,
      id,
    ];

    db.query(
      updateQuery,
      values,

      (updateError, updateResult) => {
        if (updateError) {
          reject(updateError);
        } else {
          if (updateResult.affectedRows > 0) {
            const fetchQuery = `
                          SELECT * FROM employe_register u
                          JOIN employe_education_table a ON u.id = a.employe_id
                         JOIN employe_company_details au ON u.id = au.employe_id                          WHERE u.id = ?;
                      `;

            db.query(fetchQuery, [id], (fetchError, fetchResult) => {
              if (fetchError) {
                reject(fetchError);
              } else {
                if (fetchResult.length > 0) {
                  const updatedUserData = fetchResult[0];
                  resolve(updatedUserData);
                } else {
                  resolve(null);
                }
              }
            });
          } else {
            resolve(null);
          }
        }
      }
    );
  });
}

function getcomment(userId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
          c.id as comment_id,
          c.rating,
          c.employe_type,
          c.performance,
          c.attachment_file,
          c.company_id,
          c.employ_id,
          a.id,
          a.first_name,
          au.company_name,
          au.employer_id
      FROM review_employe c
      LEFT JOIN employe_register a ON c.employ_id = a.id
      LEFT JOIN companyprofile au ON c.company_id = au.employer_id
      WHERE c.employ_id = ?;`;

    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        reject(error);
        console.error("Error getting employe by ID:", error);
      } else {
        if (results.length === 0) {
          reject(new Error("employe not found"));
        } else {
          const employe = {};
          results.forEach((row) => {
            if (!employe[row.id]) {
              employe[row.id] = {
                comment_id: row.comment_id,
                first_name: row.first_name,
                rating: row.rating,
                employe_type: row.employe_type,
                performance: row.performance,
                attachment_file: row.attachment_file,
                company: {
                  employer_id: row.employer_id,
                  company_name: row.company_name,
                },
              };
            }
          });

          resolve(Object.values(employe));
          console.log("employe retrieved by ID successfully");
        }
      }
    });
  });
}

function Replycomment(ReplyId) {
  return new Promise((resolve, reject) => {
    const insertSql = `INSERT INTO comment_reply(reply_comment,comment_id,user_id,role) 
                           VALUES (?,?,?,?)`;

    const values = [
      ReplyId.reply_comment,
      ReplyId.comment_id,
      ReplyId.user_id,
      ReplyId.role,
    ];

    db.query(insertSql, values, (error, result) => {
      if (error) {
        console.error("Error reply comment:", error);
        reject(error);
      } else {
        const replyId = result.insertId;

        if (replyId > 0) {
          const successMessage = "add reply comment successful";
          resolve(successMessage);
        } else {
          const errorMessage = "add  reply comment failed";
          reject(errorMessage);
        }
      }
    });
  });
}

const checkCommentId = (comment_id) => {
  return new Promise((resolve, reject) => {
    const checkUserSql = "SELECT * FROM review_employe WHERE id = ?";

    db.query(checkUserSql, [comment_id], (error, result) => {
      if (error) {
        console.error("Error checking user existence:", error);
        reject(error);
      } else {
        resolve(result.length > 0);
      }
    });
  });
};

function getcommentReply(userId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
          c.id as comment_id,
          c.rating,
          c.employe_type,
          c.performance,
          c.attachment_file,
          c.company_id,
          c.employ_id,
          a.id,
          a.first_name,
          au.company_name,
          au.employer_id
      FROM review_employe c
      LEFT JOIN employe_register a ON c.employ_id = a.id
      LEFT JOIN companyprofile au ON c.company_id = au.employer_id
      WHERE c.employ_id = ?;`;

    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        reject(error);
        console.error("Error getting employe by ID:", error);
      } else {
        if (results.length === 0) {
          reject(new Error("employe not found"));
        } else {
          const employe = {};
          results.forEach((row) => {
            if (!employe[row.id]) {
              employe[row.id] = {
                comment_id: row.comment_id,
                first_name: row.first_name,
                rating: row.rating,
                employe_type: row.employe_type,
                performance: row.performance,
                attachment_file: row.attachment_file,
                company: {
                  employer_id: row.employer_id,
                  company_name: row.company_name,
                },
              };
            }
          });

          resolve(Object.values(employe));
          console.log("employe retrieved by ID successfully");
        }
      }
    });
  });
}
async function getbyid(commentId) {
  const query = `
      SELECT
      a.id,
      a.comment_id,
      a.reply_comment,
      a.create_date AS date,
      a.update_date,
      a.role,
      CASE
          WHEN a.role = 'employ' THEN u.id
          WHEN a.role = 'employer' THEN s.employer_id
      END AS user_id,
      CASE
          WHEN a.role = 'employ' THEN u.first_name
          WHEN a.role = 'employer' THEN s.company_name
      END AS user_username
      FROM comment_reply a
      LEFT JOIN employe_register u ON a.user_id = u.id AND a.role = 'employ'
      LEFT JOIN companyprofile s ON a.user_id = s.employer_id AND a.role = 'employer' 
      WHERE a.comment_id = ?`;

  const params = [commentId];

  return new Promise((resolve, reject) => {
      db.query(query, params, (error, results) => {
          if (error) {
              reject(error);
          } else {
              const comments = [];

              results.forEach((row) => {
                  if (row.comment_id !== null && row.reply_comment !== null) {
                      const comment = {
                          comment_id: row.comment_id,
                          reply_comment: row.reply_comment,
                          role: row.role,
                          id: row.user_id,
                          name: row.user_username,
                          date: row.date
                      };
                      comments.push(comment);
                  }
              });

              resolve(comments);
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
  getemployedetail,
  updateProfile,
  getcomment,
  Replycomment,
  checkCommentId,
  getcommentReply,
  getbyid
};
