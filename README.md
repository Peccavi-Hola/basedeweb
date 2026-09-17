# Portafolio Académico de Base de Datos

Proyecto web de Moises Salva Lulo, estudiante de Ingeniería de Sistemas y Computación de la Universidad Peruana Los Andes.

Esta versión incluye el logotipo institucional y un DB Assistant visual funcional.

## Abrir el proyecto

1. Descomprime la carpeta `portfolio-linux`.
2. Abre la carpeta completa con Visual Studio Code.
3. Haz doble clic en `index.html` o usa la extensión "Live Server".
4. Para editar colores, abre `css/style.css`.
5. Para editar contenido de semanas, abre `index.html`.
6. Para editar la consola y animaciones, abre `js/script.js`.

El botón del robot aparece en la esquina inferior derecha. Al pulsarlo se abre el asistente y sus opciones llevan a Unidades, Proyecto y Evidencias.

## Reemplazar tu foto

Guarda tu foto como:

`img/perfil/foto.jpg`

Luego cambia el bloque `.avatar-placeholder` del `index.html` por:

```html
<img src="img/perfil/foto.jpg" alt="Foto de Moises Salva Lulo">
```

## Evidencias

Guarda tus imágenes dentro de:

`img/evidencias/`

Ejemplo:

- `evidencia_01.png`
- `modelo_er.png`
- `normalizacion.png`
- `consulta_sql.png`

Después cambia los marcadores de las tarjetas en `index.html`.

## PDFs

Coloca tus documentos en:

`documentos/`

Ejemplo:

- `practica_01.pdf`
- `informe_unidad_01.pdf`
- `laboratorio_sql.pdf`
- `proyecto_final.pdf`

Para que los botones abran un PDF real, cambia por ejemplo:

```html
<a href="documentos/practica_01.pdf" target="_blank">ver</a>
```

## SQL

Puedes guardar scripts reales en la carpeta:

`sql/`

Ejemplo: `sql/proyecto_final.sql`

## Personalización rápida

Variables principales de color en `css/style.css`:

```css
--bg: #050505;
--terminal: #00ff7f;
--terminal-dark: #00b860;
--text: #e8e8e8;
--muted: #a0a0a0;
```

El proyecto no ejecuta comandos reales del sistema. La consola es únicamente una simulación segura con JavaScript.
