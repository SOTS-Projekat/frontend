import React, { useEffect, useState } from 'react';
import UserService from '../Services/UserService'; 

const HomePage = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);

    // Function to fetch students
    const fetchStudents = async () => {
        try {
            const studentsData = await UserService.getAllStudents(); // Call the service method
            setStudents(studentsData); // Set the students data in state
        } catch (err) {
            setError(err.message); // Handle errors
        }
    };

    useEffect(() => {
        fetchStudents(); // Fetch students on component mount
    }, []);

    return (
        <div className="home-wrapper">
            <h1>Welcome to the Home Page!</h1>
            {error && <p>Error: {error}</p>}
            <h2>List of Students:</h2>
            {students.length > 0 ? (
                <ul>
                    {students.map(student => (
                        <li key={student.id}>
                            {student.username} - {student.email} - {student.role}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>There are no students currently.</p>
            )}
        </div>
    );
};

export default HomePage;
