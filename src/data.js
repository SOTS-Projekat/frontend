const testData = {
  title: "Test iz Softverskog inženjerstva",
  questions: [
    {
      questionText: "Koji je prvi korak u softverskom životnom ciklusu?",
      offeredAnswers: [
        { answerText: "Kodiranje", isCorrect: false },
        { answerText: "Analiza zahteva", isCorrect: true },
        { answerText: "Testiranje", isCorrect: false },
        { answerText: "Implementacija", isCorrect: false },
      ],
    },
    {
      questionText:
        "Koji od sledećih modela predstavlja iterativni pristup razvoju softvera?",
      offeredAnswers: [
        { answerText: "V model", isCorrect: false },
        { answerText: "Spiralni model", isCorrect: true },
        { answerText: "Waterfall model", isCorrect: false },
        { answerText: "Big Bang model", isCorrect: false },
      ],
    },
    {
      questionText:
        "Koja tehnika se koristi za pronalaženje grešaka pre nego što se softver pusti u rad?",
      offeredAnswers: [
        { answerText: "Debugging", isCorrect: true },
        { answerText: "Kodiranje", isCorrect: false },
        { answerText: "Dizajn", isCorrect: false },
        { answerText: "Analiza", isCorrect: false },
      ],
    },
    {
      questionText:
        "Koji obrazac dizajna je primer obrasca za kreiranje objekata?",
      offeredAnswers: [
        { answerText: "Fabrika (Factory)", isCorrect: true },
        { answerText: "Dekorator (Decorator)", isCorrect: false },
        { answerText: "Posmatrač (Observer)", isCorrect: false },
        { answerText: "Adapter (Adapter)", isCorrect: false },
      ],
    },
    {
      questionText:
        "Koji metodologija koristi kratke iteracije i uključuje stalne povratne informacije od korisnika?",
      offeredAnswers: [
        { answerText: "Agile", isCorrect: true },
        { answerText: "Waterfall", isCorrect: false },
        { answerText: "RAD", isCorrect: false },
        { answerText: "DevOps", isCorrect: false },
      ],
    },
    {
      questionText: "Šta je UML?",
      offeredAnswers: [
        { answerText: "Programski jezik", isCorrect: false },
        { answerText: "Model za životni ciklus softvera", isCorrect: false },
        {
          answerText: "Standardizovan vizuelni jezik za modeliranje",
          isCorrect: true,
        },
        { answerText: "Vrsta arhitekture softvera", isCorrect: false },
      ],
    },
    {
      questionText: "Koja od sledećih nije faza u modelu Waterfall?",
      offeredAnswers: [
        { answerText: "Dizajn", isCorrect: false },
        { answerText: "Kodiranje", isCorrect: false },
        { answerText: "Marketing", isCorrect: true },
        { answerText: "Testiranje", isCorrect: false },
      ],
    },
    {
      questionText: "Šta znači DRY princip u programiranju?",
      offeredAnswers: [
        { answerText: "Don’t Repeat Yourself", isCorrect: true },
        { answerText: "Dynamic Resource Yielding", isCorrect: false },
        { answerText: "Data Redundancy Yield", isCorrect: false },
        { answerText: "Direct Resource Yield", isCorrect: false },
      ],
    },
    {
      questionText:
        "Koji uzorak dizajna koristi 'proxy' za kontrolu pristupa objektu?",
      offeredAnswers: [
        { answerText: "Adapter", isCorrect: false },
        { answerText: "Proxy", isCorrect: true },
        { answerText: "Decorator", isCorrect: false },
        { answerText: "Observer", isCorrect: false },
      ],
    },
    {
      questionText: "Koja je glavna prednost korišćenja MVC arhitekture?",
      offeredAnswers: [
        { answerText: "Poboljšana sigurnost", isCorrect: false },
        {
          answerText: "Razdvajanje podataka, logike i prikaza",
          isCorrect: true,
        },
        { answerText: "Manji troškovi razvoja", isCorrect: false },
        { answerText: "Brže izvršavanje koda", isCorrect: false },
      ],
    },
    {
      questionText: "Šta je Scrum?",
      offeredAnswers: [
        { answerText: "Vrsta dokumentacije", isCorrect: false },
        { answerText: "Agilna metodologija", isCorrect: true },
        { answerText: "Model za planiranje", isCorrect: false },
        { answerText: "Tehnika kodiranja", isCorrect: false },
      ],
    },
    {
      questionText: "Šta označava pojam 'refaktorisanje' koda?",
      offeredAnswers: [
        { answerText: "Pisanje novog koda", isCorrect: false },
        {
          answerText: "Izmena koda radi poboljšanja kvaliteta",
          isCorrect: true,
        },
        { answerText: "Testiranje koda", isCorrect: false },
        { answerText: "Brisanje zastarelog koda", isCorrect: false },
      ],
    },
    {
      questionText: "Šta je karakteristično za mikroservisnu arhitekturu?",
      offeredAnswers: [
        {
          answerText: "Sve funkcionalnosti su u jednom procesu",
          isCorrect: false,
        },
        {
          answerText: "Sistemi su podeljeni na male, nezavisne servise",
          isCorrect: true,
        },
        { answerText: "Ne koristi baze podataka", isCorrect: false },
        { answerText: "Koristi samo REST API", isCorrect: false },
      ],
    },
    {
      questionText: "Koji je glavni cilj testiranja softvera?",
      offeredAnswers: [
        { answerText: "Otkrivanje grešaka", isCorrect: true },
        { answerText: "Optimizacija performansi", isCorrect: false },
        { answerText: "Povećanje brzine koda", isCorrect: false },
        { answerText: "Smanjenje troškova razvoja", isCorrect: false },
      ],
    },
    {
      questionText: "Šta se podrazumeva pod 'kontrolom verzija'?",
      offeredAnswers: [
        { answerText: "Proces beleženja promena u kodu", isCorrect: true },
        { answerText: "Tehnika dizajna softvera", isCorrect: false },
        { answerText: "Vrsta baze podataka", isCorrect: false },
        { answerText: "Algoritam za sortiranje podataka", isCorrect: false },
      ],
    },
    {
      questionText:
        "Koji uzorak dizajna omogućava dinamičko dodavanje funkcionalnosti objektu?",
      offeredAnswers: [
        { answerText: "Singleton", isCorrect: false },
        { answerText: "Decorator", isCorrect: true },
        { answerText: "Factory", isCorrect: false },
        { answerText: "Adapter", isCorrect: false },
      ],
    },
    {
      questionText: "Koja je glavna svrha DevOps prakse?",
      offeredAnswers: [
        { answerText: "Ubrzavanje testiranja", isCorrect: false },
        { answerText: "Sinhronizacija razvoja i operacija", isCorrect: true },
        { answerText: "Povećanje troškova", isCorrect: false },
        { answerText: "Poboljšanje dizajna", isCorrect: false },
      ],
    },
    {
      questionText:
        "Koji pojam označava modifikaciju koda radi optimizacije performansi?",
      offeredAnswers: [
        { answerText: "Debugging", isCorrect: false },
        { answerText: "Refaktorisanje", isCorrect: true },
        { answerText: "Dizajn", isCorrect: false },
        { answerText: "Integracija", isCorrect: false },
      ],
    },
    {
      questionText: "Šta označava akronim API?",
      offeredAnswers: [
        { answerText: "Application Programming Interface", isCorrect: true },
        { answerText: "Application Product Integration", isCorrect: false },
        { answerText: "Automated Process Integration", isCorrect: false },
        { answerText: "Advanced Programming Interface", isCorrect: false },
      ],
    },
    {
      questionText:
        "Koji obrazac dizajna definiše jedinstveni objekat koji obezbeđuje pristup globalnom resursu?",
      offeredAnswers: [
        { answerText: "Adapter", isCorrect: false },
        { answerText: "Observer", isCorrect: false },
        { answerText: "Decorator", isCorrect: false },
        { answerText: "Singleton", isCorrect: true },
      ],
    },
  ],
};

export default testData;
