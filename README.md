# Actores
Actor Manager Web Application
Este proyecto es una aplicación web que gestiona y visualiza información de actores, utilizando una tabla dinámica y una gráfica de premios. Los datos de los actores se obtienen de una API externa y se muestran en la página web. La aplicación también permite realizar búsquedas y ver los detalles de cada actor, con una funcionalidad adicional para traducir textos.

Características
Generación automática de actores: Se genera un actor de forma aleatoria cada cierto intervalo de tiempo.
Gestión de premios: Se muestra un gráfico de dona que actualiza la cantidad de premios obtenidos por cada actor.
Detalles del actor: Cada actor tiene una ventana modal que muestra información detallada sobre su carrera y premios.
Funcionalidad de búsqueda: Permite buscar actores por su nombre o ID en tiempo real.
Traducción de biografías: Utiliza la API de LibreTranslate para traducir biografías a diferentes idiomas.
Requisitos
Un navegador moderno (Chrome, Firefox, Edge, etc.).
Conexión a internet para obtener datos de la API de actores y traducir biografías.
Instalación
Clona este repositorio en tu máquina local:
bash
Copiar código
git clone https://github.com/tu-usuario/actor-manager.git
Navega al directorio del proyecto:
bash
Copiar código
cd actor-manager
Abre el archivo index.html en un navegador web.
Uso
Generación automática: Una vez cargada la página, se generarán actores de manera automática y se agregarán a la tabla. También se actualizará el gráfico de premios en función de los premios obtenidos por los actores.

Búsqueda: Puedes buscar actores por su nombre o ID utilizando la barra de búsqueda en la parte superior de la página.

Ver detalles: Haz clic en el botón "Ver" para abrir un modal que muestra la información completa de un actor.

Eliminar actores: Si deseas eliminar un actor de la tabla y del gráfico, haz clic en el botón "Eliminar". Esto también actualizará el gráfico removiendo los premios asociados.

Estructura del Proyecto
index.html: El archivo HTML principal que carga la interfaz de usuario.
styles.css: El archivo CSS para los estilos de la aplicación.
scripts.js: El archivo JavaScript que contiene la lógica para gestionar la tabla de actores, las búsquedas, los detalles en modal y la gráfica.
README.md: Este archivo, que contiene información sobre cómo ejecutar el proyecto.
API utilizada
Los datos de los actores se obtienen de la API de prueba: Free Test API.

Endpoint: https://freetestapi.com/api/v1/actors/{id}
Descripción: Devuelve información sobre actores, incluyendo nombre, premios, biografía, imagen, etc.
