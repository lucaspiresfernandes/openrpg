import { v2 as cloudinary } from 'cloudinary';
import formidable, { Fields, Files } from 'formidable';
import { NextApiRequest } from 'next';

export function parseMultipart(req: NextApiRequest): Promise<{ fields: Fields, files: Files }> {
    return new Promise((res, rej) => {
        const parser = formidable({ multiples: true });
        parser.parse(req, (err, fields, files) => {
            if (err) return rej(err);
            res({ fields, files });
        });
    });
}

export function uploadImage(filePath: string, playerID: number, attrStatusID: number) {
    return cloudinary.uploader.upload(filePath, { public_id: `avatar${playerID}_${attrStatusID}` });
}

export function getImageURL(playerID: number, attrStatusID: number) {
    return cloudinary.url(`avatar${playerID}_${attrStatusID}`, { version: Date.now().toString() });
}