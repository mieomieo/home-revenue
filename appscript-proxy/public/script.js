const startYear = 2025; // năm bắt đầu có dữ liệu

// ================= RUN BUTTON =================
document.addEventListener("DOMContentLoaded", () => {
  generateYearDropdown();

  document.getElementById("run_button").addEventListener("click", () => {
    const activeBtn = document.querySelector("#tab_layout button.active");
    const yearSelect = document.querySelector("#year_choose select");

    if (!activeBtn) return;

    const text = activeBtn.textContent; // ví dụ T2/26
    const month = parseInt(text.match(/T(\d+)/)[1]);
    const year = parseInt(yearSelect.value);

    // 👇 truyền thêm run = true
    loadMonth(month, year, activeBtn, true);
  });
});

// ================= LOAD MONTH =================
function loadMonth(month, year, btn, run = false) {
  const iframe = document.getElementById("reportFrame");
  const loading = document.getElementById("loading");

  iframe.style.display = "none";
  loading.style.display = "flex";

  // 👇 chỉ thêm param khi run=true
  const runParam = run ? "&run=true" : "";

  iframe.src = `/proxy?month=${month}&year=${year}${runParam}`;

  iframe.onload = function () {
    loading.style.display = "none";
    iframe.style.display = "block";
  };

  document
    .querySelectorAll("#tab_layout button")
    .forEach((b) => b.classList.remove("active"));

  if (btn) btn.classList.add("active");

  const label = document.getElementById("month_label");
  label.innerText = `Doanh thu tháng ${month}/${year} (cập nhật tự động qua Google Apps Script)`;
}

// ================= YEAR DROPDOWN =================
function generateYearDropdown() {
  const container = document.getElementById("year_choose");
  container.innerHTML = "";

  const select = document.createElement("select");

  const now = new Date();
  const currentYear = now.getFullYear();

  for (let y = startYear; y <= currentYear; y++) {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    select.appendChild(option);
  }

  select.value = currentYear;

  select.addEventListener("change", function () {
    generateMonths(parseInt(this.value));
  });

  container.appendChild(select);

  generateMonths(currentYear);
}

// ================= MONTH BUTTONS =================
function generateMonths(year) {
  const container = document.getElementById("tab_layout");
  container.innerHTML = "";

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  let maxMonth = 12;

  if (year === currentYear) {
    maxMonth = currentMonth;
  }

  for (let month = 1; month <= maxMonth; month++) {
    const btn = document.createElement("button");
    btn.textContent = `T${month}/${year.toString().slice(-2)}`;

    btn.onclick = () => loadMonth(month, year, btn);

    container.appendChild(btn);

    if (month === currentMonth && year === currentYear) {
      loadMonth(month, year, btn);
    }
  }
}
