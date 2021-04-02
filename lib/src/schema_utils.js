"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APISchemaValidator = void 0;
const json_schemas_1 = require("@0x/json-schemas");
const errors_1 = require("./errors");
class APISchemaValidator {
    constructor(schemas, _validator = new json_schemas_1.SchemaValidator()) {
        this._validator = _validator;
        for (const schema of schemas) {
            if (schema !== undefined) {
                this._validator.addSchema(schema);
            }
        }
    }
    validate(instance, schema) {
        const validationResult = this._validator.validate(instance, schema);
        if (validationResult.errors.length === 0) {
            return;
        }
        else {
            const validationErrorItems = validationResult.errors.map((schemaValidationError) => schemaValidationErrorToValidationErrorItem(schemaValidationError));
            throw new errors_1.ValidationError(validationErrorItems);
        }
    }
    addSchema(schema) {
        this._validator.addSchema(schema);
    }
}
exports.APISchemaValidator = APISchemaValidator;
function schemaValidationErrorToValidationErrorItem(schemaValidationError) {
    if ([
        'type',
        'anyOf',
        'allOf',
        'oneOf',
        'additionalProperties',
        'minProperties',
        'maxProperties',
        'pattern',
        'format',
        'uniqueItems',
        'items',
        'dependencies',
    ].includes(schemaValidationError.name)) {
        return {
            field: schemaValidationError.property,
            code: errors_1.ValidationErrorCodes.IncorrectFormat,
            reason: schemaValidationError.message,
        };
    }
    else if (['minimum', 'maximum', 'minLength', 'maxLength', 'minItems', 'maxItems', 'enum', 'const'].includes(schemaValidationError.name)) {
        return {
            field: schemaValidationError.property,
            code: errors_1.ValidationErrorCodes.ValueOutOfRange,
            reason: schemaValidationError.message,
        };
    }
    else if (schemaValidationError.name === 'required') {
        return {
            field: schemaValidationError.argument,
            code: errors_1.ValidationErrorCodes.RequiredField,
            reason: schemaValidationError.message,
        };
    }
    else if (schemaValidationError.name === 'not') {
        return {
            field: schemaValidationError.property,
            code: errors_1.ValidationErrorCodes.UnsupportedOption,
            reason: schemaValidationError.message,
        };
    }
    else {
        throw new Error(`Unknnown schema validation error name: ${schemaValidationError.name}`);
    }
}
//# sourceMappingURL=schema_utils.js.map