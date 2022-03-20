"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDataSampler = exports.SAMPLE_THRESHOLD = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const constants_1 = require("../../constants");
exports.SAMPLE_THRESHOLD = 1;
const UPLOAD_SIZE = 1;
const REGION = process.env.AWS_S3_REGION ? process.env.AWS_S3_REGION : 'us-west-1';
const S3_BUCKET = process.env.S3_BUCKET ? process.env.S3_BUCKET : undefined;
class TestDataSampler {
    constructor(chainId) {
        this._routes = [];
        this._chainId = chainId;
    }
    static getInstance(chainId) {
        // singleton implementation
        if (!TestDataSampler._instance) {
            TestDataSampler._instance = new TestDataSampler(chainId);
        }
        return TestDataSampler._instance;
    }
    static sampleRoute(chainId, route) {
        const sampler = TestDataSampler.getInstance(chainId);
        sampler._routes.push(route);
        if (sampler._routes.length > UPLOAD_SIZE) {
            const toUpload = sampler._routes;
            sampler._routes = [];
            if (S3_BUCKET === undefined) {
                return;
            }
            // Set the parameters
            const params = {
                Bucket: S3_BUCKET,
                Key: `${sampler._chainId}/sample-${Date.now()}.json`,
                Body: JSON.stringify(toUpload), // The content of the object.
            };
            // Create an object and upload it to the Amazon S3 bucket.
            TestDataSampler._s3Client.send(new client_s3_1.PutObjectCommand(params)).catch(err => {
                constants_1.DEFAULT_WARNING_LOGGER(err, 'Failed to upload routing test sample to s3');
            });
        }
    }
    len() {
        return this._routes.length;
    }
}
exports.TestDataSampler = TestDataSampler;
TestDataSampler._s3Client = new client_s3_1.S3Client({ region: REGION });
//# sourceMappingURL=router_test_data_sampler.js.map