import React, { useEffect, useState } from "react";
import KnowledgeDomainList from "./KnowladgeDomainList";
import KnowledgeDomainService from "../Services/KnowledgeDomainService";
import styles from "./KnowledgeDomainPage.module.scss";
import { useSession } from "../../hooks/sessionContext";

const KnowledgeDomainPage = () => {
  const [knowledgeDomains, setKnowledgeDomains] = useState([]);

  const { user, token } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await KnowledgeDomainService.getById(user.id, token);
        console.log("Original data:", data);

        // Transformacija podataka
        const transformedArray = data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          createdAt: item.date,
        }));

        console.log("Transformed data:", transformedArray);

        // Postavljanje u state
        setKnowledgeDomains(transformedArray);
      } catch (error) {
        console.error("Error fetching and processing data:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <KnowledgeDomainList
        knowledgeDomains={knowledgeDomains}
      />
    </div>
  );
};

export default KnowledgeDomainPage;
