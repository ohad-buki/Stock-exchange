class Marquee {
  constructor(element) {
    this.element = document.createElement(element);
  }
  addToClassList(className) {
    this.element.classList.add(className);
  }
  async getSymbols() {
    const res = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/nasdaq_constituent`
    );
    const data = res.json();
    const dataObjects = await data;
    const symbolArray = [];
    for (let i = 0; i < 30; i++) {
      symbolArray.push(dataObjects[i].symbol);
    }
    return symbolArray;
  }
  async getCompInfo(symbols) {
    const res = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbols}`
    );
    const data = await res.json();
    return data;
  }
  addInnerHTML() {
    this.getSymbols().then((data) => {
      this.getCompInfo(data).then((d) => {
        for (let i = 0; i < d.companyProfiles.length; i++) {
          this.element.innerHTML += `<span class = "marquee-item">${d.companyProfiles[i].symbol} <span class = "green">$${d.companyProfiles[i].profile.price}</span></span>`;
        }
      });
    });
  }
  appendTO(perent) {
    perent.appendChild(this.element);
  }
}
