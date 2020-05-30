`use strict`;

const leftMenu = document.querySelector(`.left-menu`);
const burger = leftMenu.querySelector(`.hamburger`);
const shows = document.querySelector(`.tv-shows`);


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

shows.addEventListener(`mouseover`, evt => {

});
