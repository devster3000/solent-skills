/* STRING SCALE */
const scale = ["Never", "Rarely", "Sometimes", "Often", "Always"];

/* Colour mapping */
const colourMap = {
    "Never": "redSelected",
    "Rarely": "redSelected",
    "Sometimes": "greySelected",
    "Often": "greenSelected",
    "Always": "greenSelected"
};

/* Score mapping */
const scoreMap = {
    "Never": 0,
    "Rarely": 3,
    "Sometimes": 7,
    "Often": 12,
    "Always": 15
};

/* Group questions by skill */
const grouped = {};
questions.forEach(q => {
    if (!grouped[q.skill]) grouped[q.skill] = [];
    grouped[q.skill].push(q);
});

/* Render questions */
const container = document.getElementById("questionContainer");

Object.keys(grouped).forEach(skill => {
    const title = document.createElement("h2");
    title.textContent = skill.replace("_", " ").toUpperCase();
    container.appendChild(title);

    grouped[skill].forEach(q => {
        const div = document.createElement("div");
        div.className = "qBox";

        div.innerHTML = `
            <p class="qTitle">${q.question}</p>

            <div class="qOptionsRow">
                ${scale.map(label => `
                    <input 
                        type="radio" 
                        id="q${q.id}_${label}" 
                        name="q${q.id}" 
                        value="${label}"
                    >
                    <label class="qOptions" data-value="${label}" for="q${q.id}_${label}">
                        ${label}
                    </label>
                `).join("")}
            </div>
        `;

        container.appendChild(div);
    });
});

/* Colour highlight on selection */
document.addEventListener("change", (event) => {
    if (event.target.type === "radio") {
        const name = event.target.name;

        document
            .querySelectorAll(`input[name="${name}"] + .qOptions`)
            .forEach(label => label.classList.remove("redSelected", "greySelected", "greenSelected"));

        const selectedLabel = document.querySelector(`label[for="${event.target.id}"]`);
        selectedLabel.classList.add(colourMap[event.target.value]);
    }
});

/* Submit Handler */
document.getElementById("submitBtn").onclick = () => {

    const skillTotals = {};
    let missing = 0;

    questions.forEach(q => {
        const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
        if (!selected) {
            missing++;
            return;
        }

        const answer = selected.value;
        const score = scoreMap[answer];

        if (!skillTotals[q.skill]) skillTotals[q.skill] = 0;
        skillTotals[q.skill] += score;
    });

    if (missing > 0) {
        document.getElementById("result").style.display = "block";
        document.getElementById("result").innerHTML = "Please answer every question.";
        return;
    }

    /* Replace questionnaire with chart */
    document.querySelector('.container').innerHTML = `
        <h1>Your Skills Breakdown</h1>
        <canvas id="resultsChart"></canvas>
    `;

    /* Draw pie chart */
    const ctx = document.getElementById('resultsChart');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(skillTotals),
            datasets: [{
                data: Object.values(skillTotals),
                backgroundColor: [
                    '#4caf50',
                    '#2196f3',
                    '#ff9800',
                    '#9c27b0',
                    '#f44336',
                    '#009688'
                ]
            }]
        },
        options: { 
            responsive: true,
            scales: {
                angleLines: { color: '#ccc'},
                grid: { color: '#ddd' },
                suggestedMin: 0,
                suggestedMax: 60,
                pointLabels: {
                    font: { size: 14 }
                }
            }
        }
    });
};
