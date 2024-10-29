import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/login';

const LoginService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(API_URL, { username, password }, 
                {headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data; // Token
        } catch (error) {
            throw error.response ? error.response.data : new Error('Login failed');
        }
    }
};

export default LoginService;
