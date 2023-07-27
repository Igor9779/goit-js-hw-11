import axios from 'axios';

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "u_r0to1j8u8q";

export async function fetchPhoto(q, page, perPage) {
    const url = `${BASE_URL}?key=${API_KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    return response.data;          
};