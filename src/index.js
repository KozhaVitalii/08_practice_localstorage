import { common } from './common';
import { createMarkup } from './helpers/createMarkup';
import { createModal } from './helpers/createModal';
import { instruments } from './helpers/instruments';

import 'basiclightbox/dist/basicLightbox.min.css';


// наш лінк на инпут пошука
const search = document.querySelector('.js-search');
const listUl = document.querySelector('.js-list');
const favoriteArr = JSON.parse(localStorage.getItem(common.KEY_FAVORITE))??[]; // створюємо змінну для localStorage і заповнюємо за замовчуванням якщо там вже є 
// збережені данні, якщо ні то пусто.Це потрібно для того, щоб коли сторінка перезавантажується щоб данні які вже збережені у сховищі підтягувались за
// замовчуванням.Якщо цього не зробити а лише вказати порожній масив, то при додаванні обїектів і послідуючому перезавантажені сторінки, і додатковому додаванні
// обїекта, сховище оновиться і залишиться останній обїєкт.Використовуємо оператор нульового приєднання "??" який по дефолту, якщо нічого немає то присвоє 
// пустий масив.
const basketArr = JSON.parse(localStorage.getItem(common.KEY_BASKET))??[];


// Приклад:
//  {
//         id: 1,
//         img: "https://static.dnipro-m.ua/cache/products/4878/catalog_origin_269592.jpg",
//         name: "Шуруповерт",
//         price: 150,
//         description: "Мережевий дриль шуруповерт ТD-30 надійний помічник для робіт по дому та в невеликій майстерні"
//     },



// запишемо функцію яка буде створювати розмітку для наших карток:
// function createMarkup(array) {
//     const markup = array.map(
//         ({ id, img, name }) => `<li data-id="${id}" class="js-card">
//         <img src="${img}" alt="${name}" width="300">
//         <h2>${name}</h2>
//         <p><a class="js-info" href="#">More information</a></p>
//         <div>
//             <button class="js-favorite">Add to favorite</button>
//             <button class="js-basket">Add to basket</button>
//         </div>
//     </li>`
//     )
//         .join('');

//     listUl.innerHTML = markup;
// }

// Спочатку ми написали функцію яка створює розмітку у цьому файлі, але до цієї функції ми звертаємося і на других сторінках
// нашого сайту, тому доцільніше винести ії в окремий файл і через імпорт звертатися до неї.Тому наступний запис буде лише
// виклик функції з вказаними необхідними параметрами:


createMarkup(instruments, listUl); // створюємо розмітку нашого списку (попередньо ми винесли функцію створення розмітки в
// окремий файл й імпортуємого його)

// Додаємо на наш список прослуховувача подій:
listUl.addEventListener('click', onClick);

// Обробник подій в якому ми будемо отримувати івент після чого нам потрібно реалізувати делегування подій, за допомогою делегування ми будемо
// прослуховувати три елемента: More information, Add to favorite, Add to basket, тому у нас буде три окремих кейса з if, з доволі великою логікою
function onClick(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains('js-info')) {
        const product = findProduct(evt.target);
        createModal(product)
    }

    if (evt.target.classList.contains('js-basket')) { 
        const product = findProduct(evt.target);
        basketArr.push(product);
        localStorage.setItem(common.KEY_BASKET, JSON.stringify(basketArr))
    }

    if (evt.target.classList.contains('js-favorite')) { 
        const product = findProduct(evt.target);
        const inStorage = favoriteArr.some(({ id }) => id === product.id); // зробимо додаткову перевірку, якщо в обраних товарах вже є такий обїект, то 
        // не додавати його в favoriteArr:
        if (inStorage) {
            return;
        }
        favoriteArr.push(product);
        localStorage.setItem(common.KEY_FAVORITE, JSON.stringify(favoriteArr))
    }
}

// Було б цікаво отримати всю інформацию про той елемент який ми вибрали, тому нам потрібно знайти об'єкт в масиві об'ектів який буде
// вміщати все інфо про цей об'єкт. Такий пошук ми будемо робити і для модалки через "More information" і для додати в обрані "Add to favorite".
// Тому логіку такого пошуку винесемо в окрему функцію:

function findProduct(elem) {
    const productId = Number(elem.closest('.js-card').dataset.id); // зчітуємо id з картки, для цього робимо деструктуризацію з дата атрибутів, і далі
        // звертаємося викликаємо метод closest(), тобто візьми з нашого елемента по якому ми клікнули першого батька в якого клас '.js-card' і з його
        // властивості dataset деструктуризуй його id-шник, той що ми додавали як data-id="${id}".
    return instruments.find(({ id }) => id === productId); // повертає результат перебору нашого масиву обїектів з співпадінням по id. Використовуєм метод 
    // find, в якому вказуємо деструктуризацію по id
}

// Тепер нам потрібно створити модалку, а для цього підключимо бібліотеку