import { Schema, SchemaValidator } from '@0x/json-schemas';
export declare class APISchemaValidator {
    private readonly _validator;
    constructor(schemas: Schema[], _validator?: SchemaValidator);
    validate(instance: any, schema: Schema): void;
    addSchema(schema: Schema): void;
}
//# sourceMappingURL=schema_utils.d.ts.map