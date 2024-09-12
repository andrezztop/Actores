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
    constructor(actorManager) {
        this.tableBody = document.getElementById('actor-table-body');
        this.actorManager = actorManager;
    }

    async fetchActorData(id) {
        const apiUrl = `https://freetestapi.com/api/v1/actors/${id}`;
        try {
            const response = await fetch(apiUrl);
            return response.ok ? await response.json() : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async addActorRow() {
        const randomId = this.actorManager.generateUniqueId(); // Obtén un ID único
        const data = await this.fetchActorData(randomId);
        
        // Usa un operador lógico para manejar la falta de datos sin `if`
        data && randomId !== null && (() => {
            const row = document.createElement('tr');
            row.dataset.id = randomId; // Guarda el ID en el atributo `data-id`
        
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
        
            // Agrega el manejador de eventos para el botón de eliminar
            row.querySelector('.Eliminar').addEventListener('click', () => {
                this.removeActorRow(row, randomId);
            });
        
            this.tableBody.appendChild(row);
            this.actorManager.addUsedId(randomId); // Marca el ID como utilizado
        })();
    }

    removeActorRow(row, id) {
        this.tableBody.removeChild(row); // Elimina la fila
        this.actorManager.removeUsedId(id); // Libera el ID
    }

    startUpdatingTable() {
        this.addActorRow(); // Agrega un actor inicialmente
        setInterval(() => {
            this.addActorRow(); // Agrega un nuevo actor cada 5 segundos
        }, 5000);
    }
}

// Usage
const actorManager = new ActorManager();
const randomActor = new RandomActor(actorManager);
randomActor.startUpdatingTable();