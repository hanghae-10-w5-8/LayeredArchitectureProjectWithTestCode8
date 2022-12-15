const errorLogger = (error, request, response, next) => {
    console.error(error);
    next(error);
};

const errorHandler = (error, req, res, next) => {
    if (error.name.includes('Sequelize')) {
        res.status(500).json({ errorMessage: 'Internal Server Error' });
    }
    res.status(error.status || 400).json({ errorMessage: error.message });
};

module.exports = { errorLogger, errorHandler };
