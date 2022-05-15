import { NextApiRequest, NextApiResponse } from 'next';
import { HTTPMETHOD, RESCODE, CONSTANTS } from 'lib/constants';

import { createHmac } from 'crypto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === HTTPMETHOD.POST) {
    try {
      const authorization = req.headers[CONSTANTS.MICROCMS_SIGNATURE];
      const secretKey = process.env.WEB_HOOK_API_SECRET_KEY;
      if (!secretKey)
        return res.status(RESCODE.UNAUTHORIZED).json({ success: false });

      const hashKey = createHmac('sha256', secretKey);
      console.log('hashkey: ' + hashKey);
      console.log('req.header: ' + authorization);

      if (authorization === hashKey) {
        await res.unstable_revalidate('/');
        res.status(RESCODE.OK).json({ success: true });
        return res.json({ revalidated: true });
      } else {
        res.status(RESCODE.UNAUTHORIZED).json({ success: false });
      }
    } catch (err) {
      res.status(RESCODE.INTERNAL_SERVER_ERROR).json({
        statusCode: RESCODE.INTERNAL_SERVER_ERROR,
        message: err,
      });
    }
  } else {
    res.setHeader('Allow', HTTPMETHOD.POST);
    res.status(RESCODE.METHOD_NOT_ALLOWED).end('Method Not Allowed');
  }
}

// function _thorwInValid(
//   req?: NextApiRequest,
//   res?: NextApiResponse,
//   authorization?: any,
//   secretKey?: string | undefined
// ) {
//   if (!authorization) {
//     return res.status(RESCODE.UNAUTHORIZED).json({ success: false });
//   }

//   if (!secretKey) {
//     return res.status(RESCODE.UNAUTHORIZED).json({ success: false });
//   }
// }
