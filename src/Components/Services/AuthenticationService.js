import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

const AuthenticationService = {

    login: async (username, password) => {
        try {
            const response = await axios.post(API_URL + 'login', { username, password }, 
                {headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data; // Token
        } catch (error) {
            throw error.response ? error.response.data : new Error('Login failed');
        }
    },

    register: async (email, username, password) => {
        try {
            const response = await axios.post(API_URL + 'register', { email, username, password }, 
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data; 
        } catch (error) {
            throw error.response ? error.response.data : new Error('Registration failed');
        }
    }
};

export default AuthenticationService;
