import './css/styles.css';

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import countryCardTpl from '../templates/country.hbs';
import countriesTpl from '../templates/countries.hbs';
import { fetchCountries } from '../js/fetchCountries';


const refs = {
    countryCard: document.querySelector('.country-info'),
    countryList: document.querySelector('.country-list'),
    input: document.querySelector('#search-box'),
};

const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    const searchValue = event.target.value.trim();
    clearMarkup();

    if (searchValue !== '') {
        fetchCountries(searchValue)
            .then(countries => {
                if (countries.length === 1) {
                    renderOneCountryCardMarkup(countries);
                }

                else if (countries.length > 1 && countries.length <= 10) {
                    renderCountryCardsMarkup(countries);
                }

                else {
                    Notify.info(
                        'Too many matches found. Please enter a more specific name.',
                        {
                            timeout: 2000,
                        });
                };

            }).catch(error => {
                Notify.failure(
                    'Oops, there is no country with that name',
                    {
                        timeout: 2000,
                    });
            });
    };
};

function createCountryCardsMarkup(countries) {
    return countries.map(countriesTpl).join('');
};

function renderCountryCardsMarkup(countries) {

    const markup = createCountryCardsMarkup(countries);

    refs.countryList.innerHTML = markup;
};

function renderOneCountryCardMarkup(countries) {
    countries.map(country => {
        const allLangs = (country.languages.map(lang => lang.name).join(', '));
        const langMarkup = `<p><span class="ability-title">Languages:</span> ${allLangs} </p>`;
        const markup = countryCardTpl(country);

        refs.countryCard.insertAdjacentHTML('afterbegin', langMarkup);
        refs.countryCard.insertAdjacentHTML('afterbegin', markup);
    });

};

function clearMarkup() {
    refs.countryList.innerHTML = "";
    refs.countryCard.innerHTML = "";
};

