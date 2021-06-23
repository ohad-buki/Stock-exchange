const button = document.querySelector(".btn");
const searchBar = document.querySelector(".form-control");
const results = document.querySelector(".search-results");
const spinner = document.querySelector(".spinner-border");
const ul = document.createElement("ul");
ul.classList.add("list-group", "list-group-flush");
const input = document.querySelector(".form-control");
let companySymbols = [];
const marqueeContainner = document.querySelector(".marquee-container");

async function getPricesMarquee(symbols) {
  const res = await fetch(
    `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quote-short/${symbols}`
  );
  const data = await res.json();
  return data;
}

async function getResults() {
  const res = await fetch(
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=AA&amp;limit=10&amp;exchange=NASDAQ"
  );
  const data = await res.json();
  return data;
}

async function getCompData(S) {
  const res = await fetch(
    `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${S}`
  );
  const compData = await res.json();
  return compData;
}

function addToScreen() {
  spinner.classList.remove("d-none");
  ul.innerHTML = "";
  getResults().then((data) => {
    if (input.value == "") {
      for (let i = 0; i <= 10; i++) {
        companySymbols.push(data[i].symbol);
      }
      getCompData(companySymbols).then((fullCompData) => {
        for (let j = 0; j < 10; j++) {
          let color = "red";
          if (
            fullCompData.companyProfiles[j].profile.changesPercentage[1] == "+"
          ) {
            color = "green";
          }
          ul.innerHTML += `<li><a href="./html/company.html?symbol=${fullCompData.companyProfiles[j].symbol}" class="link-primary list-group-item"> <img src="${fullCompData.companyProfiles[j].profile.image}" alt="Logo"><span class = "comp-name">${fullCompData.companyProfiles[j].profile.companyName},(${fullCompData.companyProfiles[j].symbol})</span><span class = "list-price">$${fullCompData.companyProfiles[j].profile.price}</span> <span class = ${color}>${fullCompData.companyProfiles[j].profile.changesPercentage}</span></a></li>`;
        }
      });
    } else {
      for (let j = 0; j < data.length; j++) {
        if (data[j].name == null) {
          continue;
        }
        if (
          data[j].symbol.includes(input.value) ||
          data[j].name.includes(input.value)
        ) {
          companySymbols.push(data[j].symbol);
        }
      }
      getCompData(companySymbols).then((fullCompData) => {
        console.log(fullCompData);
        if (fullCompData.status == 404) {
          ul.innerHTML = `<li>No Match</li>`;
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
            ul.innerHTML += `<li><a href="./html/company.html?symbol=${fullCompData.companyProfiles[i].symbol}" class="link-primary list-group-item"> <img src="${fullCompData.companyProfiles[i].profile.image}" alt="Logo"><span class = "comp-name">${fullCompData.companyProfiles[i].profile.companyName},(${fullCompData.companyProfiles[i].symbol})</span><span class = "list-price">$${fullCompData.companyProfiles[i].profile.price}</span> <span class = ${color}>${fullCompData.companyProfiles[i].profile.changesPercentage}</span></a></li>`;
          }
        } else {
          let color = "red";
          if (fullCompData.profile.changesPercentage[1] == "+") {
            color = "green";
          }
          ul.innerHTML += `<li><a href="./html/company.html?symbol=${fullCompData.symbol}" class="link-primary list-group-item"> <img src="${fullCompData.profile.image}" alt="Logo"><span class = "comp-name">${fullCompData.profile.companyName},(${fullCompData.symbol})</span><span class = "list-price">$${fullCompData.profile.price}</span> <span class = ${color}>${fullCompData.profile.changesPercentage}</span></a></li>`;
        }
      });
    }
    companySymbols = [];
    spinner.classList.add("d-none");
    results.appendChild(ul);
  });
}

function debounce(func, timeout = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

button.addEventListener("click", (event) => {
  addToScreen();
});

input.addEventListener("keyup", debounce(addToScreen));

const marqueeMain = new Marquee("div");
marqueeMain.addToClassList("marquee-div");
marqueeMain.addInnerHTML();
marqueeMain.appendTO(marqueeContainner);
