//Manejo de errores para express
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Respuesta de error genérica
    res.status(err.statusCode || 500).json({
        error: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;