/* HEADER/FOOTER FETCHING */

fetch('/components/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
    document.getElementById(activePage).classList.add("active");
  });

fetch('/components/footer.html')
  .then(response => response.text())
  .then(data => document.getElementById('footer').innerHTML = data);


/* == QUESTIONS == */

/* SHUFFLE */

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math,random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffle(questions)



/* STATES */

let index = 0;
let answers = [];

const scores = {
    stronglyAgree: 5,
    agree: 4,
    neutral: 3,
    disagree: 2,
    stronglyDisagree: 1
};


/* QUESTION DISPLAYS/FUNCTIONS */
function showQuestion() {
    document.getElementById("questionText").textContent = questions[index].text;
}

showQuestion()


function answer(value) {
    answers.push({
        skill: questions[index].skill,
        response: value
    });

    index++;

    if (index < questions.length) {
        showQuestion();
    }
    
    else {
        showResults();
    }
}


/* CALCULATIONS */

function showResults() {
    const totals = {};
    const counts = {};

    for (let ans of answers) {
        const skill = ans.skills;
        const score = scores[ans.response];

        totals[skill] = (totals[skill] || 0) + score;
        counts[skill] = (counts[skill] || 0) + 1;
    }

    /* DISPLAY RESULTS */

    let html = "<h2>Your Results</h2>";

    for (let skill in totals) {
        const max = counts[skill] * 5;
        const pct = (totals[skill] / max) * 100;

        html += `<p><strong>${skill}:</strong> ${pct.toFixed(1)}%</p>`;
    }

    document.getElementById("questionBox").style.display = "none";
    document.getElementById("results").innerHTML = html;
    document.getElementById("results").style.display = "block";
}