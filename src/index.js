import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchPhoto } from './pixabay-api.js';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = new SimpleLightbox('.img-wrapper a', { 
    captionsData: 'alt',
    captionDelay: 250,
});
    
const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
};

const notifyParams = {
    position: 'center-center',
    timeout: 2000,
    width: '400px',
    fontSize: '24px'
};

const perPage = 40;
let page = 1;
let searchPhotoKey = '';

refs.loadMoreBtn.classList.add('is-hidden');

refs.form.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();

    refs.gallery.innerHTML = '';
    page = 1;
    const { searchQuery } = e.currentTarget.elements;
    searchPhotoKey = searchQuery.value
        .trim()
        .toLowerCase()
        .split(' ')
        .join('+');

    if (searchPhotoKey === '') {
        Notify.info('Enter your request!', notifyParams);
        return;
    }

    fetchPhoto(searchPhotoKey, page, perPage)
        .then(data => {
            const resultSearch = data.hits;
            if (data.totalHits === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.', notifyParams);
            } else {
                Notify.info(`Hooray! We found ${data.totalHits} images.`, notifyParams);
                createMarkup(resultSearch);
                lightbox.refresh();

            };
            if (data.totalHits > perPage) {
                refs.loadMoreBtn.classList.remove('is-hidden');
                window.addEventListener('scroll', showLoadMorePages);
            };
        })
        .catch(onFetchError);

    refs.loadMoreBtn.addEventListener('click', onClickBtnLoadMore);

    e.currentTarget.reset();
};

function createMarkup(searchResult) {
    const photosArr = searchResult.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-cards">
        <div class="img-wrapper">
            <a class="gallery-link" href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" width="300" loading="lazy" />
            </a>
        </div>
        <div class="info">
            <p class="info-item">
            <b>Likes: ${likes}</b>
            </p>
            <p class="info-item">
            <b>Views: ${views}</b>
            </p>
            <p class="info-item">
            <b>Comments: ${comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads: ${downloads}</b>
            </p>
        </div>
        </div>`
    });
    refs.gallery.insertAdjacentHTML("beforeend", photosArr.join(''));
};

function onClickBtnLoadMore() {
    page += 1;
    fetchPhoto(searchPhotoKey, page, perPage)
        .then(data => {
            const searchResult = data.hits;
            const pageNumber = Math.ceil(data.totalHits / perPage);
            
            createMarkup(searchResult);
            if (page === pageNumber) {
                refs.loadMoreBtn.classList.add('is-hidden');
                Notify.info("We're sorry, but you've reached the end of search results.", notifyParams);
                refs.loadMoreBtn.removeEventListener('click', onClickBtnLoadMore);
                window.removeEventListener('scroll', showLoadMorePages);
            };
            lightbox.refresh();
        })
        .catch(onFetchError);
};

function onFetchError() {
    Notify.failure('Oops! Something went wrong! Try reloading the page or make another choice!', notifyParams);
};

function showLoadMorePages() {
    if (pageEnd()) {
        onClickBtnLoadMore();
    };
};

function pageEnd() {
    return (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
    );
}