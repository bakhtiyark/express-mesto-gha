const allowedCors = ['http://localhost:3000/',
  'http://api.bakhtiyarkpr.nomoredomains.icu/',
  'http://bakhtiyarkpr.nomoredomains.icu/',
  'https://api.bakhtiyarkpr.nomoredomains.icu/',
  'https://bakhtiyarkpr.nomoredomains.icu/'];

module.exports = (req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Origin', '*');
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  res.header('Access-Control-Allow-Headers', requestHeaders);
  return res.end();
};

module.exports = allowedCors;
