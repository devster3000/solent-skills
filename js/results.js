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

const skillMap = {
    "digital": { name: "Digital", color: "#2196f3" },
    "communication": { name: "Communication", color: "#ffeb3b" },
    "problem_solving": { name: "Problem Solving", color: "#ff9800" },
    "creativity": { name: "Creativity", color: "#9c27b0" },
    "organisational_awareness": { name: "Organisations", color: "#f44336" },
    "teamwork": { name: "Teamwork", color: "#4caf50" }
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
            <p class="qTitle">Question ${currentIndex + 1} of ${questions.length}</p>
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
                    <label class="qOptions" for="q${q.id}_${label}">${label}</label>
                `).join("")}
            </div>

            <div class="navButtons">
                ${currentIndex > 0 ? `<button id="backBtn" class="qOptions backCard">Back</button>` : ""}
                <button id="submitBtn" class="qOptions submitCard">Submit</button>
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
    const skillCounts = {};

    document.getElementById("progressBar").style.width = "100%";

    questions.forEach(q => {
        const answer = answers[q.id];
        if (!answer) return;

        if (!skillTotals[q.skill]) {
            skillTotals[q.skill] = 0;
            skillCounts[q.skill] = 0;
        }
        skillTotals[q.skill] += scoreMap[answer];
        skillCounts[q.skill]++;
    });

    // normalize to percentage
    const skillPercentages = {};
    Object.keys(skillTotals).forEach(skill => {
        skillPercentages[skill] = Math.round((skillTotals[skill] / (skillCounts[skill] * 15)) * 100);
    });

    // Sort skills descending
    const sortedSkills = Object.keys(skillPercentages).sort((a, b) => skillPercentages[b] - skillPercentages[a]);
    const topSkills = sortedSkills.slice(0, 2);

    const container = document.querySelector(".container");
    container.innerHTML = `
        <h1>Your Skills Breakdown</h1>
        <canvas id="resultsChart" style="margin-top:20px;"></canvas>
        <div id="topSkills" style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;"></div>
    `;

    // Render top 2 skills
    const topDiv = document.getElementById("topSkills");
    topSkills.forEach(skill => {
        const card = document.createElement("div");
        card.style.backgroundColor = skillMap[skill].color;
        card.style.color = "#fff";
        card.style.fontWeight = "bold";
        card.style.padding = "12px 16px";
        card.style.borderRadius = "8px";
        card.style.flex = "1";
        card.style.textAlign = "center";
        card.style.fontSize = "1.1rem";
        card.textContent = `${skillMap[skill].name}: ${skillPercentages[skill]}%`;
        topDiv.appendChild(card);
    });

    // Radar chart
    const labels = Object.keys(skillTotals).map(skill => skillMap[skill].name);
    const dataPoints = Object.keys(skillTotals).map(skill =>
        Math.round((skillTotals[skill] / (skillCounts[skill] * 15)) * 100)
    );
    const pointColors = Object.keys(skillTotals).map(skill => skillMap[skill].color);

    const ctx = document.getElementById("resultsChart");
    new Chart(ctx, {
        type: "radar",
        data: {
            labels: labels,
            datasets: [{
                label: "Skill Level",
                data: dataPoints,
                borderWidth: 2,
                borderColor: "#4caf50",
                backgroundColor: "rgba(76,175,80,0.2)",
                pointBackgroundColor: pointColors
            }]
        },
        options: {
            responsive: true,
            scales: {
            r: { // 'r' is the radial axis for radar charts
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20 // optional, for nicer tick intervals
                },
                pointLabels: {
                    font: { size: 14 }
                }
            }
            }
        }
    });
}

/* == INIT == */
renderQuestion();
updateProgress();

});