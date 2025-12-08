const API_URL = "http://localhost:8080/api/knowledgeDomain";

const KnowledgeDomainService = {
  createKnowledgeDomain: async (domain, token) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(domain),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to create knowledge domain");
    }
  },

  updateKnowledgeDomain: async (id, domain, token) => {
    try {
      const response = await fetch(`${API_URL}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(domain),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to update knowledge domain");
    }
  },

  getById: async (userId, token) => {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to get knowledge domains!");
    }
  },

  getOneById: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/getById/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        error.message || "Failed to get the knowledge domain by id."
      );
    }
  },

  getRealKnowledgeDomainById: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/getRealKnowledgeDomain/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const domain = await response.json();
      return domain;
    } catch (error) {
      throw new Error(
        error.message || "Failed to get the real knowledge domain by id."
      );
    }
  },

  getCorrectStudentAnswers: async (testId, studentId, token) => {
    try {
      const url = new URL(`${API_URL}/correct-answers`);
      url.searchParams.append("testId", testId);
      url.searchParams.append("studentId", studentId);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(
        error.message || "Failed to get correct student answers."
      );
    }
  },

  getResultsForTest: async (testId, token) => {
    try {
      const url = new URL(`http://localhost:8080/api/result/${testId}/results`);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(
        error.message || "Failed to get correct student answers."
      );
    }
  },

};




export default KnowledgeDomainService;
