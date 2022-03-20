"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDataSampler = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const SAMPLE_THRESHOLD = 1;
const UPLOAD_SIZE = 5;
const REGION = process.env.AWS_S3_REGION ? process.env.AWS_S3_REGION : "us-west-1";
class TestDataSampler {
    constructor(chainId) {
        this.routes = [];
        this.chainId = chainId;
    }
    static getInstance(chainId) {
        // singleton implementation
        if (!TestDataSampler.instance) {
            TestDataSampler.instance = new TestDataSampler(chainId);
        }
        return TestDataSampler.instance;
    }
    sampleRoute(route) {
        if (Math.random() < SAMPLE_THRESHOLD) {
            this.routes.push(route);
            if (this.routes.length > UPLOAD_SIZE) {
                const toUpload = this.routes;
                this.routes = [];
                const file = `${this.chainId}-${Date.now()}`;
                // It should be fine to let this upload in the background
                // It's not critical to anything, if it fails for any reason
                // that's ok
                const s3Client = new client_s3_1.S3Client({ region: REGION });
                // Set the parameters
                const params = {
                    Bucket: file,
                    Key: `${file}-sample.txt`,
                    Body: JSON.stringify(toUpload), // The content of the object.
                };
                const run = () => __awaiter(this, void 0, void 0, function* () {
                    // Create an Amazon S3 bucket.
                    try {
                        const data = yield s3Client.send(new client_s3_1.CreateBucketCommand({ Bucket: params.Bucket }));
                        console.log(data);
                        console.log("Successfully created a bucket called ", data.Location);
                    }
                    catch (err) {
                        console.log("Error", err);
                    }
                    // Create an object and upload it to the Amazon S3 bucket.
                    try {
                        const results = yield s3Client.send(new client_s3_1.PutObjectCommand(params));
                        console.log("Successfully created " +
                            params.Key +
                            " and uploaded it to " +
                            params.Bucket +
                            "/" +
                            params.Key);
                        console.log("upload results", results);
                    }
                    catch (err) {
                        console.log("Error", err);
                    }
                });
                run();
            }
        }
    }
    len() {
        console.log("routes size", this.routes.length);
        return this.routes.length;
    }
}
exports.TestDataSampler = TestDataSampler;
;
//# sourceMappingURL=TestDataSampler.js.map