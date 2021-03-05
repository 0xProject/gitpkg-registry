import { NextFunction, Request, Response } from 'express';

/**
 *  Sets the Cache related headers in a response
 */
export function cacheControl(DEFAULT_CACHE_AGE_SECONDS: number) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (req.method === 'GET') {
            res.set(
                'Cache-control',
                `public, max-age=${DEFAULT_CACHE_AGE_SECONDS}, s-maxage=${DEFAULT_CACHE_AGE_SECONDS}`,
            );
        }
        next();
    };
}
