import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const debounce = require('lodash.debounce');

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY))

function onSearch(event) {
    const countryName = event.target.value.trim();
    if (countryName === '') {
        clearInnerHTML()
        return
    };
    fetchCountries(countryName)
        .then(data => {
            const items = data;
            clearInnerHTML()
            if (data.length > 10) {
                return Notify.info("Too many matches found. Please enter a more specific name.")
            };
            if (data.length === 1) {
                createCardCountry(items);
            } else {
                createListCountry(items);
            };
        })
        .catch(error => {
            clearInnerHTML()
            Notify.failure("Oops, there is no country with that name")
            return error;
        });
};

function createListCountry(items) {
    const markup = items
        .map((item) => `
        <li>
        <img src="${item.flags.svg}" 
        alt="${item.name.official}" 
        height="18" />
        <h2 style="display: inline-block; margin-left: 10px">${item.name.official}</h2>
        </li>`)
        .join('');
    refs.countryList.innerHTML = markup;
};

function createCardCountry(items) {
    const markup = items
        .map((item) => `
        <img src="${item.flags.svg}" 
        alt="${item.name.official}" 
        height="18" />
        <h2 style="display: inline-block; margin-left: 10px">${item.name.official}</h2>
        <p><b>Capital: </b>${item.capital}</p>
        <p><b>Population: </b>${item.population}</p>
        <p><b>Languages: </b>${Object.values(item.languages)}</p>`)
        .join('');
    refs.countryInfo.innerHTML = markup;
};

function clearInnerHTML() {
    refs.countryList.innerHTML = "";
    refs.countryInfo.innerHTML = "";
};