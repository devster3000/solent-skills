document.addEventListener("DOMContentLoaded", () => {

/* == CONFIG == */

const scale = ["Never", "Rarely", "Sometimes", "Often", "Always"];

const scoreMap = {
    "Never": 0,
    "Rarely": 3,
    "Sometimes": 7,
    "Often": 12,
    "Always": 15
};

/* == SHUFFLE == */

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffle(questions);

/* == STATE == */

let currentIndex = 0;
let answers = {};

/* == PROGRESS == */

function updateProgress() {
    const percent = (Object.keys(answers).length / questions.length) * 100;
    const bar = document.getElementById("progressBar");
    if (bar) bar.style.width = percent + "%";
}

/* == RENDER QUESTION == */

function renderQuestion() {

    const container = document.getElementById("questionContainer");
    if (!container) return;

    const q = questions[currentIndex];

    container.innerHTML = `
        <div class="qBox">

            <p class="qTitle">
                Question ${currentIndex + 1} of ${questions.length}
            </p>

            <h3>${q.question}</h3>

            <div class="qOptionsRow">
                ${scale.map(label => `
                    <input 
                        type="radio"
                        id="q${q.id}_${label}"
                        name="q${q.id}"
                        value="${label}"
                        ${answers[q.id] === label ? "checked" : ""}
                    >
                    <label class="qOptions" for="q${q.id}_${label}">
                        ${label}
                    </label>
                `).join("")}
            </div>

            <div class="navButtons">
                ${currentIndex > 0 ? `<button id="backBtn" class=".qOptions backCard">Back</button>` : ""}
                <button id="submitBtn" class=".qOptions submitCard">Submit</button>
            </div>

        </div>
    `;

    if (currentIndex > 0) {
        document.getElementById("backBtn").addEventListener("click", prevQuestion);
    }

    document.getElementById("submitBtn").addEventListener("click", submitQuestion);
}

/* == SUBMIT QUESTION == */

function submitQuestion() {

    const q = questions[currentIndex];
    const selected = document.querySelector(`input[name="q${q.id}"]:checked`);

    if (!selected) {
        alert("Please select an answer before continuing.");
        return;
    }

    answers[q.id] = selected.value;
    updateProgress();

    if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion();
    } else {
        showResults();
    }
}

/* == BACK == */

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
    }
}

/* == RESULTS == */

function showResults() {

    const skillTotals = {};

    document.getElementById("progressBar").style.width = "100%";

    questions.forEach(q => {

        const answer = answers[q.id];
        if (!answer) return;

        const score = scoreMap[answer];

        if (!skillTotals[q.skill]) skillTotals[q.skill] = 0;
        skillTotals[q.skill] += score;
    });

    document.querySelector(".container").innerHTML = `
        <h1>Your Skills Breakdown</h1>
        <canvas id="resultsChart"></canvas>
    `;

    const ctx = document.getElementById("resultsChart");

    new Chart(ctx, {
        type: "radar",
        data: {
            labels: Object.keys(skillTotals),
            datasets: [{
                label: "Skill Level",
                data: Object.values(skillTotals),
                borderWidth: 2,
                borderColor: "#4caf50",
                backgroundColor: "rgba(76,175,80,0.2)",
                pointBackgroundColor: "#4caf50"
            }]
        },
        options: {
            responsive: true,
            scales: {
                suggestedMin: 0,
                suggestedMax: 60
            }
        }
    });
}

/* == INIT == */

renderQuestion();

});