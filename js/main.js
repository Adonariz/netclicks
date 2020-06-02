`use strict`;
const POSTER_IMG = `https://image.tmdb.org/t/p/w185_and_h278_bestv2`;
const NO_POSTER = `./img/no-poster.jpg`;

const leftMenu = document.querySelector(`.left-menu`);
const burger = leftMenu.querySelector(`.hamburger`);
const showsSection = document.querySelector(`.tv-shows`);
const showsList = showsSection.querySelector(`.tv-shows__list`);

const searchForm = document.querySelector(`.search__form`);
const searchFormInput = document.querySelector(`.search__form-input`);
const loading = document.createElement(`div`);
loading.className = `loading`;

const modal = document.querySelector(`.modal`);
const modalClose = modal.querySelector(`.cross`);
const modalImg = modal.querySelector(`.tv-card__img`);
const modalTitle = modal.querySelector(`.modal__title`);
const modalGenresList = modal.querySelector(`.genres-list`);
const modalRating = modal.querySelector(`.rating`);
const modalDescription = modal.querySelector(`.description`);
const modalLink = modal.querySelector(`.modal__link`);

// Загрузка данных
class DBService {
  constructor() {
    this.API_KEY = `dad4f8e41037a3b722effc80e41a6e7f`;
    this.TMDB_URL = `https://api.themoviedb.org/3`;
  }

  async getData(url) {
    const response = await fetch(url);

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`);
    }
  }

  getTestData() {
    return this.getData(`test.json`);
  }

  getTestCard() {
    return this.getData(`card.json`);
  }

  getSearchResult(query) {
    const url = `${this.TMDB_URL}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru-RU`;
    return this.getData(url);
  }

  getShow(id) {
    const url = `${this.TMDB_URL}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`;
    return this.getData(url);
  }
}

// Запрос данных при поиске
searchForm.addEventListener(`submit`, evt => {
  evt.preventDefault();
  const value = searchFormInput.value.trim();

  if (value) {
    showsSection.append(loading);

    new DBService().getSearchResult(value).then((response) => {
      renderCards(response);
    });
  }

  searchFormInput.value = ``;
});

// Создание карточек
const createCardMarkup = response => {
  const {
    id,
    name: title,
    backdrop_path: backdropPath,
    poster_path: posterPath,
    vote_average: voteAverage,
  } = response;

  loading.remove();

  const vote = `${voteAverage ? `<span class="tv-card__vote">${voteAverage}</span>` : ``}`;
  const posterSrc = `${posterPath ? `${POSTER_IMG}/${posterPath}` : `${NO_POSTER}`}`;
  const backdrop = `${backdropPath ? `${POSTER_IMG}/${backdropPath}` : ``}`;

  return (
    `<a href="#" class="tv-card" data-show-id="${id}">
      ${vote}
      <img class="tv-card__img"
           src="${posterSrc}"
           data-backdrop="${backdrop}"
           alt="${title}">
      <h4 class="tv-card__head">${title}</h4>
    </a>`
  );
};

const renderCards = response => {
  showsList.textContent = ``;

  response.results.forEach(result => {
    const card = document.createElement(`li`);
    card.className = `tv-shows__item`;
    card.insertAdjacentHTML(`beforeend`, createCardMarkup(result));
    showsList.append(card);
  });
};

// Управление меню
burger.addEventListener(`click`, () => {
  leftMenu.classList.toggle(`openMenu`);
  burger.classList.toggle(`open`);
});

document.addEventListener(`click`, evt => {
  const target = evt.target;
  const dropdownCollection = leftMenu.querySelectorAll(`.dropdown`);

  if (!target.closest(`.left-menu`)) {
    leftMenu.classList.remove(`openMenu`);
    burger.classList.remove(`open`);

    dropdownCollection.forEach(dropdown => dropdown.classList.remove(`active`));
  }
});

leftMenu.addEventListener(`click`, evt => {
  const target = evt.target;
  const dropdown = target.closest(`.dropdown`);

  if (dropdown) {
    dropdown.classList.toggle(`active`);
    leftMenu.classList.add(`openMenu`);
    burger.classList.add(`open`);
  }
});

// Модальное окно
showsList.addEventListener(`click`, evt => {
  evt.preventDefault();

  const target = evt.target;
  const card = target.closest(`.tv-card`);

  if (card) {
    const id = card.dataset.showId;

    new DBService().getShow(id)
      .then(response => {
        const {
          poster_path: poster,
          genres,
          name: title,
          overview,
          vote_average: rating,
          homepage,
        } = response;

        modalImg.src = `${poster ? `${POSTER_IMG}/${poster}` : `${NO_POSTER}`}`;
        modalImg.alt = title;
        modalTitle.textContent = title;

        modalGenresList.textContent = ``;

        genres.forEach(genre => {
          const genreItem = `<li>${genre.name}</li>`;
          modalGenresList.insertAdjacentHTML(`beforeend`, genreItem);
        });

        modalRating.textContent = rating;
        modalDescription.textContent = overview;
        modalLink.href = homepage;
      });

    document.body.style.overflow = `hidden`;
    modal.classList.remove(`hide`);
    modal.addEventListener(`click`, modalClickHandler);
    modalClose.addEventListener(`click`, modalCloseClickHandler);
    document.addEventListener(`keydown`, documentEscKeyDownHandler);
  }
});

const modalCloseClickHandler = () => {
  modal.classList.add(`hide`);
  document.body.style.overflow = ``;
  modal.removeEventListener(`click`, modalClickHandler);
  modalClose.removeEventListener(`click`, modalCloseClickHandler);
  document.removeEventListener(`keydown`, documentEscKeyDownHandler);
};

const documentEscKeyDownHandler = evt => {
  if (evt.key === `Escape`) {
    modalCloseClickHandler();
  }
};

const modalClickHandler = evt => {
  const target = evt.target;
  const isOutside = target.classList.contains(`modal`);

  if (isOutside) {
    modalCloseClickHandler();
  }
};

// Ховер на карточку фильма
const changeImage = evt => {
  const target = evt.target;
  const card = target.closest(`.tv-shows__item`);

  if (card) {
    const img = card.querySelector(`img`);
    const backdrop = img.dataset.backdrop;

    if (backdrop) {
      [img.dataset.backdrop, img.src] = [img.src, img.dataset.backdrop];
    }
  }
};

showsList.addEventListener(`mouseover`, changeImage);
showsList.addEventListener(`mouseout`, changeImage);
