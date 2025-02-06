import { useEffect, useState } from "react";
import classes from "./AllTestsPage.module.scss";
import TestService from "../Services/TestService";
import AllTests from "./AllTests";
import { useNavigate } from "react-router";
import Button from "../UI/Button";
import { getDecodedToken } from "../../hooks/authUtils";

const AllTestsPage = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();
  const decodedToken = getDecodedToken();
  console.log(decodedToken);

  const fetchTests = async () => {
    try {
      const data = await TestService.getAllTests();
      setTests(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching tests:", error.message);
    }
  };

  const deleteTest = async (id) => {
    try {
      await TestService.deleteTest(id);

      setTests((prevState) => {
        return prevState.filter((test) => test.id !== id);
      });

      console.log(`Test with ID ${id} successfully deleted.`);
    } catch (error) {
      console.error("Error deleting test:", error.message);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.actions}>
        {decodedToken.role === "PROFESSOR" && (
          <Button
            text="Add test"
            onClick={() => navigate("create")}
            backgroundColor="rgba(50, 88, 123, 255)"
          />
        )}
      </div>
      <AllTests
        data={tests}
        onDelete={deleteTest}
        onExport={TestService.exportTest}
      />
    </div>
  );
};

export default AllTestsPage;
