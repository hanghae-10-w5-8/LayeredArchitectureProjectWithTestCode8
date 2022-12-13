const errorLogger = (error, request, response, next) => {
    next(error); // errorLogger -> errorHandler
};

const errorHandler = (error, req, res, next) => {
    let status = error.status || 400;
    let message = error.message;
    if (error.name === 'SequelizeValidationError') {
        status = 500;
        message = 'Internal Server Error';
    }
    res.status(status);
    res.json({ errorMessage: message });
};

module.exports = { errorLogger, errorHandler };
