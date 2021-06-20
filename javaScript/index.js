const button = document.querySelector(".btn");
const searchBar = document.querySelector(".form-control");
const ul = document.querySelector(".list-group");
const spinner = document.querySelector(".spinner-border");

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
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerHTML = `<a href="./html/company.html?symbol=${data[i].symbol}" class="link-primary">${data[i].name},(${data[i].symbol})</a></a>`;
      ul.appendChild(li);
      spinner.classList.add("d-none");
    }
  });
}

button.addEventListener("click", (event) => {
  ul.innerHTML = "";
  addToScreen();
});
