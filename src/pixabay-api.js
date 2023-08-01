import axios from 'axios';

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "38585061-8c7c29b2cda7c4d8371dd54ff";

export async function fetchPhoto(q, page, perPage) {
    const url = `${BASE_URL}?key=${API_KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    return response.data;          
};