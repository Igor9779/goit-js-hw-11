import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = new SimpleLightbox('.img_wrap a', { 
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
    timeout: 4000,
    width: '400px',
    fontSize: '24px'
};

const perPage = 40;
let page = 1;
let searchPhotoKey = '';

loadMoreBtn.classList.add('is-hidden');

form.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();

    
}