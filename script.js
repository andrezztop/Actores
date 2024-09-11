class ActorTabla {
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
            const actorInfo = document.getElementById('actor-info');
            const actorFoto = actorInfo.getElementsByTagName('img')[0];
            actorFoto.src = data.image || 'no-image.png';
            
            const actorName = actorInfo.getElementsByTagName('span')[0];
            actorName.textContent = data.name || 'N/A';
            
            document.getElementById('actor-known-for').textContent = data.known_for || 'N/A';
            document.getElementById('actor-awards').textContent = data.awards || 'N/A';
        }
    }
}

// Instancia la clase Actor y actualiza la tabla
const actor = new ActorTabla(1);
actor.updateTable();