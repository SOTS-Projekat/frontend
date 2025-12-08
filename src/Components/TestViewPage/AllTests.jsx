import { useState } from "react";
import classes from "./AllTests.module.scss";
import DeleteModal from "./DeleteModal";
import KnowledgeDomainService from "../Services/KnowledgeDomainService";
import NetworkGraph from "../NetworkGraph/NetworkGraph";
import { useSession } from "../../hooks/useSession";
import { useNavigate } from "react-router";



const AllTests = ({ data, onDelete, onExport }) => {
  const [currentlyActivePage, setCurrentlyActivePage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState();
  const [graphData, setGraphData] = useState(null);

  const [selectedTestId, setSelectedTestId] = useState(null);
  const [resultsForSelectedTest, setResultsForSelectedTest] = useState(null); // null = not loaded yet
  const [resultsLoading, setResultsLoading] = useState(false);

  const navigate = useNavigate();

  const { token, user } = useSession();

  const totalNumberOfPages = Math.ceil(data.length / 9);

  const groupedData = [];
  for (let i = 0; i < data.length; i = i + 9) {
    let group = data.slice(i, i + 9);
    groupedData.push(group);
  }

  const handleViewResults = async (testId) => {
    try {
      setSelectedTestId(testId);
      setGraphData(null);                 //  cistimo stari graf i listu
      setResultsForSelectedTest(null);
      setResultsLoading(true);

      const results = await KnowledgeDomainService.getResultsForTest(testId, token);

      console.log("Results for test:", testId, results);
      setResultsForSelectedTest(results || []);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setResultsLoading(false);
    }
  };

  const handleViewStudentGraph = async (studentId) => { //  Tek nakon sto se klikne na studenta, iscrta se graf za njegove tacne netacne odgovore
    try {
      const nodes = await KnowledgeDomainService.getCorrectStudentAnswers(
        selectedTestId,
        studentId,
        token
      );

      setGraphData({ nodes: nodes || [], links: [] });
    } catch (error) {
      console.error("Failed to fetch graph data:", error);
    }
  };


  return (
    <div className={classes["table-container"]}>
      {showDeleteDialog && (
        <DeleteModal
          onDelete={() => {
            onDelete(selectedRecord.id);
            setShowDeleteDialog(false);
          }}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Test title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groupedData[currentlyActivePage - 1] &&
            groupedData[currentlyActivePage - 1].map((test, ind) => (
              <tr key={ind}>
                <td>{test.id}</td>
                <td>{test.title}</td>
                <td>
                  <div className={classes["buttons-container"]}>
                    {user.role === "PROFESSOR" && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedRecord(test);
                            setShowDeleteDialog(true);
                          }}
                          className={classes[""]}
                        >
                          Obriši
                        </button>
                        <button
                          onClick={() => {
                            onExport(test.id);
                          }}
                          className={classes[""]}
                        >
                          Export to XML
                        </button>
                        <button
                          onClick={() => handleViewResults(test.id)}
                          className={classes[""]}
                        >
                          View Results
                        </button>
                      </>
                    )}
                    {user.role === "STUDENT" && !test.solved && (
                      <>
                        <button
                          onClick={() => {
                            navigate("/test/" + test.id);
                          }}
                          className={classes[""]}
                        >
                          Solve test
                        </button>
                      </>
                    )}
                    {user.role === "STUDENT" && test.solved && (
                      <>
                        <button
                          onClick={() => {
                            navigate("/test/result/" + test.id);
                          }}
                          className={classes[""]}
                        >
                          View result
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={classes.navigator}>
        <button
          onClick={() => {
            if (currentlyActivePage > 1) {
              setCurrentlyActivePage((prevState) => prevState - 1);
            }
          }}
        >
          &lt;
        </button>
        <div>{currentlyActivePage}</div>
        <button
          onClick={() => {
            if (currentlyActivePage < totalNumberOfPages) {
              setCurrentlyActivePage((prevState) => prevState + 1);
            }
          }}
        >
          &gt;
        </button>
        <div>{totalNumberOfPages}</div>
      </div>


      {/* Dodali smo deo za ucitavanje svih studenata koji imaju rezultate na kliknutom testu */}
      {user.role === "PROFESSOR" && selectedTestId && (
        <div className={classes["results-container"]}>
          <h2>Results for test #{selectedTestId}</h2>

          {resultsLoading && <p>Loading...</p>}

          {!resultsLoading && resultsForSelectedTest && resultsForSelectedTest.length === 0 && (
            <p>No students have results for this test.</p>
          )}

          {!resultsLoading && resultsForSelectedTest && resultsForSelectedTest.length > 0 && (
            <table className={classes["results-table"]}>
              <thead>
                <tr>
                  <th>Student username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resultsForSelectedTest.map((r, idx) => (
                  <tr key={r.studentId ?? idx}>
                    <td>{r.studentName ?? r.username ?? "Student"}</td>
                    <td>
                      <button onClick={() => handleViewStudentGraph(r.studentId)}>
                        View graph
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {graphData && (
        <div className={classes["graph-container"]}>
          <h2>Studentovo stanje znanja</h2>
          <NetworkGraph graphData={graphData} showSaveButton={false} />
        </div>
      )}
    </div>
  );
};

export default AllTests;
