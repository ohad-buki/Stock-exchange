class SearchResults {
  constructor(perentElement) {
    this.ul = document.createElement("ul");
    this.ul.classList.add("list-group", "list-group-flush");
    this.perent = perentElement;
    this.companySymbols = [];
  }
  async getResults(s) {
    const res = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${s}&limit=10&exchange=NASDAQ`
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
    if (inputElemnt.value.length > 0) {
      this.getResults(inputElemnt.value).then((data) => {
        for (let i = 0; i < data.length; i++) {
          this.companySymbols.push(this.getCompData(data[i].symbol));
        }
        if (this.companySymbols.length < 1) {
          this.ul.innerHTML = `<li>No Match</li>`;
        } else {
          Promise.all(this.companySymbols).then((fullCompData) => {
            for (let i = 0; i < fullCompData.length; i++) {
              if (fullCompData[i].symbol) {
                this.insertHTML(
                  this.ul,
                  fullCompData[i],
                  inputElemnt.value,
                  this.getColor(fullCompData[i].profile.changesPercentage)
                );
              }
            }
          });
        }
        this.companySymbols = [];
        spinner.classList.add("d-none");
        this.perent.appendChild(this.ul);
      });
    }
  }

  getColor(changesPercentage) {
    let color = "red";
    if (changesPercentage[1] == "+") {
      color = "green";
    }
    return color;
  }

  addYellow(string, inputValue) {
    var reg = new RegExp("(" + inputValue + ")", "gi");
    return string.replace(reg, '<span class = "yellow">$1</span>');
  }

  insertHTML(perent, responseObj, inputValue, color) {
    let compName = this.addYellow(
      responseObj.profile.companyName.toUpperCase(),
      inputValue.toUpperCase()
    );
    let compSymbol = this.addYellow(
      responseObj.symbol.toUpperCase(),
      inputValue.toUpperCase()
    );
    if (inputValue == "") {
      compName = responseObj.profile.companyName;
      compSymbol = responseObj.symbol;
    }
    perent.innerHTML += `<li><a href="./html/company.html?symbol=${responseObj.symbol}" class="link-primary"> <img src="${responseObj.profile.image}" alt="Logo"><span class = "comp-name">${compName},(${compSymbol})</span><span class = "list-price">$${responseObj.profile.price}</span> <span class = ${color}>${responseObj.profile.changesPercentage}</span></a><button value = "${responseObj.symbol}" type = "button" class = "btn compare">Compare</button></li>`;
  }

  onClick(compareList, symbolArray, compareAllBtn) {
    this.ul.addEventListener("click", (e) => {
      if (e.target.classList.contains("compare")) {
        this.getCompData(e.target.value).then(function (data) {
          if (symbolArray.length < 3) {
            const compareBtn = document.createElement("button");
            compareBtn.setAttribute("type", "button");
            compareBtn.setAttribute("value", `${data.symbol}`);
            compareBtn.classList.add("btn", "compareBtn");
            compareBtn.innerHTML = `${data.symbol} X`;
            compareList.appendChild(compareBtn);
            symbolArray.push(`${data.symbol}`);
          }
          compareAllBtn.innerHTML = `<a href="./html/company.html?symbol=${symbolArray}">Compare</a>`;
        });
      }
    });
  }
}
