import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '../../utils/socket';
import prisma from '../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    const key = req.body.key;
    const value = req.body.value;

    if (!key || value === undefined) {
        res.status(400).send({ message: 'A chave não é especificada. Contate o desenvolvedor do aplicativo para resolver esse erro.' });
        return;
    }

    await prisma.config.update({ where: { key }, data: { value } });

    res.end();

    res.socket.server.io?.emit('configChange', key, value);
}