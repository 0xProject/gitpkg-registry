"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidationError = exports.isInternalServerError = exports.isRevertAPIError = exports.isBadRequestError = exports.isRevertError = exports.isAPIError = exports.isAlertingError = exports.ErrorUtils = void 0;
const HttpStatus = require("http-status-codes");
const errors_1 = require("../errors");
class ErrorUtils {
    constructor(_logger) {
        this._logger = _logger;
    }
    /**
     * Wraps an Error with a JSON human readable reason and status code.
     * Extend this method to add custom error transformations
     */
    // tslint:disable-next-line:prefer-function-over-method
    generateError(err) {
        // handle named errors
        if (isAPIError(err)) {
            const statusCode = err.statusCode;
            // populate more information for BAD_REQUEST errors
            if (isBadRequestError(err)) {
                const code = err.generalErrorCode;
                // populate validation error information
                if (isValidationError(err)) {
                    return {
                        statusCode,
                        errorBody: {
                            code,
                            reason: errors_1.generalErrorCodeToReason[code],
                            validationErrors: err.validationErrors,
                        },
                    };
                }
                else if (isRevertAPIError(err)) {
                    return {
                        statusCode,
                        errorBody: {
                            code,
                            reason: err.name,
                            values: err.values,
                        },
                    };
                }
                else {
                    // if not a validation error, populate the error body with standard bad request text
                    return {
                        statusCode,
                        errorBody: {
                            code,
                            reason: errors_1.generalErrorCodeToReason[code],
                        },
                    };
                }
            }
            else {
                // all named errors that are not BAD_REQUEST
                // preserve the statusCode and populate the error body with standard status text
                return {
                    statusCode,
                    errorBody: {
                        reason: HttpStatus.getStatusText(statusCode),
                    },
                };
            }
        }
        else {
            // coerce unnamed errors into generic INTERNAL_SERVER_ERROR
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errorBody: {
                    reason: err.message,
                },
            };
        }
    }
    /**
     * @returns A middleware handler that catches errors and handles them
     */
    getErrorHandler(alertingFn) {
        return (err, _req, res, next) => {
            // If you call next() with an error after you have started writing the response
            // (for example, if you encounter an error while streaming the response to the client)
            // the Express default error handler closes the connection and fails the request.
            if (res.headersSent) {
                return next(err);
            }
            const { statusCode, errorBody } = this.generateError(err);
            res.status(statusCode).send(errorBody);
            // If the error is an internal error, log it with the stack!
            // All other error responses are logged as part of request logging
            if (isAPIError(err) && isInternalServerError(err)) {
                // hack (xianny): typeorm errors contain the SQL query which breaks the docker char limit and subsequently breaks log parsing
                if (err.query) {
                    err.query = undefined;
                }
                this._logger.error(err);
                next(err);
            }
            if (isAlertingError(err)) {
                if (alertingFn) {
                    alertingFn(err);
                }
            }
        };
    }
}
exports.ErrorUtils = ErrorUtils;
// tslint:disable:completed-docs
function isAlertingError(error) {
    return error.shouldAlert;
}
exports.isAlertingError = isAlertingError;
function isAPIError(error) {
    return error.isAPIError;
}
exports.isAPIError = isAPIError;
function isRevertError(error) {
    const { signature, selector } = error;
    return signature !== undefined && selector !== undefined;
}
exports.isRevertError = isRevertError;
function isBadRequestError(error) {
    return error.statusCode === HttpStatus.BAD_REQUEST;
}
exports.isBadRequestError = isBadRequestError;
function isRevertAPIError(error) {
    return error.isRevertError;
}
exports.isRevertAPIError = isRevertAPIError;
function isInternalServerError(error) {
    return error.statusCode === HttpStatus.INTERNAL_SERVER_ERROR;
}
exports.isInternalServerError = isInternalServerError;
function isValidationError(error) {
    return error.generalErrorCode === errors_1.GeneralErrorCodes.ValidationError;
}
exports.isValidationError = isValidationError;
// tslint:enable:completed-docs
//# sourceMappingURL=error_handler.js.map