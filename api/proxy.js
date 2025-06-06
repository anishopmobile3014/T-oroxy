export default async function handler(req, res) {
const { url } = req.query;

if (!url) {
return res.status(400).send('URL query parameter is required');
}

try {
const response = await fetch(url, {
headers: {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
'Accept-Language': 'fa,en;q=0.9',
'Referer': 'https://www.google.com/',
'Connection': 'keep-alive'
}
});

const html = await response.text();

if (!html || response.status !== 200) {
return res.status(500).send('دریافت HTML ناموفق بود - کد ' + response.status);
}

res.setHeader('Content-Type', 'text/html; charset=utf-8');
return res.status(200).send(html);

} catch (err) {
return res.status(500).send('خطای دریافت HTML: ' + err.message);
}
}
