const  Joi = require('joi');

const createEmployerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[@]).{5,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase or uppercase letter, and the @ symbol. Length shoulb be 5 charracter ',
        }),
        
    phone_number: Joi.number().required(),
    first_name: Joi.string().required(),
    last_name : Joi.string().required(),
    gender : Joi.string().valid('male', 'female','other').required()
});



const educationemployupdate = Joi.object({
  school : Joi.string().required(),
  degree  : Joi.string().required(),
  start_date : Joi.date().required(),
  end_date: Joi.date().required(),
  grade :Joi.string().required(),
  typeof_grade : Joi.string().valid('percentage', 'cgpa')
})




const validateeducation = (req,res,next) =>{
  const {error} = educationemployupdate.validate(req.body);
  if(error){
    return res.status(400).json({error : error.details[0].message})
  }
  next();
}


const employCOmpanyDetails = Joi.object({
  title : Joi.string().required(),
  employment_type : Joi.string().valid('fulltime','part_time','self_employe', 'freelance','internship', 'traineee'),
  company_name : Joi.string().required(),
  location : Joi.string().required(),
  location_type : Joi.string().valid('on_site','hybrid', 'remote').required(),
  exprience	: Joi.string().valid('yes', 'no').required(),
  start_date : Joi.date().required(),
  end_date : Joi.date().optional(),
  descriptiobn : Joi.string().optional()
})


const employcompanydetails = (req,res,next) =>{
  const {error} = employCOmpanyDetails.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};







const validateEmployersdata = (req, res, next) => {

  const { error } = createEmployerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};




module.exports = {
    validateEmployersdata,
    validateeducation,
    employcompanydetails
}