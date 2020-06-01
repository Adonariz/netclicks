`use strict`;
const POSTER_IMG = `https://image.tmdb.org/t/p/w185_and_h278_bestv2`;
const NO_POSTER = `./img/no-poster.jpg`;
const TMDB_API_KEY = `dad4f8e41037a3b722effc80e41a6e7f`;

const leftMenu = document.querySelector(`.left-menu`);
const burger = leftMenu.querySelector(`.hamburger`);
const showsList = document.querySelector(`.tv-shows__list`);
const modal = document.querySelector(`.modal`);
const modalClose = modal.querySelector(`.cross`);

// Загрузка данных
class DBService {
  async getData(url) {
    const response = await fetch(url);

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`);
    }
  }

  async getTestData() {
    return this.getData(`test.json`);
  }
}

new DBService().getTestData()
  .then((response) => {
    renderCards(response);
  });

const createCardMarkup = (response) => {
  const {
    name: title,
    backdrop_path: backdropPath,
    poster_path: posterPath,
    vote_average: voteAverage,
  } = response;

  const vote = `${voteAverage ? `<span class="tv-card__vote">${voteAverage}</span>` : ``}`;
  const posterSrc = `${posterPath ? `${POSTER_IMG}/${posterPath}` : `${NO_POSTER}`}`;
  const backdrop = `${backdropPath ? `${POSTER_IMG}/${backdropPath}` : ``}`;

  return (
    `<a href="#" class="tv-card">
      ${vote}
      <img class="tv-card__img"
           src="${posterSrc}"
           data-backdrop="${backdrop}"
           alt="${title}">
      <h4 class="tv-card__head">${title}</h4>
    </a>`
  )
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
