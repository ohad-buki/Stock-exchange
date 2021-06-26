class CompanyInfo {
  constructor(perent, symbol) {
    this.perent = perent;
    this.symbol = symbol;
    this.firstSpinner = document.createElement("div");
    this.firstSpinner.classList.add("spinner-wrapper");
    this.firstSpinner.innerHTML = ` <div class="spinner-border first-spinner d-none" role="status">
    <span class="visually-hidden">Loading...</span></div>`;
    this.secondSpinner = document.createElement("div");
    this.secondSpinner.classList.add("spinner-wrapper");
    this.secondSpinner.innerHTML = ` <div class="spinner-border first-spinner d-none" role="status">
    <span class="visually-hidden">Loading...</span></div>`;
  }
  async getCompanyData() {
    const res = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${this.symbol}`
    );
    const data = await res.json();
    return data;
  }

  async getHistory() {
    const res = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${this.symbol}?serietype=line`
    );
    const dataHistory = await res.json();
    return dataHistory;
  }

  addDataToScreen() {
    this.firstSpinner.classList.remove("d-none");
    this.getCompanyData().then((data) => {
      let color = "red";
      if (data.profile.changesPercentage[1] == "+") {
        color = "green";
      }
      this.perent.innerHTML = `<div class="page-box">
      <div class="spinner-wrapper">
        <div class="spinner-border first-spinner d-none" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div class="header">
        <div class="logo"><img src="${data.profile.image}" alt="Logo"></div>
        <div class="name">${data.profile.companyName} (${data.profile.industry})</div>
      </div>
      <div class="price">Stock price: $${data.profile.price} <span class = ${color}>${data.profile.changesPercentage}</span></div>
      <div class="discription">${data.profile.description}</div>
      <div class="char">
        <div class="spinner-wrapper">
          <div class="spinner-border history-spinner d-none" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <canvas id="myChart"></canvas>
      </div>
    </div>`;
      this.firstSpinner.classList.add("d-none");
    });
  }

  fillChar() {
    const labels = [];
    const priceHistory = [];
    this.secondSpinner.classList.remove("d-none");
    this.getHistory().then((d) => {
      for (let i = 0; i < d.historical.length; i += 30) {
        labels.unshift(d.historical[i].date);
        priceHistory.unshift(d.historical[i].close);
      }
      const data = {
        labels: labels,
        datasets: [
          {
            label: "Stock Price History",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: priceHistory,
          },
        ],
      };
      const config = {
        type: "line",
        data,
        options: {},
      };
      var myChart = new Chart(document.getElementById("myChart"), config);
      this.secondSpinner.classList.add("d-none");
    });
  }
}
