import { useSession } from "../../hooks/useSession";

const API_URL = "http://localhost:8080/api/result";

const ResultService = {
  getResultByStudentIdAndTestId: async (studentId, testId) => {
    const session = useSession();
    try {
      const response = await fetch(`${API_URL}/${studentId}/${testId}`, {
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
};

export default ResultService;
