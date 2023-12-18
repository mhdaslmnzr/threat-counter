let capabilityCounts = {};
let motiveCounts = {};
let adversaryTypeCounts = {};

function handleFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        Papa.parse(file, {
            header: true,
            complete: function (results) {
                capabilityCounts = {};
                motiveCounts = {};
                adversaryTypeCounts = {};

                results.data.forEach(data => {
                    const capability = data['Capability'];
                    const motive = data['Motive'];
                    const adversaryType = data['Adversary Type'];

                    incrementCount(capability, capabilityCounts);
                    incrementCount(motive, motiveCounts);
                    incrementCount(adversaryType, adversaryTypeCounts);
                });

                updateCapabilityChart();
                updateMotiveChart();
                updateAdversaryTypeChart();
            }
        });
    }
}

function incrementCount(category, countObject) {
    if (category !== undefined && category !== null) {
        if (!countObject[category]) {
            countObject[category] = 1;
        } else {
            countObject[category]++;
        }
    }
}

function updateCapabilityChart() {
    updateChart('capabilityChart', capabilityCounts, 'Capability', 'Threats by Capability');
}

function updateMotiveChart() {
    updateChart('motiveChart', motiveCounts, 'Motive', 'Threats by Motive');
}

function updateAdversaryTypeChart() {
    updateChart('adversaryTypeChart', adversaryTypeCounts, 'Adversary Type', 'Threats by Adversary Type');
}

function updateChart(chartId, countObject, label, heading) {
    const ctx = document.getElementById(chartId).getContext('2d');

    const labels = Object.keys(countObject);
    const data = labels.map(category => countObject[category]);

    const maxPercentageIndex = data.indexOf(Math.max(...data));
    const highestPercentageCategory = labels[maxPercentageIndex];
    const highestPercentage = ((data[maxPercentageIndex] / data.reduce((a, b) => a + b, 0)) * 100).toFixed(2);

    const chartData = {
        labels: labels,
        datasets: [{
            label: `${label} Count`,
            data: data,
            backgroundColor: getRandomColors(data.length),
            borderColor: '#fff',
            borderWidth: 2
        }]
    };

    const config = {
        type: 'doughnut',
        data: chartData,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: heading,
                    fontSize: 16
                },
                subtitle: {
                    display: true,
                    text: `${highestPercentageCategory} is the most with ${data[maxPercentageIndex]} occurrences (${highestPercentage}%)`,
                    fontSize: 14
                },
                legend: {
                    display: true,
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const count = context.raw || 0;
                            const percentage = ((count / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(2);
                            return `${label}: ${count} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true // Enable scale animation for a cool effect
            }
        }
    };

    new Chart(ctx, config);
}

function getRandomColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(getRandomColor());
    }
    return colors;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


