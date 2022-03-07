import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import { NextApiRequest } from 'next';

const parser = formidable({ multiples: true });

export function parseMultipart(req: NextApiRequest) {
    return new Promise((res, rej) => {
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