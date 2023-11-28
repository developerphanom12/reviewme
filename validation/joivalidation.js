const  Joi = require('joi');

const createEmployerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[@]).{5,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase or uppercase letter, and the @ symbol. Length shoulb be 5 charracter ',
        }),
        
    phone_number: Joi.string().required(),
});


const validateEmployersdata = (req, res, next) => {

  const { error } = createEmployerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};




module.exports = {
    validateEmployersdata
}