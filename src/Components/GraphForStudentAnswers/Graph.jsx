const answers = ["A", "B", "C", "D"]; // Primer odgovora studenta

function Graph() {
  return (
    <div className="App">
      <h1>Graf odgovora studenta</h1>
      <AnswerGraph answers={answers} />
    </div>
  );
}

export default Graph;