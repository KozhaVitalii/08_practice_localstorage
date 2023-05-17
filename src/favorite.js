import { common } from './common';
import { createMarkup } from './helpers/createMarkup';
import { createModal } from './helpers/createModal';
import { instruments } from './helpers/instruments';

import 'basiclightbox/dist/basicLightbox.min.css';

// Памятаємо що для кожно html файлу повинен бути свій файл js(тобто своя точка входу), якщо робити так що до прикладу
// до всіх html точкой входу буде один js файл (приклад index.js), то це буде погано закінчюватися

const listUl = document.querySelector('.js-list');
const favorite = JSON.parse(localStorage.getItem(common.KEY_FAVORITE)) ?? [];

createMarkup(favorite, listUl);
listUl.addEventListener('click', onClick);

function onClick(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains('js-info')) {
        const product = findProduct(evt.target);
        createModal(product);
    }
}

function findProduct(elem) {
    const productId = Number(elem.closest('.js-card').dataset.id);
    return instruments.find(({ id }) => id === productId);
}




// додатково потрібно додати хрестик який буде видаляти з обранного

// function removeFromFavorite(event) {
//   const listItem = event.target.closest('.js-card');
//   if (listItem) {
//     const itemId = listItem.dataset.id;
//     // Удаление элемента из списка favorite
//     const updatedFavorite = favorite.filter(item => item.id !== itemId);
//     localStorage.setItem(common.KEY_FAVORITE, JSON.stringify(updatedFavorite));
//     // Удаление элемента из DOM
//     listItem.remove();
//   }
// }

// listUl.addEventListener('click', removeFromFavorite);
