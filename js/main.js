`use strict`;

const leftMenu = document.querySelector(`.left-menu`);
const burger = leftMenu.querySelector(`.hamburger`);
const showsList = document.querySelector(`.tv-shows__list`);
const modal = document.querySelector(`.modal`);
const modalClose = modal.querySelector(`.cross`);

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
  const img = card.querySelector(`img`);

  if (img) {
    const backdrop = img.dataset.backdrop;

    if (backdrop) {
      [img.dataset.backdrop, img.src] = [img.src, img.dataset.backdrop];
    }
  }
};

showsList.addEventListener(`mouseover`, changeImage);
showsList.addEventListener(`mouseout`, changeImage);
