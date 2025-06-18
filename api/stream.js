import { Readable } from 'node:stream'; // Import the Readable stream from Node.js

export default async function handler(req, res) {
  const { stream } = req.query;
  const streamUrl = decodeURIComponent(stream);

  if (!streamUrl.startsWith('http://167.71.103.22:8000/')) {
    return res.status(403).send('Forbidden');
  }

  try {
    const response = await fetch(streamUrl);

    // Check if the fetch was successful
    if (!response.ok) {
      return res.status(response.status).send(`Failed to fetch stream: ${response.statusText}`);
    }

    // Convert the WHATWG ReadableStream to a Node.js Readable stream
    // This is the crucial part that fixes the "pipe is not a function" error
    const nodeStream = Readable.fromWeb(response.body);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'audio/mpeg');

    // Now pipe the Node.js stream to the response
    nodeStream.pipe(res);

    // Handle potential errors on the stream
    nodeStream.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) { // Only send error if headers haven't been sent yet
        res.status(500).send('Stream error');
      }
    });

  } catch (error) {
    console.error('Error in stream handler:', error);
    res.status(500).send('Internal Server Error');
  }
}
