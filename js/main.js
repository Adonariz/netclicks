`use strict`;

const leftMenu = document.querySelector(`.left-menu`);
const burger = leftMenu.querySelector(`.hamburger`);

burger.addEventListener(`click`, () => {
  leftMenu.classList.toggle(`openMenu`);
  burger.classList.toggle(`open`);
});
