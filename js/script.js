'use strict';
// *Эта функция проверяет поддерживается ли браузером формат изображения webp и если поддерживается, то эта функция добавляет из css-документа внутрь html-документа класс с изобажением формата webp
function testWebP(callback) {

    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

    if (support == true) {
        document.querySelector('body').classList.add('webp');
    } else {
        document.querySelector('body').classList.add('no-webp');
    }
});
// *Burger
let menuBody = document.querySelector('.menu__body');
let iconMenu = document.querySelector('.icon-menu');
if (iconMenu) {
    iconMenu.addEventListener('click', function () {
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
        document.body.classList.toggle('_lock');
    })
}

;

// *Swiper
const brandsContent = document.querySelector('.brands__content');
if (brandsContent) {
    let mySwiper;
    function mobileSlider(e) {
        if (e.matches) {
            mySwiper = new Swiper(brandsContent, {
                slidesPerView: 'auto',
                grabCursor: true,
                watchOverflow: true,
            });
        } else if (!e.matches) {
            if (brandsContent.classList.contains('swiper-container-initialized')) {
                mySwiper.destroy()
            }
        }
    }
    const brandsMedia = window.matchMedia('(min-width: 991.98px)');
    brandsMedia.addListener(mobileSlider);
    mobileSlider(brandsMedia);
}

// * Фильтрация
let parentLinks = document.querySelectorAll('.sort__links');
if (parentLinks.length > 0) {
    for (let index = 0; index < parentLinks.length; index++) {
        const parentLink = parentLinks[index];
        parentLink.addEventListener('click', function (e) {
            if (e.target.tagName !== 'LI') return;
            const sortColumns = document.querySelectorAll('.sort__column');
            let filterAtr = e.target.dataset.find;
            for (const sortColumn of sortColumns) {
                sortColumn.classList.remove('show')
                if (sortColumn.classList.contains(filterAtr)) {
                    sortColumn.classList.add('show')
                }
            }
        });
        // Добавляем класс clicked к активным ссылкам
        // ept replace меняет одно значение строки на другое
        const sortLinks = document.querySelectorAll(".sort__link");
        for (let i = 0; i < sortLinks.length; i++) {
            const sortLink = sortLinks[i];
            sortLink.addEventListener("click", function () {
                let clicked = parentLink.querySelectorAll(".opened");
                clicked[0].className = clicked[0].className.replace(" opened", "");
                sortLink.classList.add('opened');
            });
        }
    }
}

// *Прокрутка при клике
const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
    for (let index = 0; index < menuLinks.length; index++) {
        const menuLink = menuLinks[index];
        menuLink.addEventListener('click', function (e) {
            const menuLink = e.target;
            // ept В условии if мы смотрим является ли menuLink.dataset.goto не false(тоесть не пустой и не со значением 0 ). Смотрим существуют ли элементы названия классов которых внутри menuLink.dataset.goto
            if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
                const goToBlock = document.querySelector(menuLink.dataset.goto);
                const goToBlockValue = goToBlock.getBoundingClientRect().top + pageYOffset - (document.querySelector('.header').offsetHeight);
                if (iconMenu.classList.contains('_active')) {
                    iconMenu.classList.remove('_active');
                    menuBody.classList.remove('_active');
                    document.body.classList.remove('_lock');
                }
                window.scrollTo({
                    top: goToBlockValue,
                    behavior: "smooth"
                });
                e.preventDefault();
            }
        });
    }
}
// * Выделение пунктов меню при прокрутке
const blocks = document.querySelectorAll('.block');
window.addEventListener('scroll', scrollColor);
function scrollColor() {
    let current;
    for (let index = 0; index < blocks.length; index++) {
        const block = blocks[index];
        const blockTop = block.getBoundingClientRect().top + window.pageYOffset - (document.querySelector('.header').offsetHeight + (document.documentElement.clientHeight / 8));
        if (pageYOffset >= blockTop) {
            current = block.id;
        }
    }
    const scrollLinks = document.querySelectorAll('.menu__link[data-scroll]');
    for (let index = 0; index < scrollLinks.length; index++) {
        const scrollLink = scrollLinks[index];
        scrollLink.classList.remove('opened');
        if (scrollLink.dataset.scroll == current) {
            scrollLink.classList.add('opened')
        }
    }
}
scrollColor();

// *Сменяем цвет header при скролле
if (window.matchMedia('(min-width: 991.98px)')) {
    const hello = document.querySelector('.hello');
    const header = document.querySelector('.header');
    if (hello) {
        window.addEventListener('scroll', headerColor);
        function headerColor() {
            const headerValue = header.getBoundingClientRect().bottom + window.pageYOffset;
            const helloValue = hello.getBoundingClientRect().bottom + window.pageYOffset;
            if (headerValue >= helloValue) {
                header.classList.add('header_b')
            } else {
                header.classList.remove('header_b')
            }
        }
        headerColor();
    }
}

// * LazyLoading
const lazyImages = document.querySelectorAll('img[data-lazy]');
const windowHieght = document.documentElement.clientHeight;
const lazyLimit = 3;
let lazyImagesPositions = [];

window.addEventListener('scroll', lazyScroll);
function lazyScroll() {
	if (lazyImages.length > 0) {
		lazyScrollCheck();
	}
}
if (lazyImages.length > 0) {
	for (let index = 0; index < lazyImages.length; index++) {
		const lazyImage = lazyImages[index];
		if (lazyImage.dataset.lazy) {
			lazyImagesPositions.push(lazyImage.getBoundingClientRect().top + pageYOffset - (windowHieght / lazyLimit));
			lazyScrollCheck();
		}
	}
}

// image lazy
function lazyScrollCheck() {
	let imgIndex = lazyImagesPositions.findIndex(
		item => pageYOffset > item - (windowHieght / lazyLimit)
	);
	if (imgIndex >= 0) {
		if (lazyImages[imgIndex].dataset.lazy) {
			lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.lazy;
			lazyImages[imgIndex].removeAttribute('data-lazy');
			if (lazyImages[imgIndex].previousElementSibling) {
				const webp = lazyImages[imgIndex].previousElementSibling;
				if (webp.tagName == 'SOURCE') {
					const dataImgSrc = lazyImages[imgIndex].getAttribute('src').split('.');
					if (dataImgSrc[1] !== 'svg') {
						dataImgSrc[1] = 'webp'
					}
					const dataImgSrcWebp = dataImgSrc.join('.');
					webp.setAttribute('srcset', dataImgSrcWebp);
					webp.removeAttribute('data-lazyset');
				}
			}
		}
		delete lazyImagesPositions[imgIndex]
	}
}
