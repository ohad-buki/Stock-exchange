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

  static arrayOfSymbolsLocal = [];

  addDataToScreen(arrayOfSymbolsImport) {
    this.firstSpinner.classList.remove("d-none");
    CompanyInfo.arrayOfSymbolsLocal.push(this.getCompanyData());
    if (CompanyInfo.arrayOfSymbolsLocal.length == arrayOfSymbolsImport.length) {
      Promise.all(CompanyInfo.arrayOfSymbolsLocal).then((data) => {
        for (let i = 0; i < data.length; i++) {
          let color = "red";
          if (data[i].profile.changesPercentage[1] == "+") {
            color = "green";
          }
          this.perent.innerHTML += `<div class="page-box">
          <div class="spinner-wrapper">
            <div class="spinner-border first-spinner d-none" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div class="header">
            <div class="logo"><img src="${data[i].profile.image}" alt="Logo"></div>
            <div class="name">${data[i].profile.companyName} (${data[i].profile.industry})</div>
          </div>
          <div class="price">Stock price: $${data[i].profile.price} <span class = ${color}>${data[i].profile.changesPercentage}</span></div>
          <div class="discription">${data[i].profile.description}</div>
        </div>
        `;
        }
        this.firstSpinner.classList.add("d-none");
      });
    }
  }

  static labels = [];
  static priceHistory = [];
  static arrayOfHistoryPromises = [];

  fillChar(symbolsArray) {
    const secondSpinner = document.querySelector(".history-spinner");
    secondSpinner.classList.remove("d-none");
    CompanyInfo.arrayOfHistoryPromises.push(this.getHistory());
    if (CompanyInfo.arrayOfHistoryPromises.length == symbolsArray.length) {
      Promise.all(CompanyInfo.arrayOfHistoryPromises).then((charData) => {
        for (let i = 0; i < charData.length; i++) {
          const localLabels = [];
          const localPriceHistory = [];
          this.getPriceHistoryAndLabels(
            localLabels,
            localPriceHistory,
            charData[i]
          );
          const data = {
            labels: CompanyInfo.labels[0].slice(
              1,
              CompanyInfo.labels[0].length
            ),
            datasets: this.createCharDataSet(symbolsArray),
          };
          const config = {
            type: "line",
            data,
            options: {},
          };
          secondSpinner.classList.add("d-none");
          this.getAddCharToScreen(config, symbolsArray);
        }
      });
    }
  }

  createCharDataSet(symbolsArray) {
    let dataSetArray = [];
    for (let i = 0; i < CompanyInfo.labels.length; i++) {
      console.log(CompanyInfo.labels[i]);
      dataSetArray.push({
        label: `${CompanyInfo.labels[i][0]} Price History`,
        backgroundColor: this.arrayOfColors[i],
        borderColor: this.arrayOfColors[i],
        data: CompanyInfo.priceHistory[i].slice(
          -1 * CompanyInfo.priceHistory[0].length
        ),
      });
      console.log(CompanyInfo.labels[i]);
    }
    return dataSetArray;
  }

  getPriceHistoryAndLabels(localLabels, localPriceHistory, d) {
    for (let i = 0; i < d.historical.length; i += 30) {
      localLabels.unshift(d.historical[i].date);
      localPriceHistory.unshift(d.historical[i].close);
    }
    localLabels.unshift(d.symbol);
    CompanyInfo.priceHistory.unshift(localPriceHistory);
    CompanyInfo.labels.unshift(localLabels);
    if (CompanyInfo.labels.length > 1) {
      CompanyInfo.labels.sort((a, b) => {
        return a.length - b.length;
      });
      CompanyInfo.priceHistory.sort((a, b) => {
        return a.length - b.length;
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
