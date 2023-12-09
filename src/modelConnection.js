const axios = require('axios');

const makePredictionRequest = async (dataInput) => {
    try {
        const response = await axios.post('ganti_dengan_API_model', {
            dataInput,
            // Include any required data for prediction in the request body
            // For example: data: 'some_data'
        });

        console.log('Prediction:', response.data.prediction);
    } catch (error) {
        console.error('Error making prediction request:', error.message);
    }
};

module.exports = {makePredictionRequest};