# Noticiasisa

> Encontrémonos con la actualidad.

Noticiasisa es un proyecto web editorial desarrollado con HTML, Tailwind CSS y JavaScript. Presenta artículos de actualidad en un diseño responsive e incluye una función de narración en español mediante la Web Speech API.

## Características

- Diseño editorial adaptable a dispositivos móviles y escritorio.
- Jerarquía tipográfica con Source Serif 4 e Inter.
- Estilos utilitarios de Tailwind CSS cargados desde CDN.
- Narración del artículo con controles para reproducir, pausar, reanudar y detener.
- Selección de una voz en español disponible en el navegador.
- Etiquetas semánticas, textos alternativos y estados accesibles para la narración.
- Carga diferida de imágenes secundarias.

## Tecnologías

- HTML5
- CSS3
- Tailwind CSS (Play CDN)
- JavaScript (ES6+)
- Web Speech API

## Estructura del proyecto

```text
noticiasisa/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── narration.js
├── imagenes/
│   ├── Noticiasisa-removebg-preview.png
│   ├── foto1.png
│   ├── foto2.png
│   ├── foto3.png
│   └── foto4.png
└── README.md
```

## Ejecutar localmente

1. Clona el repositorio:

   ```bash
   git clone https://github.com/marianavargasospina/noticiasisa.git
   ```

2. Entra en la carpeta:

   ```bash
   cd noticiasisa
   ```

3. Abre `index.html` en el navegador. Para una experiencia más cercana a un entorno de desarrollo, puedes usar la extensión Live Server de Visual Studio Code.

La página necesita conexión a internet para cargar Tailwind CSS y las fuentes alojadas en Google Fonts.

## Narración de audio

La narración usa las voces disponibles en el sistema operativo y el navegador. La disponibilidad, el idioma y la calidad de las voces pueden variar según el dispositivo. Si el navegador no admite la Web Speech API, el control se deshabilita y se muestra un mensaje.

## Accesibilidad y rendimiento

- Se incluyen textos alternativos para las imágenes.
- Los estados de narración se anuncian mediante una región `aria-live`.
- Las imágenes secundarias utilizan carga diferida.
- Se respetan las preferencias de movimiento reducido.

Se recomienda validar el sitio con Lighthouse, probar navegación por teclado y revisar el comportamiento de la narración en Chrome, Edge, Firefox y Safari.

## Criterios editoriales

Antes de publicar una noticia, verifica nombres, cargos, fechas, citas, cifras y referencias legales con fuentes primarias. Identifica las opiniones como tales y distingue entre propuestas, proyectos de ley y normas vigentes. Añade enlaces a las fuentes y confirma que tienes permiso para usar las imágenes y sus créditos.

## Alcance actual

Esta versión es una página editorial estática de demostración. No incluye CMS, base de datos, sistema de usuarios ni API para administrar noticias.

## Licencia y créditos

Añade aquí la licencia del código y confirma los derechos de uso de las fotografías, logotipo, tipografías y demás recursos de terceros antes de distribuir el proyecto.
