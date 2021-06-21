const button = document.querySelector(".btn");
const searchBar = document.querySelector(".form-control");
const results = document.querySelector(".search-results");
const spinner = document.querySelector(".spinner-border");
const ul = document.createElement("ul");
ul.classList.add("list-group", "list-group-flush");

async function getResults() {
  const res = await fetch(
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=AA&amp;limit=10&amp;exchange=NASDAQ"
  );
  const data = await res.json();
  return data;
}
function addToScreen() {
  spinner.classList.remove("d-none");
  getResults().then((data) => {
    for (let i = 0; i <= 10; i++) {
      ul.innerHTML += `<li><a href="./html/company.html?symbol=${data[i].symbol}" class="link-primary list-group-item">${data[i].name},(${data[i].symbol})</a></li>`;
    }
    spinner.classList.add("d-none");
    results.appendChild(ul);
  });
}

button.addEventListener("click", (event) => {
  ul.innerHTML = "";
  addToScreen();
});
