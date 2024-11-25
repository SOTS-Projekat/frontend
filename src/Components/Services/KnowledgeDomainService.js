import { getDecodedToken } from "../../hooks/authUtils";
import { useSession } from "../../hooks/useSession";

const API_URL = "http://localhost:8080/api/knowledgeDomain";

const KnowledgeDomainService = {
  createKnowledgeDomain: async (domain) => {
    const session = useSession();
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify(domain),
      });

      console.log("/////////");
      console.log(response);
      // Proverite da li je odgovor uspešan
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Pretvaranje odgovora u JSON
      console.log(data);
      return data; // Vratite odgovor
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to create test");
    }
  },

  getById: async () => {
    const session = useSession();
    const decodedToken = getDecodedToken();
    try {
      const response = await fetch(`${API_URL}/${decodedToken.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to get test!");
    }
  },

  getOneById: async (id) => {
    const session = useSession();
    try {
      const response = await fetch(`${API_URL}/getById/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to get the knowledge domain by id.");
    }
  },


};



export default KnowledgeDomainService;
