import { useEffect, useState } from "react";
import classes from "./AllTestsPage.module.scss";
import TestService from "../Services/TestService";
import AllTests from "./AllTests";
import { useNavigate, useLocation } from "react-router";
import Button from "../UI/Button";
import { useSession } from "../../hooks/sessionContext";

const AllTestsPage = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useSession();

  const fetchTests = async () => {
    try {
      const data = await TestService.getAllTests(user.role, user.id, token);
      setTests(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching tests:", error.message);
    }
  };

  const deleteTest = async (id) => {
    try {
      await TestService.deleteTest(id, token);

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
  }, [location.key, user?.id, user?.role, token]);  //  Ne smemo da stavimo ovde tests, posto ce biti infinite loop

  return (
    <div className={classes.container}>
      <div className={classes.actions}>
        {user.role === "PROFESSOR" && (
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
        onExport={(id) => TestService.exportTest(id, token)}
      />
    </div>
  );
};

export default AllTestsPage;
