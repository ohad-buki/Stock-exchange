class Marquee {
  constructor(element) {
    this.divElement = document.createElement("div");
    this.divElement.classList.add("marquee-div");
    this.perent = element;
    this.tryingCount = 0;
  }
  addToClassList(className) {
    this.divElement.classList.add(className);
  }
  async getSymbols() {
    const res = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/nasdaq_constituent`
    );
    const data = res.json();
    const dataObjects = await data;
    const symbolArray = [];
    for (let i = 0; i < dataObjects.length; i++) {
      symbolArray.push(dataObjects[i].symbol);
    }
    return symbolArray;
  }
  async getCompInfo(symbols) {
    try {
      const res = await fetch(
        `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbols}`
      );
      const data = await res.json();
      return data;
    } catch {
      if (this.tryingCount < 15) {
        this.getCompInfo(symbols);
        this.tryingCount++;
      } else {
        return symbols;
      }
    }
  }

  addInnerHTML() {
    this.getSymbols().then((data) => {
      const arrayOfPromises = [];
      for (let i = 0; i < data.length; i++) {
        arrayOfPromises.push(this.getCompInfo(data[i]));
      }
      Promise.all(arrayOfPromises).then((d) => {
        for (let j = 0; j < d.length; j++) {
          if (d[j]) {
            this.divElement.innerHTML += `<a href="./html/company.html?symbol=${d[j].symbol}"<span class = "marquee-item">${d[j].symbol} <span class = "green">$${d[j].profile.price}</span></span></a>`;
          }
        }
        this.perent.appendChild(this.divElement);
      });
    });
  }
}
