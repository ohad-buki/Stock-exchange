class SearchResults {
  constructor(perentElement) {
    this.ul = document.createElement("ul");
    this.ul.classList.add("list-group", "list-group-flush");
    this.perent = perentElement;
    this.companySymbols = [];
  }
  async getResults() {
    const res = await fetch(
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=AA&amp;limit=10&amp;exchange=NASDAQ"
    );
    const data = await res.json();
    return data;
  }

  async getCompData(S) {
    const res = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${S}`
    );
    const compData = await res.json();
    return compData;
  }

  addToScreen(inputElemnt, spinner) {
    spinner.classList.remove("d-none");
    this.ul.innerHTML = "";
    this.getResults().then((data) => {
      if (inputElemnt.value == "") {
        for (let i = 0; i <= 10; i++) {
          this.companySymbols.push(data[i].symbol);
        }
        this.getCompData(this.companySymbols).then((fullCompData) => {
          for (let j = 0; j < 10; j++) {
            let color = "red";
            if (
              fullCompData.companyProfiles[j].profile.changesPercentage[1] ==
              "+"
            ) {
              color = "green";
            }
            this.ul.innerHTML += `<li><a href="./html/company.html?symbol=${fullCompData.companyProfiles[j].symbol}" class="link-primary list-group-item"> <img src="${fullCompData.companyProfiles[j].profile.image}" alt="Logo"><span class = "comp-name">${fullCompData.companyProfiles[j].profile.companyName},(${fullCompData.companyProfiles[j].symbol})</span><span class = "list-price">$${fullCompData.companyProfiles[j].profile.price}</span> <span class = ${color}>${fullCompData.companyProfiles[j].profile.changesPercentage}</span></a></li>`;
          }
        });
      } else {
        for (let j = 0; j < data.length; j++) {
          if (data[j].name == null) {
            continue;
          }
          if (
            data[j].symbol.includes(inputElemnt.value) ||
            data[j].name.includes(inputElemnt.value)
          ) {
            if (this.companySymbols.length < 30) {
              this.companySymbols.push(data[j].symbol);
            }
          }
        }
        this.getCompData(this.companySymbols).then((fullCompData) => {
          if (fullCompData.status == 404) {
            this.ul.innerHTML = `<li>No Match</li>`;
            return;
          }
          if (fullCompData.companyProfiles) {
            for (let i = 0; i < 10; i++) {
              let color = "red";
              if (
                fullCompData.companyProfiles[i].profile.changesPercentage[1] ==
                "+"
              ) {
                color = "green";
              }
              this.ul.innerHTML += `<li><a href="./html/company.html?symbol=${fullCompData.companyProfiles[i].symbol}" class="link-primary list-group-item"> <img src="${fullCompData.companyProfiles[i].profile.image}" alt="Logo"><span class = "comp-name">${fullCompData.companyProfiles[i].profile.companyName},(${fullCompData.companyProfiles[i].symbol})</span><span class = "list-price">$${fullCompData.companyProfiles[i].profile.price}</span> <span class = ${color}>${fullCompData.companyProfiles[i].profile.changesPercentage}</span></a></li>`;
            }
          } else {
            let color = "red";
            if (fullCompData.profile.changesPercentage[1] == "+") {
              color = "green";
            }
            this.ul.innerHTML += `<li><a href="./html/company.html?symbol=${fullCompData.symbol}" class="link-primary list-group-item"> <img src="${fullCompData.profile.image}" alt="Logo"><span class = "comp-name">${fullCompData.profile.companyName},(${fullCompData.symbol})</span><span class = "list-price">$${fullCompData.profile.price}</span> <span class = ${color}>${fullCompData.profile.changesPercentage}</span></a></li>`;
          }
        });
      }
      this.companySymbols = [];
      spinner.classList.add("d-none");
      this.perent.appendChild(this.ul);
    });
  }
}
