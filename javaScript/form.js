class Forminput {
  constructor(perentElement) {
    this.perent = perentElement;
    this.element = document.createElement("div");
    this.inputElemnt = document.createElement("input");
    this.buttonElement = document.createElement("button");
    this.header = document.createElement("div");
    this.spinner = document.createElement("div");
    this.compare = document.createElement("div");
    this.compareList = document.createElement("div");
    this.compareList.classList.add("listOfSymbols");
    this.compare.classList.add("compare-list");
    this.buttonElement.innerHTML = `search`;
    this.header.classList.add("h1-wrapper");
    this.header.innerHTML = `Search NASDAQ Stocks`;
    this.spinner.classList.add("spinner-wrapper");
    this.spinner.innerHTML = `<div class="spinner-border d-none" role="status">
    <span class="visually-hidden">Loading...</span></div>`;
    this.compare.innerHTML = `<div class = "compareAllBtn">Compare</div>`;
    this.compare.addEventListener("click", (e) => {});
    this.compare.insertBefore(this.compareList, this.compare.firstChild);
    setAttributes(buttonAtt, this.buttonElement);
    setAttributes(inputAtt, this.inputElemnt);
    this.element.classList.add("input-group");
    this.element.append(this.inputElemnt, this.buttonElement, this.spinner);
    this.perent.appendChild(this.header);
    this.perent.insertBefore(this.header, this.perent.firstChild);
    this.perent.appendChild(this.element);
    this.perent.appendChild(this.compare);
    this.perent.insertBefore(this.compare, this.header);
  }

  onSearch(callback) {
    this.buttonElement.addEventListener("click", (event) => {
      callback(this.inputElemnt, this.spinner);
    });
    this.inputElemnt.addEventListener(
      "keyup",
      this.debounce(() => {
        callback(this.inputElemnt, this.spinner);
      })
    );
  }

  addToCompare(callback) {
    callback(this.compareList);
  }

  addClass(elementClass, inputElemntClass, buttonClass) {
    this.element.classList.add(elementClass);
    this.inputElemnt.classList.add(inputElemntClass);
    this.buttonElement.classList.add(buttonClass);
  }
  removeClass(elementClass, inputElemntClass, buttonClass) {
    this.element.classList.remove(elementClass);
    this.inputElemnt.classList.remove(inputElemntClass);
    this.buttonElement.classList.remove(buttonClass);
  }
  addInnerHTML(elementInnerHTML, inputElemntInnerHTML, buttonInnerHTML) {
    this.element.innerHTML += elementInnerHTML;
    this.inputElemnt.innerHTML += inputElemntInnerHTML;
    this.buttonElement.innerHTML += buttonInnerHTML;
  }
  debounce(func, timeout = 400) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }
}

function setAttributes(obj, element) {
  Object.entries(obj).forEach(([key, value]) => {
    element.setAttribute(`${key}`, `${value}`);
  });
}

const inputAtt = {
  type: "search",
  placeholder: "Search",
  "aria-label": "Search",
  "aria-describedby": "search-addon",
  class: "form-control rounded",
};

const buttonAtt = {
  class: "btn",
  type: "button",
};
