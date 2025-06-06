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

// 🎯 فقط اولین تگ div که قیمت ارزان‌ترین فروشنده ترب در آن قرار دارد
const match = html.match(/<div[^>]*class="[^"]*Showcase_buy_box_text__[^"]*"[^>]*>(.*?)<\\/div>/);

if (!match || !match[1]) {
return res.status(500).json({ error: 'قیمت در HTML یافت نشد' });
}

const priceText = match[1]
.replace(/<[^>]+>/g, '')
.replace(/[٫٬,\\s]|تومان/g, '')
.trim();

const price = parseInt(priceText);
if (!price || price <= 0) {
return res.status(500).json({ error: 'قیمت معتبر استخراج نشد', raw: priceText });
}

return res.status(200).json({ price });
} catch (err) {
return res.status(500).json({ error: 'خطای سرور پراکسی', message: err.message });
}
}
