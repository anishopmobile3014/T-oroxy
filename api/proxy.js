module.exports = async function handler(req, res) {
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

    // 🎯 Regex دقیق برای گرفتن قیمت دومین <div> در فروشنده ارزان‌ترین
    const match = html.match(/id="cheapest-seller"[\s\S]*?Showcase_ellipsis[^>]*>\s*<div[^>]*>.*?<\/div>\s*<div[^>]*>(.*?)<\/div>/);

    if (!match || !match[1]) {
      return res.status(500).json({ error: 'قیمت در HTML یافت نشد' });
    }

    const priceText = match[1]
      .replace(/<[^>]+>/g, '')                           // حذف تگ‌ها
      .replace(/[٫٬,\s]|تومان/g, '')                    // حذف جداکننده و تومان
      .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))  // تبدیل اعداد فارسی به انگلیسی
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
