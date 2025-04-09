export const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    // Handle DynamoDB errors
    if (err.name === 'ResourceNotFoundException') {
        return res.status(404).json({
            success: false,
            message: 'Resource not found',
            error: err.message
        });
    }

    if (err.name === 'ConditionalCheckFailedException') {
        return res.status(409).json({
            success: false,
            message: 'Resource already exists',
            error: err.message
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: err.message
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired',
            error: err.message
        });
    }

    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
