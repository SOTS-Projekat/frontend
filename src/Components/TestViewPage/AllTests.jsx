import { useState } from "react";
import classes from "./AllTests.module.scss";
import { GrTest } from "react-icons/gr";
import DeleteModal from "./DeleteModal";

const AllTests = ({ data, onEdit, onDelete, onExport }) => {
  const [currentlyActivePage, setCurrentlyActivePage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  //const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState();

  const totalNumberOfPages = Math.ceil(data.length / 9);

  const groupedData = [];
  for (let i = 0; i < data.length; i = i + 9) {
    let group = data.slice(i, i + 9);
    groupedData.push(group);
  }

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
      {/* {showEditDialog && (
        <EditRecordModal
          onEdit={onEdit}
          onClose={() => setShowEditDialog(false)}
          id={selectedRecord.id}
        />
      )} */}
      <table>
        <thead>
          <th>ID</th>
          <th>Test title</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {groupedData[currentlyActivePage - 1] &&
            groupedData[currentlyActivePage - 1].map((test, ind) => (
              <tr key={ind}>
                <td>{test.id}</td>
                <td>{test.title}</td>
                <td>
                  <td>
                    <div className={classes["buttons-container"]}>
                      {/* <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowEditDialog(true);
                        }}
                        className={classes[""]}
                      >
                        Izmjeni
                      </button> */}
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
                    </div>
                  </td>
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
    </div>
  );
};

export default AllTests;