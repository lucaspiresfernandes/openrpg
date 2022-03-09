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

    const player = req.session.player;

    if (!player) {
        res.status(401).end();
        return;
    }

    try {
        const data = await parseMultipart(req);

        let filesAux = data.files.file;
        const fileList = Array.isArray(filesAux) ? filesAux : [filesAux];
        let idsAux = data.fields.attrID;
        const ids = Array.isArray(idsAux) ? idsAux : [idsAux];
        
        await Promise.all(fileList.map((file, i) => {
            const attrID = parseInt(ids[i]);
            return uploadImage(file.filepath, player.id, attrID);
        }));
        res.end();
    }
    catch (err) {
        res.status(400).send('Form data malformation.');
    }

}

export default sessionAPI(handler);