import { NextApiRequest, NextApiResponse } from 'next';
import { sessionAPI } from '../../../../../utils/session';
import { parseMultipart, getImageURL, uploadImage } from '../../../../../utils/image';

export const config = {
    api: {
        bodyParser: false
    }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return;
    const playerID = req.session.player.id;

    if (!playerID) {
        res.status(401).send('Player ID is undefined.');
        return;
    }

    const data = await parseMultipart(req);

    let filesAux = data.files.file;
    const fileList = Array.isArray(filesAux) ? filesAux : [filesAux];
    let idsAux = data.fields.attrID;
    const ids = Array.isArray(idsAux) ? idsAux : [idsAux];

    try {
        await Promise.all(fileList.map((file, i) => {
            const attrID = parseInt(ids[i]);
            return uploadImage(file.filepath, playerID, attrID);
        }));
        res.end();
    }
    catch (err) {
        res.status(401).send('Bad Request');
    }

}

export default sessionAPI(handler);