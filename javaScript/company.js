class CompanyInfo {
  constructor(perent, symbol) {
    this.perent = perent;
    this.symbol = symbol;
    this.firstSpinner = document.createElement("div");
    this.firstSpinner.classList.add("spinner-wrapper");
    this.firstSpinner.innerHTML = ` <div class="spinner-border first-spinner d-none" role="status">
    <span class="visually-hidden">Loading...</span></div>`;
    this.arrayOfColors = [
      `rgb(226, 99, 132)`,
      `rgb(193, 63, 199)`,
      `rgb(150, 55, 73)`,
    ];
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
      this.perent.innerHTML += `<div class="page-box">
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
    </div>
    `;
      this.firstSpinner.classList.add("d-none");
    });
  }

  static labels = [];
  static priceHistory = [];

  fillChar(symbolsArray) {
    const secondSpinner = document.querySelector(".history-spinner");
    secondSpinner.classList.remove("d-none");
    const localLabels = [];
    const localPriceHistory = [];
    this.getHistory().then((charData) => {
      this.getPriceHistoryAndLabels(localLabels, localPriceHistory, charData);
      const data = {
        labels: CompanyInfo.labels[CompanyInfo.labels.length - 1],
        datasets: this.createCharDataSet(symbolsArray),
      };
      const config = {
        type: "line",
        data,
        options: {},
      };
      secondSpinner.classList.add("d-none");
      this.getAddCharToScreen(config, symbolsArray);
    });
  }

  createCharDataSet(symbolsArray) {
    let dataSetArray = [];
    console.log(CompanyInfo.priceHistory);
    for (let i = 0; i < CompanyInfo.labels.length; i++) {
      dataSetArray.push({
        label: `${symbolsArray[i]} Price History`,
        backgroundColor: this.arrayOfColors[i],
        borderColor: this.arrayOfColors[i],
        data: CompanyInfo.priceHistory[i].slice(
          -1 * CompanyInfo.priceHistory[0].length
        ),
      });
    }
    return dataSetArray;
  }

  getPriceHistoryAndLabels(localLabels, localPriceHistory, d) {
    for (let i = 0; i < d.historical.length; i += 30) {
      localLabels.unshift(d.historical[i].date);
      localPriceHistory.unshift(d.historical[i].close);
    }
    localLabels.sort((a, b) => {
      return Math.abs(Date.parse(a)) - Math.abs(Date.parse(b));
    });
    CompanyInfo.priceHistory.push(localPriceHistory);
    CompanyInfo.labels.unshift(localLabels);
    if (CompanyInfo.labels.length > 1) {
      CompanyInfo.labels.sort((a, b) => {
        return a[0] - b[0];
      });
    }
  }

  getAddCharToScreen(config, symbolsArray) {
    if (CompanyInfo.labels.length == symbolsArray.length) {
      CompanyInfo.addCharToScreen(config);
    }
  }

  static addCharToScreen(config) {
    var myChart = new Chart(document.getElementById("myChart"), config);
  }
}
