import axios from 'axios';

//Get api end points from env file
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
console.log(apiEndpoint);

async function getClients() {
  return axios.get(`${apiEndpoint}/clients`);
}

export { getClients };
