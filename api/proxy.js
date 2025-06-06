export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'لینک محصول ترب ارسال نشده است' });
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
      return res.status(500).json({
        error: 'دریافت HTML از ترب ناموفق بود',
        status: response.status
      });
    }

    const match = html.match(/<div[^>]*Showcase_ellipsis[^>]*>\s*<div[^>]*>(.*?)<\/div>/);

    return res.status(200).json({
      match_found: !!match,
      raw_match: match ? match[1] : null,
      truncated_html: html.substring(0, 2000)
    });

  } catch (err) {
    return res.status(500).json({ error: 'خطای سرور پراکسی', message: err.message });
  }
}
