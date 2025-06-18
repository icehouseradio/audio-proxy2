export default async function handler(req, res) {
  const { stream } = req.query;
  const streamUrl = decodeURIComponent(stream);

  if (!streamUrl.startsWith('http://167.71.103.22:8000/')) {
    return res.status(403).send('Forbidden');
  }

  const response = await fetch(streamUrl);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'audio/mpeg');
  response.body.pipe(res);
}