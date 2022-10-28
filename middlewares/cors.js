const allowedCors = ['http://localhost:3000',
  'http://api.bakhtiyarkpr.nomoredomains.icu',
  'http://bakhtiyarkpr.nomoredomains.icu',
  'https://api.bakhtiyarkpr.nomoredomains.icu',
  'https://bakhtiyarkpr.nomoredomains.icu'];

const cors = (req, res, next) => {
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];

  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (method === 'OPTIONS') {
    if (allowedCors.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Credentials', true);
    return res.end();
  }
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  return next();
};
module.exports = cors;
