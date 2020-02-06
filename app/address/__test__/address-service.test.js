import mockAxios from 'jest-mock-axios';
import addressApi from '../address-service';

const mockQueryArg = {
    street: '100 first street ',
    city: 'gotham city',
    state: 'New York',
};

describe('AddressService', () => {
    afterEach(() => {
        mockAxios.mockReset();
    });

    describe('getAddress', () => {
        test('should call axios get', () => {
            const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=100+first+street,+gotham+city,+New+York&key=AIzaSyBxJ2iIaZQMIpulz_V4R1W-DLG-vCP5T5I';
            addressApi.getAddress(mockQueryArg);
            expect(mockAxios.get).toHaveBeenCalledWith(url, {});
        });
        test('should return data from api response', () => {
            const data = {
                results: [
                    {
                        address_components: [{}, {}, {}],
                        formatted_address: '100 SE River Edge Rd, Tequesta, FL 33469, USA',
                        geometry: {
                            location: {
                                lat: '12.2222',
                                lng: '32.3333',
                            },
                            bounds: {},
                            location_type: 'ROOFTOP',
                        },
                        place_id: '123rts',
                    },
                ],
            };
            const returnedData = {
                formattedAddress: data.results[0].formatted_address,
                location: data.results[0].geometry.location,
                placeId: data.results[0].place_id,
            };
            mockAxios.mockResponse(data);
            expect(addressApi.getAddress(mockQueryArg)).resolves.toEqual(returnedData);
        });
    });
});
