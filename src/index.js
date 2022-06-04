import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import {fetchCountries} from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputSearchBox = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const infoAboutCountry = document.querySelector('.country-info');

inputSearchBox.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY))


function handleInput(event) {
    const userInputValue = event.target.value.trim();
    if (userInputValue === '') {
        infoAboutCountry.innerHTML = '';
        countriesList.innerHTML = '';
        return Notiflix.Notify.failure('Oops, there is no country with that name');
    }

    fetchCountries(userInputValue)
        .then(countries => {
           
            if (countries.length > 10) {
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
            }
            if (countries.length === 1) {
                countriesList.innerHTML = '';
                const markupCountries = countries.map(({ name, flags, capital, languages, population }) => {
                return `
                 <div class="country-info__box">
                 <img class="country-list__img" src='${flags.svg}' width="30">
                 <h2 class="country-list__title">${name.official}</h2>
                 </div>
                  <div class="country-info__text">
                    <p> Capital : <span>${capital}</span></p>
                    <p> Population : <span>${population}</span></p>
                    <p> Langues : <span>${Object.values(languages)}</span></p>
                  </div> `
                })
                return (infoAboutCountry.innerHTML = markupCountries);
            }
            
            if (countries.length >= 2 && countries.length <= 10) {
                infoAboutCountry.innerHTML = '';
                const markupList = countries.map(({ name, flags }) =>
                    `<li class="country-list__item">
                    <img class="country-list__img" src='${flags.svg}' width="40" height="20" alt="flag">
                     <h2>${name.official}</h2>
                     </li>`)
                return countriesList.insertAdjacentHTML('beforeend', markupList.join(''));
            }
        })
        .catch(error => {
            infoAboutCountry.innerHTML = '';
            countriesList.innerHTML = '';
            console.log(error)
        });
}
