module.exports = {
    COMMON: {
        INVALID_ID: {
            message: "Invalid id",
            status: 400
        }
    },

    EMPLOYER: {
        EMPLOYER_CREATE: {
            message: "EMPLOYER CREATE SUCCESSFULLY",
            status: 201
        },

       
        EMPLOYER_LOGIN_SUCCESS: {
            message: " EMPLOYER LOGIN SUCCESSFULLY",
            status: 201
        },

        
        EMPLOYER_LOGIN_ERROR: {
            message: " ERRO WHILE LOGIN",
            status: 401
        },

        EMPLOYER_INCORRECT_PASSWORD: {
            message: " INCORRECT PASSWORD",
            status: 401
        },

        EMPLOYER_NOT_FOUND: {
            message: "EMPLOYER NOT FOUND",
            status: 401
        },
    }
}