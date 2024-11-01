import { useSession } from "../../hooks/useSession";

const API_URL = "http://localhost:8080/api/test";

const TestService = {
  createTest: async (test) => {
    console.log(test);
    const session = useSession();
    console.log(session.jwt);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
        body: JSON.stringify(test), // Koristite test objekat ovde
      });

      // Proverite da li je odgovor uspešan
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Pretvaranje odgovora u JSON
      return data; // Vratite odgovor
    } catch (error) {
      throw new Error(error.message || "Failed to create test");
    }
  },

  getTestById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
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

  solveTest: async (test) => {
    console.log(test);
    const session = useSession();
    console.log(session.jwt);
    // try {
    //   const response = await fetch(API_URL, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${session.jwt}`,
    //     },
    //     body: JSON.stringify(test), // Koristite test objekat ovde
    //   });

    //   // Proverite da li je odgovor uspešan
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }

    //   const data = await response.json(); // Pretvaranje odgovora u JSON
    //   return data; // Vratite odgovor
    // } catch (error) {
    //   throw new Error(error.message || "Failed to create test");
    // }
  },
};

export default TestService;
