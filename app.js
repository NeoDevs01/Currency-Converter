// ✅ Using Frankfurter API (stable, free, no key required)
const API_URL = "https://api.frankfurter.app/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = countryList[currCode];
    newOption.value = countryList[currCode];
    if (select.name === "from" && countryList[currCode] === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && countryList[currCode] === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (e) => updateFlag(e.target));
}

// ✅ Flag Updater
const updateFlag = (element) => {
  let currencyCode = element.value;
  let countryCode = Object.keys(countryList).find(
    (key) => countryList[key] === currencyCode
  );
  let newSrc = countryCode
    ? `https://flagsapi.com/${countryCode}/flat/64.png`
    : "https://via.placeholder.com/64?text=NA";
  element.parentElement.querySelector("img").src = newSrc;
};

// ✅ Fetch Exchange Rate
const updateExchangeRate = async () => {
  const amount = document.querySelector(".amount input");
  let amtVal = parseFloat(amount.value);
  if (!amtVal || amtVal <= 0) amtVal = 1;

  const from = fromCurr.value;
  const to = toCurr.value;

  msg.innerText = "Fetching rate...";

  try {
    const res = await fetch(`${API_URL}?amount=${amtVal}&from=${from}&to=${to}`);
    if (!res.ok) throw new Error("API request failed");

    const data = await res.json();
    const rate = data.rates[to];
    const result = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${from} = ${result} ${to}`;
  } catch (error) {
    msg.innerText = `Error: ${error.message}`;
  }
};

// ✅ Button & Page Load
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
