class Forminput {
  constructor(perentElement) {
    this.element = document.createElement("div");
    this.inputElemnt = document.createElement("input");
    this.buttonElement = document.createElement("button");
    this.header = document.createElement("div");
    this.spinner = document.createElement("div");
    this.buttonElement.innerHTML = `search`;
    this.perent = perentElement;
    this.header.classList.add("h1-wrapper");
    this.header.innerHTML = `Search NASDAQ Stocks`;
    this.spinner.classList.add("spinner-wrapper");
    this.spinner.innerHTML = `<div class="spinner-border d-none" role="status">
    <span class="visually-hidden">Loading...</span></div>`;
    setAttributes(buttonAtt, this.buttonElement);
    setAttributes(inputAtt, this.inputElemnt);
    this.element.classList.add("input-group");
    this.element.append(this.inputElemnt, this.buttonElement, this.spinner);
    this.perent.appendChild(this.header);
    this.perent.insertBefore(this.header, this.perent.firstChild);
    this.perent.appendChild(this.element);
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
