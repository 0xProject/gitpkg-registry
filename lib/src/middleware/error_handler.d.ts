import { RevertError } from '@0x/utils';
import { ErrorRequestHandler } from 'express';
import { AlertError, APIBaseError, BadRequestError, ErrorBodyWithHTTPStatusCode, GeneralErrorCodes, InternalServerError, RevertAPIError, ValidationError } from '../errors';
import { GenericLogger } from '../types';
export declare class ErrorUtils {
    private readonly _logger;
    /**
     * Wraps an Error with a JSON human readable reason and status code.
     * Extend this method to add custom error transformations
     */
    generateError(err: Error): ErrorBodyWithHTTPStatusCode;
    constructor(_logger: GenericLogger);
    /**
     * @returns A middleware handler that catches errors and handles them
     */
    getErrorHandler(alertingFn?: (err: Error) => void): ErrorRequestHandler;
}
export declare function isAlertingError(error: Error): error is AlertError;
export declare function isAPIError(error: Error): error is APIBaseError;
export declare function isRevertError(error: Error): error is RevertError;
export declare function isBadRequestError(error: APIBaseError): error is BadRequestError<GeneralErrorCodes>;
export declare function isRevertAPIError(error: APIBaseError): error is RevertAPIError;
export declare function isInternalServerError(error: APIBaseError): error is InternalServerError;
export declare function isValidationError(error: BadRequestError<GeneralErrorCodes>): error is ValidationError;
//# sourceMappingURL=error_handler.d.ts.map