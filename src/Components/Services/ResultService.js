const API_URL = "http://localhost:8080/api/result";

const ResultService = {
  getResultByStudentIdAndTestId: async (studentId, testId, token) => {
    try {
      const response = await fetch(`${API_URL}/${studentId}/${testId}`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Failed to get test!");
    }
  },
};

export default ResultService;
