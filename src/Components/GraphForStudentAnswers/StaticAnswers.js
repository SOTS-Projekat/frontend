const answers = ["A", "B", "C", "D"]; // Primer odgovora studenta

// Kreiranje čvorova i veza
const nodes = [];
const links = [];

// Generišemo kumulativne sekvence
let sequence = "";
answers.forEach((answer, index) => {
  sequence += answer;
  nodes.push({ id: sequence, label: sequence });
  
  // Povezujemo trenutnu sekvencu sa prethodnom
  if (index > 0) {
    links.push({ source: nodes[index - 1].id, target: sequence });
  }
});
