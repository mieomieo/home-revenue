export default async (req, context) => {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const targetUrl = `https://script.google.com/macros/s/AKfycbyjfU3nunNU2126R0X6GwGohX3RtqFMCuXhlcllwTNmlN0HefzAmyImwiqv9y2wL0NIxw/exec?month=${month}&year=${year}`;

  try {
    const res = await fetch(targetUrl, { method: "GET" });
    let html = await res.text();
    html = html.replace(/\n/g, "<br>");
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response("Proxy error: " + err.message, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
};
