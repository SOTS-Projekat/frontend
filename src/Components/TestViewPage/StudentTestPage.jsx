import React, { useState, useEffect } from "react";
import StudentTest from "./StudentTest"; // Importujemo komponentu za prikaz testa
import styles from "./StudentTestPage.module.scss"; // Importujemo stilove za stranicu
import { useParams } from "react-router";
import LoadingIndicator from "../UI/LoadingIndicator";
import ResultService from "../Services/ResultService";

const StudentTestPage = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        const fetchedResult = await ResultService.getResultById(id);
        console.log(fetchedResult);
        setTest(fetchedResult);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Greška prilikom učitavanja testa:", error);
      }
    };

    fetchResult();
  }, []);

  if (loading) return <LoadingIndicator />;
  if (error) return <div>Došlo je do greške: {error}</div>;

  return (
    <div className={styles.pageContainer}>
      {test && <StudentTest test={test} />}{" "}
    </div>
  );
};

export default StudentTestPage;
