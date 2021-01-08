class RequestInputError extends Error {
    constructor(message, code = 'RequestInputError') {
        super(message);
        this.error_code = code;
    }
}

class ReachedTimeLimitError extends Error {
    constructor(message, code = 'ReachedTimeLimitError') {
        super(message);
        this.error_code = code;
    }
}

module.exports = {
    RequestInputError,
    ReachedTimeLimitError
};