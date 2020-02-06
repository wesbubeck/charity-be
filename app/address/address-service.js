import axios from 'axios';

const getAddress = ({ street, city, state }) => {
    const address = `${street.trim().split(' ').join('+')},+${city.trim().split(' ').join('+')},+${state.trim().split(' ').join('+')}`;
    const key = 'AIzaSyBxJ2iIaZQMIpulz_V4R1W-DLG-vCP5T5I';
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`, {
    })
        .then((response) => {
            const { results } = response.data;
            // need to decide how to handle arrays and multiple responses
            return {
                formattedAddress: results[0].formatted_address,
                location: results[0].geometry.location,
                placeId: results[0].place_id,
            };
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
        });
};

module.exports = {
    getAddress,
};
