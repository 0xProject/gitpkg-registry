"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertError = exports.ValidationErrorReasons = exports.ValidationErrorCodes = exports.generalErrorCodeToReason = exports.GeneralErrorCodes = exports.RevertAPIError = exports.InternalServerError = exports.NotFoundError = exports.InvalidAPIKeyError = exports.NotImplementedError = exports.TooManyRequestsError = exports.MalformedJSONError = exports.ValidationError = exports.BadRequestError = exports.APIBaseError = void 0;
const HttpStatus = __importStar(require("http-status-codes"));
// tslint:disable:max-classes-per-file
// base class for all the named errors in this file
class APIBaseError extends Error {
    constructor() {
        super(...arguments);
        this.isAPIError = true;
    }
}
exports.APIBaseError = APIBaseError;
class BadRequestError extends APIBaseError {
    constructor() {
        super(...arguments);
        this.statusCode = HttpStatus.BAD_REQUEST;
    }
}
exports.BadRequestError = BadRequestError;
class ValidationError extends BadRequestError {
    constructor(validationErrors) {
        super();
        this.generalErrorCode = GeneralErrorCodes.ValidationError;
        this.validationErrors = validationErrors;
    }
}
exports.ValidationError = ValidationError;
class MalformedJSONError extends BadRequestError {
    constructor() {
        super(...arguments);
        this.generalErrorCode = GeneralErrorCodes.MalformedJson;
    }
}
exports.MalformedJSONError = MalformedJSONError;
class TooManyRequestsError extends BadRequestError {
    constructor() {
        super(...arguments);
        this.statusCode = HttpStatus.TOO_MANY_REQUESTS;
        this.generalErrorCode = GeneralErrorCodes.Throttled;
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class NotImplementedError extends BadRequestError {
    constructor() {
        super(...arguments);
        this.statusCode = HttpStatus.NOT_IMPLEMENTED;
        this.generalErrorCode = GeneralErrorCodes.NotImplemented;
    }
}
exports.NotImplementedError = NotImplementedError;
class InvalidAPIKeyError extends BadRequestError {
    constructor() {
        super(...arguments);
        this.statusCode = HttpStatus.BAD_REQUEST;
        this.generalErrorCode = GeneralErrorCodes.InvalidAPIKey;
    }
}
exports.InvalidAPIKeyError = InvalidAPIKeyError;
class NotFoundError extends APIBaseError {
    constructor() {
        super(...arguments);
        this.statusCode = HttpStatus.NOT_FOUND;
    }
}
exports.NotFoundError = NotFoundError;
class InternalServerError extends APIBaseError {
    constructor() {
        super(...arguments);
        this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
exports.InternalServerError = InternalServerError;
class RevertAPIError extends BadRequestError {
    constructor(revertError) {
        super();
        this.statusCode = HttpStatus.BAD_REQUEST;
        this.generalErrorCode = GeneralErrorCodes.TransactionInvalid;
        this.isRevertError = true;
        this.name = revertError.name;
        this.values = revertError.values;
    }
}
exports.RevertAPIError = RevertAPIError;
var GeneralErrorCodes;
(function (GeneralErrorCodes) {
    GeneralErrorCodes[GeneralErrorCodes["ValidationError"] = 100] = "ValidationError";
    GeneralErrorCodes[GeneralErrorCodes["MalformedJson"] = 101] = "MalformedJson";
    GeneralErrorCodes[GeneralErrorCodes["Throttled"] = 103] = "Throttled";
    GeneralErrorCodes[GeneralErrorCodes["NotImplemented"] = 104] = "NotImplemented";
    GeneralErrorCodes[GeneralErrorCodes["TransactionInvalid"] = 105] = "TransactionInvalid";
    GeneralErrorCodes[GeneralErrorCodes["InvalidAPIKey"] = 107] = "InvalidAPIKey";
})(GeneralErrorCodes = exports.GeneralErrorCodes || (exports.GeneralErrorCodes = {}));
exports.generalErrorCodeToReason = {
    [GeneralErrorCodes.ValidationError]: 'Validation Failed',
    [GeneralErrorCodes.MalformedJson]: 'Malformed JSON',
    [GeneralErrorCodes.Throttled]: 'Throttled',
    [GeneralErrorCodes.NotImplemented]: 'Not Implemented',
    [GeneralErrorCodes.TransactionInvalid]: 'Transaction Invalid',
    [GeneralErrorCodes.InvalidAPIKey]: 'Invalid API key',
};
var ValidationErrorCodes;
(function (ValidationErrorCodes) {
    ValidationErrorCodes[ValidationErrorCodes["RequiredField"] = 1000] = "RequiredField";
    ValidationErrorCodes[ValidationErrorCodes["IncorrectFormat"] = 1001] = "IncorrectFormat";
    ValidationErrorCodes[ValidationErrorCodes["InvalidAddress"] = 1002] = "InvalidAddress";
    ValidationErrorCodes[ValidationErrorCodes["AddressNotSupported"] = 1003] = "AddressNotSupported";
    ValidationErrorCodes[ValidationErrorCodes["ValueOutOfRange"] = 1004] = "ValueOutOfRange";
    ValidationErrorCodes[ValidationErrorCodes["InvalidSignatureOrHash"] = 1005] = "InvalidSignatureOrHash";
    ValidationErrorCodes[ValidationErrorCodes["UnsupportedOption"] = 1006] = "UnsupportedOption";
    ValidationErrorCodes[ValidationErrorCodes["InvalidOrder"] = 1007] = "InvalidOrder";
    ValidationErrorCodes[ValidationErrorCodes["InternalError"] = 1008] = "InternalError";
    ValidationErrorCodes[ValidationErrorCodes["TokenNotSupported"] = 1009] = "TokenNotSupported";
    ValidationErrorCodes[ValidationErrorCodes["FieldInvalid"] = 1010] = "FieldInvalid";
})(ValidationErrorCodes = exports.ValidationErrorCodes || (exports.ValidationErrorCodes = {}));
var ValidationErrorReasons;
(function (ValidationErrorReasons) {
    ValidationErrorReasons["PercentageOutOfRange"] = "MUST_BE_LESS_THAN_OR_EQUAL_TO_ONE";
    ValidationErrorReasons["ConflictingFilteringArguments"] = "CONFLICTING_FILTERING_ARGUMENTS";
    ValidationErrorReasons["ArgumentNotYetSupported"] = "ARGUMENT_NOT_YET_SUPPORTED";
    ValidationErrorReasons["InvalidApiKey"] = "INVALID_API_KEY";
    ValidationErrorReasons["TakerAddressInvalid"] = "TAKER_ADDRESS_INVALID";
    ValidationErrorReasons["RequiresIntentOnFilling"] = "REQUIRES_INTENT_ON_FILLING";
    ValidationErrorReasons["UnfillableRequiresMakerAddress"] = "MAKER_ADDRESS_REQUIRED_TO_FETCH_UNFILLABLE_ORDERS";
    ValidationErrorReasons["MultipleFeeTypesUsed"] = "MULTIPLE_FEE_TYPES_USED";
    ValidationErrorReasons["FeeRecipientMissing"] = "FEE_RECIPIENT_MISSING";
})(ValidationErrorReasons = exports.ValidationErrorReasons || (exports.ValidationErrorReasons = {}));
// If an error class implements AlertError, the error handling middleware will automatically log it to stderr
class AlertError extends Error {
    constructor() {
        super(...arguments);
        this.shouldAlert = true;
    }
}
exports.AlertError = AlertError;
//# sourceMappingURL=errors.js.map