import React, { useState } from "react";
import styles from "./KnowledgeDomainList.module.scss";
import { useNavigate } from "react-router";
import { useSession } from "../../hooks/useSession";

const KnowledgeDomainList = ({ knowledgeDomains, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { user } = useSession();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleCreate = (event) => {
    navigate("create");
  };

  const handleSelectDomain = (domainId) => {
    navigate(`/knowledge-domain/${domainId}`);
  };

  const filteredDomains = knowledgeDomains.filter((domain) =>
    domain.name.toLowerCase().includes(searchTerm) && !domain.name.toLowerCase().includes("_real")
  );


  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search knowledge domains..."
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {user?.role === "PROFESSOR" && (
          <button className={styles.createButton} onClick={handleCreate}>
            Create New Domain
          </button>
        )}
      </div>
      {filteredDomains.length === 0 ? (
        <div className={styles.emptyMessage}>No knowledge domains found.</div>
      ) : (
        <div className={styles.grid}>
          {filteredDomains.map((domain) => (
            <div
              key={domain.id}
              className={styles.card}
              onClick={() => handleSelectDomain(domain.id)}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.domainName}>{domain.name}</h3>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.description}>
                  {domain.description || "No description provided."}
                </p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.createdAt}>
                  Created on: {new Date(domain.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeDomainList;
