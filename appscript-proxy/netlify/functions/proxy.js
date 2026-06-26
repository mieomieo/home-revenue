exports.handler = async (event) => {
  const { month, year, run } = event.queryStringParameters || {};

  const BASE_URLS = [
    {
      name: "Coco",
      url: "https://script.google.com/macros/s/AKfycbyuI-8EQuUmWjBtuqWh8mO4tcKSZwgaltAs2cKCFo5AHIY_ti-wCu7jxcsJbQEGsZPf/exec",
      sheetUrl:
        "https://docs.google.com/spreadsheets/d/1FrdmbwLT5Z-LBrKeU2c4-KMCB3PGWHwkYxSc5azLxvc/edit?",
    },
    {
      name: "Nivo",
      url: "https://script.google.com/macros/s/AKfycbzVSnaNz1sQJT2fsP1_iuViMXkH-M6BE-WECCDaGICLNl_dQ_znTkIeNZ-nRfcEo5QR/exec",
      sheetUrl:
        "https://docs.google.com/spreadsheets/d/1tOcp809C-4_5zSrpHWs4OMw_5CkJQILx2cbliMEH-kQ/edit?",
    },
    {
      name: "Bento",
      url: "https://script.google.com/macros/s/AKfycby1aS387j1NPhOPqa_0tHCVWzsCI2eAqBNWKJuYwJIsZLnJvoTZ7k9PQt3SCzuCZn68Vw/exec",
      sheetUrl:
        "https://docs.google.com/spreadsheets/d/1qtopGLmStER-JtVxNLF6_yE71CXMHastiSZDWyO_poE/edit?",
    },
    {
      name: "Kenzo",
      url: "https://script.google.com/macros/s/AKfycbzPXdvb4zdOZS1eozpiZNUsvGKOe2rUt3dx-b5p3dDW3oRdgMcL4HC-yp7HoRL3hFxc/exec",
      sheetUrl:
        "https://docs.google.com/spreadsheets/d/1xqFrSXf2j3LztCGdtxl7q3EV9uUzCn34g5GfDLFNkxo/edit?",
    },
    {
      name: "Cento",
      url: "https://script.google.com/macros/s/AKfycbzYVCunBGlMAGPBfogla8SM01tMoEsDXciHsafhkd7CiqAkw2U6s_qSYbbTYk8m2klf5A/exec",
      sheetUrl:
        "https://docs.google.com/spreadsheets/d/1eNVPlekMVD_iPzgMs4xc7Wv0xa4Db6sKI2eXjql-o2k/edit?",
    },
    {
      name: "Milo",
      url: "https://script.google.com/macros/s/AKfycbxCl-QzUFPui-9_6s0V9ZXKcArtnHXc94eewvNL0fntRxEZLw-fQnVF0kB5MrD6aiXjOg/exec",
      sheetUrl:
        "https://docs.google.com/spreadsheets/d/1Y-UMhIflOHy0Z-0zSt-I6E6xH2DmIHtfuxctyU0pzwo/edit?",
    },
    {
      name: "Pluto",
      url: "https://script.google.com/macros/s/AKfycbyJRmEDD13qNQkfS3ieSJdoj299v9wq6esCkxtKzIOe2uj2K3nN6vnhbNRtRXqktT2H/exec",
      sheetUrl:
        "https://docs.google.com/spreadsheets/d/13ICLbw9WvSRRzWw8Vqv9dcEdTTEF8vnMGG2RSWPXscE/edit?",
    },
  ];

  const urls = BASE_URLS.map((item) => ({
    name: item.name,
    url:
      month && year
        ? `${item.url}?month=${month}&year=${year}&run=${run}`
        : item.url,
  }));

  const responses = await Promise.all(
    urls.map(async (u) => {
      const start = Date.now();
      const res = await fetch(u.url);
      const text = await res.text();
      const time = Date.now() - start;
      console.log(u.name, time + "ms");
      return { name: u.name, text, time };
    }),
  );
  function extractProfit(text) {
    const match = text.match(/Lãi:\s?([\d\.]+)\s?₫/);
    if (!match) return 0;
    return Number(match[1].replace(/\./g, ""));
  }
  // 👉 Lấy revenue số đầu tiên
  function extractRevenue(text) {
    const match = text.match(/([\d\.]+)\s?₫/);
    if (!match) return 0;
    return Number(match[1].replace(/\./g, ""));
  }
  function extractRevenue(text) {
    const match = text.match(/Doanh thu:\s?([\d\.]+)\s?₫/);
    if (!match) return 0;
    return Number(match[1].replace(/\./g, ""));
  }
  // 👉 chỉ lấy Bento + Kenzo + Cento
  const targetStores1 = ["Bento", "Kenzo", "Cento"];
  const targetStores2 = ["Pluto", "Milo"];
  const targetStores3 = ["Coco"];
  const targetStores4 = ["Nivo"];

  function getTotalRevenueCustom(rooms) {
    return responses
      .filter((r) => rooms.includes(r.name))
      .reduce((sum, r) => sum + extractRevenue(r.text), 0);
  }
  const totalRevenue1 = getTotalRevenueCustom(targetStores1);
  const totalRevenue2 = getTotalRevenueCustom(targetStores2);
  const totalRevenue3 = getTotalRevenueCustom(targetStores3);
  const totalRevenue4 = getTotalRevenueCustom(targetStores4);
  function extractCommission(text) {
    const match = text.match(/Hoa hồng:\s?([\d\.]+)\s?₫/);
    if (!match) return 0;
    return Number(match[1].replace(/\./g, ""));
  }
  const commissionList = responses.map((r) => {
    const commission = extractCommission(r.text);
    const revenue = extractRevenue(r.text);
    const profit = extractProfit(r.text);

    return {
      name: r.name,
      commission,
      revenue,
      profit,
    };
  });
  const totalCommission = commissionList.reduce(
    (sum, item) => sum + item.commission,
    0,
  );
  const commissionOutput = commissionList
    .map(
      (item) =>
        `• ${item.name}: ${item.revenue.toLocaleString("vi-VN")} ==> ${item.commission.toLocaleString("vi-VN")} ₫`,
    )
    .join("\n");

  const formattedTotalCommission =
    totalCommission.toLocaleString("vi-VN") + " ₫";
  // format lại tiền VN
  const totalProfit = commissionList.reduce(
    (sum, item) => sum + item.profit,
    0,
  );

  const totalRevenue = commissionList.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );

  const formattedTotalProfit = totalProfit.toLocaleString("vi-VN") + " ₫";
  const formattedTotalRevenue = totalRevenue.toLocaleString("vi-VN") + " ₫";
  const outputText = responses
    .sort((a, b) => extractRevenue(b.text) - extractRevenue(a.text))
    .map((r, index) => {
      const store = BASE_URLS.find((b) => b.name === r.name);
      const { doanhThu, hoaHong, lai } = extractParts(r.text);

      const revenueNum = Number(doanhThu.replace(/\./g, ""));
      const color = getRevenueColor(revenueNum);

      return `
      <div style="margin-bottom:10px;">
        <b>No.${index + 1}</b> ✅
        <a href="${store.sheetUrl}" target="_blank" style="font-weight:bold;">
          ${r.name}
        </a>: 💰
        Doanh thu:
        <span style="color:${color}; font-weight:bold;">
          ${doanhThu} ₫
        </span>

        💸 Hoa hồng: ${hoaHong} ₫

        💵 Lãi:
        <span style="color:#16a34a;">
          ${lai} ₫
        </span>
      </div>
    `;
    })
    .join("");
  function extractParts(text) {
    const doanhThu = text.match(/Doanh thu:\s*([\d\.]+)\s?₫/)?.[1] || "0";
    const hoaHong = text.match(/Hoa hồng:\s*([\d\.]+)\s?₫/)?.[1] || "0";
    const lai = text.match(/Lãi:\s*([\d\.]+)\s?₫/)?.[1] || "0";

    return {
      doanhThu,
      hoaHong,
      lai,
    };
  }
  function getRevenueColor(revenue) {
    if (revenue >= 9000000 && revenue < 14000000) return "#ef4444"; // vàng
    if (revenue >= 14000000 && revenue < 19000000) return "#f59e0b "; // xanh lá
    if (revenue >= 19000000 && revenue < 24000000) return "#22c55e"; // tím
    if (revenue >= 24000000) return "#8b5cf6"; // xanh đậm
    return "#000000"; // < 9tr → đỏ
  }
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    },
    body: `
  <html>
  <head>
    <style>
    
      body {
        font-family: Arial, sans-serif;
        background: #f3f4f6;
        padding: 20px;
      }

      .card {
        background: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        margin-bottom: 15px;
      }

      .section-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 10px;
      }

      .highlight {
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 20px;
      }

      .commission-box {
        background: #fff;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        font-size: 10px;
      }

      .commission-item {
        padding: 6px 0;
        border-bottom: 1px solid #eee;
      }

      .commission-item:last-child {
        border-bottom: none;
      }

      .total-commission {
        margin-top: 12px;
        font-weight: bold;
        color: #16a34a;
        font-size: 16px;
      }
    </style>
  </head>

  <body>

    <div class="section-title">📊 Báo cáo từng phòng</div>

    ${outputText}



    <div class="commission-box">
          <div style="display:flex; justify-content:space-between; align-items:center;">
      <div class="section-title">💸 Hoa hồng từng phòng</div>

      <button onclick="copyCommission()" style="
        background:#16a34a;
        color:white;
        border:none;
        padding:6px 12px;
        border-radius:8px;
        cursor:pointer;
        font-size:13px;
      ">
        📋 Copy
      </button>
    </div>
    <div id="commission_list">
      ${commissionOutput
        .split("\n")
        .map((line) => `<div class="commission-item">${line}</div>`)
        .join("")}
    </div>
      <div class="total-commission">
        💰 Tổng cộng hoa hồng: ${formattedTotalCommission}
      </div>
        <div class="total-commission">
          💵 Tổng doanh thu: ${formattedTotalRevenue} <br/>
          💰 Tổng lãi: ${formattedTotalProfit} <br/>
          📈 Lợi nhuận: ${formattedTotalProfit} / ${formattedTotalRevenue} 
          (${totalRevenue ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0} %)
        </div>
        <div style="background:#eee; border-radius:10px; overflow:hidden; margin-top:6px;">
        <div style="
          width:${totalRevenue ? (totalProfit / totalRevenue) * 100 : 0}%;
          background:#16a34a;
          padding:4px;
          color:white;
          font-size:12px;
          text-align:center;
        ">
          ${totalRevenue ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0}%
        </div>
      </div>
    </div>
    <div class="highlight">
      🔥 Tổng Bento + Kenzo + Cento: ${totalRevenue1.toLocaleString("vi-VN") + " ₫"}
    </div>
    <div class="highlight">
      🔥 Tổng Pluto + Milo: ${totalRevenue2.toLocaleString("vi-VN") + " ₫"}
    </div>
      <div class="highlight">
      🔥 Tổng Coco: ${totalRevenue3.toLocaleString("vi-VN") + " ₫"}
    </div>
       <div class="highlight">
      🔥 Tổng Nivo: ${totalRevenue4.toLocaleString("vi-VN") + " ₫"}
    </div>
    <div id="toast" style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #16a34a;
      color: white;
      padding: 12px 18px;
      border-radius: 10px;
      font-size: 14px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
      z-index: 9999;
    ">
      ✅ Đã copy!
    </div>
      <script>
      function copyCommission() {
        const listText = Array.from(
          document.querySelectorAll("#commission_list .commission-item")
        )
          .map(el => el.innerText)
          .join("\\n");

        const totalText =
          document.querySelector(".total-commission")?.innerText || "";

        const fullText = listText + "\\n\\n" + totalText;

        navigator.clipboard.writeText(fullText).then(() => {
          showToast("📋 Đã copy toàn bộ hoa hồng!");
        });
      }

      function showToast(message = "✅ Đã copy!") {
        const toast = document.getElementById("toast");
        toast.innerText = message;

        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";

        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateY(-20px)";
        }, 2000);
      }
    </script>
  </body>
  </html>
  `,
  };
};
