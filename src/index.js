import "./css/styles.css";
import debounce from "lodash.debounce";
import Notiflix, { Notify } from "notiflix";
import { fetchCountries } from "./fetchCountries";

const searchBoxEl = document.getElementById("search-box");
const countryListEl = document.querySelector(".country-list");
const countryInfoEl = document.querySelector(".country-info");

const handleSearchCountry = async (event) => {
  const searchQuery = event.target.value.trim();
  countryListEl.innerHTML = "";
  countryInfoEl.innerHTML = "";

  if (searchQuery !== "") {
    try {
      const countries = await fetchCountries(searchQuery);

      if (2 <= countries.length && countries.length <= 10) {
        const countriesMarkup = countries
          .map(
            (country) => `
              <li class="list-item">
                <img class="flag" src="${country.flags.png}" width="80px" />
                ${country.name.common}
              </li>
            `
          )
          .join("");

        countryListEl.insertAdjacentHTML("beforeend", countriesMarkup);
      }

      if (countries.length > 10) {
        Notiflix.Notify.info(
          "Too many matches found. Please enter a more specific name."
        );
      }

      if (countries.length === 1) {
        const country = countries[0];
        const countryMarkup = `
          <h2>
            <img class="flag" src="${country.flags.png}" width="80px" />
            ${country.name.common}
          </h2>
          <p>Capital: ${country.capital}</p>
          <p>Population: ${country.population}</p>
          <p>Languages: ${Object.values(country.languages).join(", ")}</p>
        `;
        countryInfoEl.innerHTML = countryMarkup;
      }
    } catch (error) {
      Notiflix.Notify.failure("Oops, there is no country with that name");
      searchBoxEl.value = '';
    }
  }
};

const DEBOUNCE_DELAY = 300;

searchBoxEl.addEventListener(
  "input",
  debounce(handleSearchCountry, DEBOUNCE_DELAY)
);
