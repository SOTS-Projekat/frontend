import axios from 'axios';
import User from '../Model/User'

const API_URL = 'http://localhost:8080/api/user';

const UserService = {
    getAllStudents: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/allStudents`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

     
        return response.data.map(student => new User(
            student.id,
            student.username,
            student.email,
            student.role
        ));
    }
};

export default UserService;
