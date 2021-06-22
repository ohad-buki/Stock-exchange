const button = document.querySelector(".btn");
const searchBar = document.querySelector(".form-control");
const results = document.querySelector(".search-results");
const spinner = document.querySelector(".spinner-border");
const ul = document.createElement("ul");
ul.classList.add("list-group", "list-group-flush");
const input = document.querySelector(".form-control");

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
        getCompData(data[i].symbol).then((fullCompData) => {
          let color = "red";
          if (fullCompData.profile.changesPercentage[1] == "+") {
            color = "green";
          }
          ul.innerHTML += `<li><a href="./html/company.html?symbol=${data[i].symbol}" class="link-primary list-group-item"> <img src="${fullCompData.profile.image}" alt="Logo"><span class = "comp-name">${data[i].name},(${data[i].symbol})</span><span class = "list-price">$${fullCompData.profile.price}</span> <span class = ${color}>${fullCompData.profile.changesPercentage}</span></a></li>`;
        });
      }
    } else {
      for (let j = 0; j < data.length; j++) {
        if (data[j].name == null) {
          continue;
        }
        if (
          data[j].symbol.includes(input.value) ||
          data[j].name.includes(input.value)
        ) {
          getCompData(data[j].symbol).then((fullCompData) => {
            let color = "red";
            if (fullCompData.profile.changesPercentage[1] == "+") {
              color = "green";
            }
            ul.innerHTML += `<li><a href="./html/company.html?symbol=${data[j].symbol}" class="link-primary list-group-item"> <img src="${fullCompData.profile.image}" alt="Logo"><span class = "comp-name">${data[j].name},(${data[j].symbol})</span><span class = "list-price">$${fullCompData.profile.price}</span> <span class = ${color}>${fullCompData.profile.changesPercentage}</span></a></li>`;
          });
        }
      }
    }
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
