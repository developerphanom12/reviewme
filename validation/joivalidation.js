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
  employment_type : Joi.string().valid('fulltime','part_time','self_employe', 'freelance','internship', 'traineee').required(),
  company_name : Joi.string().required(),
  location : Joi.string().required(),
  location_type : Joi.string().valid('on_site','hybrid', 'remote').required(),
  exprience	: Joi.string().valid('yes', 'no').required(),
  start_date : Joi.date().required(),
  end_date : Joi.date().optional(),
  description : Joi.string().optional()
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




const employskilldetails = Joi.object({
  skills: Joi.array().items(Joi.string()).required(),

})


const employSkilldetails = (req, res, next) => {

  const { error } = employskilldetails.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const createEmployerSchema1 = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[@]).{5,}$'))
      .required()
      .messages({
          'string.pattern.base': 'Password must contain at least one lowercase or uppercase letter, and the @ symbol. Length shoulb be 5 charracter ',
      }),
      
  phone_number: Joi.number().required(),
 
});


const validateschema1 = (req, res, next) => {

  const { error } = createEmployerSchema1.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};



const addcompanyprofiledetails = Joi.object({
  company_name : Joi.string().required(),
  company_website : Joi.string().required(),
  tagline : Joi.string(),
  description : Joi.string().required(),
  sales_email : Joi.string().email().required(),
  contact_phone : Joi.number().required(),
  total_employe:Joi.number().required(),
  founded_year : Joi.date().required(),
  })


const ValidateCOmpanyProfile = (req,res,next) =>{
  const {error} = addcompanyprofiledetails.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};


const addAddress= Joi.object({
  time_zone : Joi.string().required(),
  phone_number : Joi.number().required(),
  address : Joi.string().required(),
  total_employee : Joi.number().required(),
  minimum_pojectsize : Joi.number().required(),
  average_hourly : Joi.number().required()
  })


const ValidateAssress = (req,res,next) =>{
  const {error} = addAddress.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};


const updateemployedata = Joi.object({
  email: Joi.string().email().optional(),
  phone_number: Joi.number().optional(),
  first_name: Joi.string().optional(),
  last_name : Joi.string().optional(),
  gender : Joi.string().valid('male', 'female','other').optional(),
  title : Joi.string().optional(),
  employment_type : Joi.string().valid('fulltime','part_time','self_employe', 'freelance','internship', 'traineee').optional(),
  company_name : Joi.string().optional(),
  location : Joi.string().optional(),
  location_type : Joi.string().valid('on_site','hybrid', 'remote').optional(),
  exprience	: Joi.string().valid('yes', 'no').optional(),
  start_date : Joi.date().optional(),
  end_date : Joi.date().optional(),
  description : Joi.string().optional(),
  school : Joi.string().optional(),
  degree  : Joi.string().optional(),
  start_date : Joi.date().optional(),
  end_date: Joi.date().optional(),
  grade :Joi.string().optional(),
  typeof_grade : Joi.string().valid('percentage', 'cgpa').optional()
})


const validUpdateEmploye = (req,res,next) =>{
  const {error} = updateemployedata.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};




module.exports = {
    validateEmployersdata,
    validateeducation,
    employcompanydetails,
    employSkilldetails,
    validateschema1,
    ValidateCOmpanyProfile,
    ValidateAssress,
    validUpdateEmploye
}