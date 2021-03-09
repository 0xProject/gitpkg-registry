import { ObjectMap } from '@0x/types';
import { RevertError } from '@0x/utils';
export declare abstract class APIBaseError extends Error {
    abstract statusCode: number;
    isAPIError: boolean;
}
export declare abstract class BadRequestError<ErrorCodes> extends APIBaseError {
    statusCode: number;
    abstract generalErrorCode: ErrorCodes;
}
export interface ValidationErrorItem {
    field: string;
    code: ValidationErrorCodes;
    reason: string;
}
export interface ErrorBodyWithHTTPStatusCode {
    statusCode: number;
    errorBody: ErrorBody | RevertReasonErrorBody;
}
export interface ErrorBody {
    reason: string;
    code?: number;
    validationErrors?: ValidationErrorItem[];
}
export interface RevertReasonErrorBody {
    reason: string;
    code?: number;
    values: ObjectMap<any>;
}
export declare class ValidationError extends BadRequestError<GeneralErrorCodes> {
    generalErrorCode: GeneralErrorCodes;
    validationErrors: ValidationErrorItem[];
    constructor(validationErrors: ValidationErrorItem[]);
}
export declare class MalformedJSONError extends BadRequestError<GeneralErrorCodes> {
    generalErrorCode: GeneralErrorCodes;
}
export declare class TooManyRequestsError extends BadRequestError<GeneralErrorCodes> {
    statusCode: number;
    generalErrorCode: GeneralErrorCodes;
}
export declare class NotImplementedError extends BadRequestError<GeneralErrorCodes> {
    statusCode: number;
    generalErrorCode: GeneralErrorCodes;
}
export declare class InvalidAPIKeyError extends BadRequestError<GeneralErrorCodes> {
    statusCode: number;
    generalErrorCode: GeneralErrorCodes;
}
export declare class NotFoundError extends APIBaseError {
    statusCode: number;
}
export declare class InternalServerError extends APIBaseError {
    statusCode: number;
}
export declare class RevertAPIError extends BadRequestError<GeneralErrorCodes> {
    statusCode: number;
    generalErrorCode: GeneralErrorCodes;
    name: string;
    values: ObjectMap<any>;
    isRevertError: boolean;
    constructor(revertError: RevertError);
}
export declare enum GeneralErrorCodes {
    ValidationError = 100,
    MalformedJson = 101,
    Throttled = 103,
    NotImplemented = 104,
    TransactionInvalid = 105,
    InvalidAPIKey = 107
}
export declare const generalErrorCodeToReason: {
    [key in GeneralErrorCodes]: string;
};
export declare enum ValidationErrorCodes {
    RequiredField = 1000,
    IncorrectFormat = 1001,
    InvalidAddress = 1002,
    AddressNotSupported = 1003,
    ValueOutOfRange = 1004,
    InvalidSignatureOrHash = 1005,
    UnsupportedOption = 1006,
    InvalidOrder = 1007,
    InternalError = 1008,
    TokenNotSupported = 1009,
    FieldInvalid = 1010
}
export declare enum ValidationErrorReasons {
    PercentageOutOfRange = "MUST_BE_LESS_THAN_OR_EQUAL_TO_ONE",
    ConflictingFilteringArguments = "CONFLICTING_FILTERING_ARGUMENTS",
    ArgumentNotYetSupported = "ARGUMENT_NOT_YET_SUPPORTED",
    InvalidApiKey = "INVALID_API_KEY",
    TakerAddressInvalid = "TAKER_ADDRESS_INVALID",
    RequiresIntentOnFilling = "REQUIRES_INTENT_ON_FILLING",
    UnfillableRequiresMakerAddress = "MAKER_ADDRESS_REQUIRED_TO_FETCH_UNFILLABLE_ORDERS",
    MultipleFeeTypesUsed = "MULTIPLE_FEE_TYPES_USED",
    FeeRecipientMissing = "FEE_RECIPIENT_MISSING"
}
export declare abstract class AlertError extends Error {
    abstract message: string;
    shouldAlert: boolean;
}
//# sourceMappingURL=errors.d.ts.map