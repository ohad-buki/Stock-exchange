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
            this.insertHTML(
              this.ul,
              fullCompData.companyProfiles[j],
              inputElemnt.value,
              this.getColor(
                fullCompData.companyProfiles[j].profile.changesPercentage
              )
            );
          }
        });
      } else {
        for (let j = 0; j < data.length; j++) {
          if (data[j].name == null) {
            continue;
          }
          if (
            data[j].symbol
              .toUpperCase()
              .includes(inputElemnt.value.toUpperCase()) ||
            data[j].name.toUpperCase().includes(inputElemnt.value.toUpperCase())
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
              this.insertHTML(
                this.ul,
                fullCompData.companyProfiles[i],
                inputElemnt.value,
                this.getColor(
                  fullCompData.companyProfiles[i].profile.changesPercentage
                )
              );
            }
          } else {
            this.insertHTML(
              this.ul,
              fullCompData,
              inputElemnt.value,
              this.getColor(fullCompData.profile.changesPercentage)
            );
          }
        });
      }
      this.companySymbols = [];
      spinner.classList.add("d-none");
      this.perent.appendChild(this.ul);
      this.onClick();
    });
  }

  getColor(changesPercentage) {
    let color = "red";
    if (changesPercentage[1] == "+") {
      color = "green";
    }
    return color;
  }

  addYellow(string, inputValue) {
    let newString = string.split("");
    for (let i = 0; i < inputValue.length; i++) {
      if (newString[i] == inputValue[i]) {
        newString.splice(
          i,
          1,
          `<span class = "yellow">` + newString[i] + "</span>"
        );
      }
    }
    newString = newString.join("");
    return newString;
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

  onClick() {
    this.ul.addEventListener("click", (e) => {
      if (e.target.classList.contains("compare")) {
        this.getCompData(e.target.value).then(function (data) {
          console.log(data);
        });
      }
    });
  }
}
