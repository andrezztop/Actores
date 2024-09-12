class RandomActor {
    constructor() {
        this.tableBody = document.getElementById('actor-table-body');
        this.usedIds = new Set(); // Para almacenar IDs ya utilizados
    }

    async fetchActorData(id) {
        const apiUrl = `https://freetestapi.com/api/v1/actors/${id}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    generateUniqueId() {
        let randomId;
        do {
            randomId = Math.floor(Math.random() * 40) + 1; // Genera un ID aleatorio entre 1 y 40
        } while (this.usedIds.has(randomId)); // Asegúrate de que el ID no haya sido usado
        return randomId;
    }

    async addActorRow() {
        const randomId = this.generateUniqueId(); // Obtén un ID único
        const data = await this.fetchActorData(randomId);
        data && (() => {
            const row = document.createElement('tr');
        
            row.innerHTML = `
                <td>
                    <img src="${data?.image || 'no-image.png'}" alt="${data?.name || 'N/A'}">
                    <span style="vertical-align: middle;">${data?.name || 'N/A'}</span>
                </td>
                <td>${data?.known_for || 'N/A'}</td>
                <td>${data?.awards || 'N/A'}</td>
                <td>
                    <button class="Ver">Ver</button>
                    <button class="Eliminar">Eliminar</button>
                </td>
            `;
        
            this.tableBody.appendChild(row);
            this.usedIds.add(randomId); // Marca el ID como utilizado
        })();
        
    }

    startUpdatingTable() {
        this.addActorRow(); // Agrega un actor inicialmente
        setInterval(() => {
            this.addActorRow(); // Agrega un nuevo actor cada 5 segundos
        }, 5000);
    }
}

// Usage
const randomActor = new RandomActor();
randomActor.startUpdatingTable();