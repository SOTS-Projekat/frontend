import React, { useEffect, useState } from "react";
import KnowledgeDomainService from "../Services/KnowledgeDomainService";
import styles from "./KnowledgeDomainPage.module.scss";
import RealKnowledgeDomainList from "./RealKnowledgeDomainList";

const RealKnowledgeDomainPage = () => {

    const [knowledgeDomains, setKnowledgeDomains] = useState([]);
    const handleSelectDomain = (id) => {
        console.log(`Selected domain ID: ${id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
        try {
            const data = await KnowledgeDomainService.getById();    //  svi domeni profesora
            console.log("Original data:", data);

            const transformedArray = data.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            createdAt: item.date,
            }));

            console.log("Transformed data:", transformedArray);

            setKnowledgeDomains(transformedArray);
        } catch (error) {
            console.error("Error fetching and processing data:", error.message);
        }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.container}>
        <RealKnowledgeDomainList
            knowledgeDomains={knowledgeDomains}
            onSelect={handleSelectDomain}
        />
        </div>
    );
    };

    export default RealKnowledgeDomainPage;