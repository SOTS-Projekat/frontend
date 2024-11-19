import React, { useEffect, useState } from "react";
import KnowledgeDomainList from "./KnowladgeDomainList";
import KnowledgeDomainService from "../Services/KnowledgeDomainService";
import styles from "./KnowledgeDomainPage.module.scss";

const KnowledgeDomainPage = () => {
  const [knowledgeDomains, setKnowledgeDomains] = useState([]);
  // const knowledgeDomains = [
  //   {
  //     id: 1,
  //     name: "Mathematics Basics",
  //     description:
  //       "Learn fundamental concepts of algebra, geometry, and arithmetic.",
  //     createdAt: "2024-01-15",
  //   },
  //   {
  //     id: 2,
  //     name: "Physics Principles",
  //     description:
  //       "Explore the laws of motion, thermodynamics, and basic mechanics.",
  //     createdAt: "2024-02-20",
  //   },
  //   {
  //     id: 3,
  //     name: "Programming Foundations",
  //     description:
  //       "Understand the basics of algorithms, data structures, and coding.",
  //     createdAt: "2024-03-12",
  //   },
  //   {
  //     id: 4,
  //     name: "Biology Essentials",
  //     description:
  //       "Dive into the study of life, cell biology, and basic genetics.",
  //     createdAt: "2024-04-25",
  //   },
  //   {
  //     id: 5,
  //     name: "World History",
  //     description:
  //       "Trace the major events and eras that shaped the modern world.",
  //     createdAt: "2024-05-10",
  //   },
  //   {
  //     id: 6,
  //     name: "Chemistry Basics",
  //     description:
  //       "Learn about chemical reactions, elements, and the periodic table.",
  //     createdAt: "2024-06-05",
  //   },
  //   {
  //     id: 7,
  //     name: "Art and Creativity",
  //     description:
  //       "Explore artistic techniques, color theory, and creative thinking.",
  //     createdAt: "2024-07-18",
  //   },
  //   {
  //     id: 8,
  //     name: "Business Management",
  //     description:
  //       "Gain insights into management strategies, leadership, and marketing.",
  //     createdAt: "2024-08-22",
  //   },
  //   {
  //     id: 9,
  //     name: "Environmental Science",
  //     description: "Understand ecosystems, sustainability, and climate change.",
  //     createdAt: "2024-09-30",
  //   },
  //   {
  //     id: 10,
  //     name: "Advanced Mathematics",
  //     description:
  //       "Study calculus, linear algebra, and advanced problem-solving.",
  //     createdAt: "2024-10-15",
  //   },
  // ];

  const handleSelectDomain = (id) => {
    console.log(`Selected domain ID: ${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await KnowledgeDomainService.getById();
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
        onSelect={handleSelectDomain}
      />
    </div>
  );
};

export default KnowledgeDomainPage;
