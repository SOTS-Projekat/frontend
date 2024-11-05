import React, { useEffect, useState } from 'react';
import UserService from '../Services/UserService'; 
import GraphSetup from '../GraphForStudentAnswers/GraphSetup';
import { getDecodedToken } from '../../hooks/authUtils';
import './HomePage.scss'; 

const HomePage = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);

    const fetchStudents = async () => {
        try {
            const studentsData = await UserService.getAllStudents();
            setStudents(studentsData);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const answers = ["A", "B", "C", "D", "C", "A", "A"];

    return (
        <div className="home-wrapper">
            <h1>Welcome to the Home Page!</h1>
            {error && <p className="error-message">Error: {error}</p>}
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

            <div className="graph-section">
                <h3>Graph:</h3>
                <GraphSetup answers={answers} />
            </div>
        </div>
    );
};

export default HomePage;
