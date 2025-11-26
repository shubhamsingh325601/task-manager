import axios from "axios";
const api_uri = "https://jsonplaceholder.typicode.com/users"

export const getListing = async () => {
    const response = await axios.get(api_uri);
    return response.data;
}