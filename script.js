class Actor {
    constructor(id) {
        this.id = id;
        this.apiUrl = `https://freetestapi.com/api/v1/actors/${this.id}`;
    }

    async fetchActorData() {
        try {
            const response = await fetch(this.apiUrl);
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

    async updateTable() {
        const data = await this.fetchActorData();
        if (data) {
            document.getElementById('actor-name').textContent = data.name || 'N/A';
            document.getElementById('actor-known-for').textContent = data.known_for || 'N/A';
        }
    }
}

// Instancia la clase Actor y actualiza la tabla
const actor = new Actor(1);
actor.updateTable();