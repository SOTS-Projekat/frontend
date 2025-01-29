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

  updateKnowledgeDomain: async (id, domain) => {
    const session = useSession();
    try {
      const response = await fetch(`${API_URL}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify(domain),
      });

      console.log("/////////");
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to update knowledge domain");
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

  getRealKnowledgeDomainById: async (id) => {
    const session = useSession();
    try {
      const response = await fetch(`${API_URL}/getRealKnowledgeDomain/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const domain = await response.json();
      return domain; // Return the domain object
    } catch (error) {
      throw new Error(error.message || "Failed to get the real knowledge domain by id.");
    }
  },

  getCorrectStudentAnswers: async (testId, studentId) => {
    const session = useSession();
    try {
      const url = new URL(`${API_URL}/correct-answers`);
      url.searchParams.append("testId", testId);
      url.searchParams.append("studentId", studentId);

      const response = await fetch(url.toString(), {
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
      console.log(error);
      throw new Error(error.message || "Failed to get correct student answers.");
    }
  },

};


export default KnowledgeDomainService;
