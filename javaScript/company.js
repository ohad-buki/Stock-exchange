const urlPage = new URLSearchParams(window.location.search);
const companyS = urlPage.get("symbol");
const companyName = document.querySelector(".name");
const logo = document.querySelector(".logo");
const price = document.querySelector(".price");
const percent = document.querySelector(".percent");
const disc = document.querySelector(".discription");
const char = document.querySelector(".char");
const firstSpinner = document.querySelector(".first-spinner");
const secondSpinner = document.querySelector(".history-spinner");
const labels = [];
const priceHistory = [];

async function getCompanyData() {
  const res = await fetch(
    `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${companyS}`
  );
  const data = await res.json();
  return data;
}

async function getHistory() {
  const res = await fetch(
    `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${companyS}?serietype=line`
  );
  const dataHistory = await res.json();
  return dataHistory;
}

function addDataToScreen() {
  firstSpinner.classList.remove("d-none");
  getCompanyData().then((data) => {
    let color = "red";
    if (data.profile.changesPercentage[1] == "+") {
      color = "green";
    }
    logo.innerHTML = `<img src="${data.profile.image}" alt="Logo">`;
    companyName.innerHTML = `${data.profile.companyName} (${data.profile.industry})`;
    price.innerHTML = `Stock price: $${data.profile.price} <span class = ${color}>${data.profile.changesPercentage}</span>`;
    disc.innerHTML = `${data.profile.description}`;
    firstSpinner.classList.add("d-none");
  });
}

function fillCharArrays() {
  secondSpinner.classList.remove("d-none");
  getHistory().then((d) => {
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
    secondSpinner.classList.add("d-none");
  });
}

addDataToScreen();
fillCharArrays();
