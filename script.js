class ActorManager {
    constructor() {
        this.usedIds = new Set(); // Para almacenar IDs ya utilizados
        this.maxId = 40; // El número máximo de IDs disponibles
    }

    generateUniqueId() {
        let randomId;
        const availableIds = Array.from({ length: this.maxId }, (_, i) => i + 1)
            .filter(id => !this.usedIds.has(id));

        return availableIds.length > 0
            ? availableIds[Math.floor(Math.random() * availableIds.length)] // Genera un ID aleatorio entre los disponibles
            : null; // No hay más IDs disponibles
    }

    addUsedId(id) {
        this.usedIds.add(id);
    }

    removeUsedId(id) {
        this.usedIds.delete(id);
    }
}


class RandomActor {
    constructor(actorManager, grafica) {
        this.tableBody = document.getElementById('actor-table-body');
        this.actorManager = actorManager;
        this.grafica = grafica; // Añadimos la gráfica como propiedad
    }

    async fetchActorData(id) {
        const apiUrl = `https://freetestapi.com/api/v1/actors/${id}`;
        try {
            const response = await fetch(apiUrl);
            return response.ok ? await response.json() : {};
        } catch (error) {
            console.error(error);
            return {};
        }
    }

    // Cuenta las ocurrencias de cada tipo de premio usando reduce
    countAwards(awardsArray = []) {
        return awardsArray.reduce((counts, award) => ({
            ...counts,
            [award]: (counts[award] || 0) + 1
        }), {});
    }

    async addActorRow() {
        const randomId = this.actorManager.generateUniqueId();
        const data = await this.fetchActorData(randomId);
        const actorName = data.name || 'N/A';
        const awardsArray = data.awards || [];
        const awardCounts = this.countAwards(awardsArray);

        const row = document.createElement('tr');
        row.dataset.id = randomId;
        
        row.innerHTML = `
            <td>
                <img src="${data.image || 'no-image.png'}" alt="${actorName}">
                <span">${actorName}</span>
            </td>
            <td>${data.known_for.join(', ') || 'N/A'}</td>
            <td>${awardsArray.join(', ') || 'N/A'}</td>
            <td>
                <button class="Ver">Ver</button>
                <button class="Eliminar">Eliminar</button>
            </td>
        `;
        
        row.querySelector('.Eliminar').addEventListener('click', () => {
            this.removeActorRow(row, randomId, awardCounts);
        });

        this.tableBody.appendChild(row);
        this.actorManager.addUsedId(randomId);
        this.grafica.updateChart(awardCounts);
    }

    removeActorRow(row, id, awardCounts) {
        this.tableBody.removeChild(row);
        this.actorManager.removeUsedId(id);
        this.grafica.removeAwards(awardCounts);//Quita actor
    }

    startUpdatingTable() {
<<<<<<< Updated upstream
        this.addActorRow();
        setInterval(() => this.addActorRow(), 5000);//Modifica el tiempo de agregar actor
    }
}

class Grafica {
    constructor() {
        const ctx = document.getElementById('myChart').getContext('2d');
        this.colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
            '#FF5733', '#C70039', '#900C3F', '#581845'
        ]; //Colores de la grafica

        this.chart = new Chart(ctx, {
            type: 'doughnut',//Tipo de chart
            data: {
                labels: [], // Etiquetas vacías para los premios
                datasets: [{
                    label: 'Cantidad de Premios',
                    data: [], // Datos vacíos inicialmente
                    backgroundColor: [], // Colores para los premios
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { //Leyenda
                        position: 'bottom',
                        labels: {
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, index) => {
                                    const value = data.datasets[0].data[index];
                                    const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                                    const percentage = ((value / total) * 100).toFixed(2);
                                    return {
                                        text: `${label}: ${percentage}%`,
                                        fillStyle: data.datasets[0].backgroundColor[index]
                                    };
                                });
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribución de Premios',
                        font: {
                            size: 20, // Tamaño de la fuente
                            family: 'Arial', // Familia de la fuente
                            weight: 'bold' // Peso de la fuente
                        },
                        color: '#00000', // Color del texto
                        padding: {
                            top: 10, // Espaciado superior
                            bottom: 20 // Espaciado inferior
                        }
                    },
                    datalabels: {
                        color: '#00000'
                    }
                }
            },
            plugins: [ChartDataLabels] // Asegúrate de que el plugin esté incluido
        });
    }

    updateChart(awardCounts) { //Funcion para agregar al grafico
        const existingLabels = this.chart.data.labels;
        const existingData = this.chart.data.datasets[0].data;
        const existingColors = this.chart.data.datasets[0].backgroundColor;

        const { newLabels, newData, newColors } = Object.entries(awardCounts).reduce((acc, [award, count]) => { //Verifica y agrega el premio a la grafica
            const index = existingLabels.indexOf(award);
            const colorIndex = acc.newLabels.length % this.colors.length;

            const updatedData = index >= 0
                ? [...acc.newData.slice(0, index), acc.newData[index] + count, ...acc.newData.slice(index + 1)]
                : [...acc.newData, count];

            const updatedColors = index >= 0 //Verifica y agrega un color a un premio
                ? [...acc.newColors.slice(0, index), acc.newColors[index], ...acc.newColors.slice(index + 1)]
                : [...acc.newColors, this.colors[colorIndex]];

            return {
                newLabels: index >= 0 ? acc.newLabels : [...acc.newLabels, award],
                newData: updatedData,
                newColors: updatedColors
            };
        }, { newLabels: existingLabels.slice(), newData: existingData.slice(), newColors: existingColors.slice() }); //Sobreescribe la informacion de los textos

        this.chart.data.labels = newLabels;
        this.chart.data.datasets[0].data = newData;
        this.chart.data.datasets[0].backgroundColor = newColors;
        this.chart.update();
    }

    removeAwards(awardCounts) { //Funcion que actualiza nuevamente a la hora de eliminar un actor
        const { newLabels, newData, newColors } = this.chart.data.labels.reduce((acc, label, index) => {
            const currentData = this.chart.data.datasets[0].data[index];
            const currentColor = this.chart.data.datasets[0].backgroundColor[index];
            const count = awardCounts[label] || 0;

            const updatedData = currentData - count;
            return {
                newLabels: updatedData > 0 ? [...acc.newLabels, label] : acc.newLabels,
                newData: updatedData > 0 ? [...acc.newData, updatedData] : acc.newData,
                newColors: updatedData > 0 ? [...acc.newColors, currentColor] : acc.newColors
            };
        }, { newLabels: [], newData: [], newColors: [] });

        this.chart.data.labels = newLabels;
        this.chart.data.datasets[0].data = newData;
        this.chart.data.datasets[0].backgroundColor = newColors;
        this.chart.update();
    }
}

const actorManager = new ActorManager();
const grafica = new Grafica(); // Instancia de la gráfica
const randomActor = new RandomActor(actorManager, grafica); // Pasar grafica como argumento
=======
        this.addActorRow(); // Agrega un actor inicialmente
        setInterval(() => {
            this.addActorRow(); // Agrega un nuevo actor cada 5 segundos
        }, 1000);
    }
}


class ActorSearcher {
    constructor(actorManager, randomActor) {
        this.actorManager = actorManager;
        this.randomActor = randomActor;
        this.searchInput = null;
        this.searchResults = null;
        this.actorDetails = null;
        this.setupSearchUI();
    }

    setupSearchUI() {
        // Crear elementos del DOM para la búsqueda y detalles del actor
        const searchContainer = document.createElement('div');
        searchContainer.id = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" id="actor-search" placeholder="Buscar por ID o nombre...">
            <div id="search-results"></div>
            <div id="actor-details"></div>
        `;
        document.body.insertBefore(searchContainer, document.body.firstChild);

        this.searchInput = document.getElementById('actor-search');
        this.searchResults = document.getElementById('search-results');
        this.actorDetails = document.getElementById('actor-details');

        // Agregar evento de búsqueda
        this.searchInput.addEventListener('input', () => this.performSearch());
    }

    performSearch() {
        const searchTerm = this.searchInput.value.toLowerCase();
        this.searchResults.innerHTML = '';
        this.actorDetails.innerHTML = '';

        if (searchTerm.length === 0) return;

        const matchingRows = Array.from(this.randomActor.tableBody.rows).filter(row => {
            const id = row.dataset.id;
            const name = row.cells[0].textContent.toLowerCase();
            return id.includes(searchTerm) || name.includes(searchTerm);
        });

        matchingRows.forEach(row => {
            const resultItem = document.createElement('div');
            resultItem.textContent = `ID: ${row.dataset.id} - Nombre: ${row.cells[0].textContent.trim()}`;
            resultItem.addEventListener('click', () => this.showActorDetails(row));
            this.searchResults.appendChild(resultItem);
        });
    }

    showActorDetails(row) {
        const id = row.dataset.id;
        const name = row.cells[0].textContent.trim();
        const image = row.cells[0].querySelector('img').src;
        const knownFor = row.cells[1].textContent;
        const awards = row.cells[2].textContent;

        this.actorDetails.innerHTML = `
            <img src="${image}" alt="${name}">
            <h2>${name}</h2>
            <p><strong>ID:</strong> ${id}</p>
            <p><strong>Conocido por:</strong> ${knownFor}</p>
            <p><strong>Premios:</strong> ${awards}</p>
        `;

        // Limpiar los resultados de búsqueda y el campo de entrada
        this.searchResults.innerHTML = '';
        this.searchInput.value = '';
    }
}

// Uso
const actorManager = new ActorManager();
const randomActor = new RandomActor(actorManager);
const actorSearcher = new ActorSearcher(actorManager, randomActor);

>>>>>>> Stashed changes
randomActor.startUpdatingTable();