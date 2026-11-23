# Nico en la Cocina

Sitio web estático: abre `index.html` en un navegador para verlo localmente.

## Despliegue en Vercel

Importa el repositorio con el directorio raíz del proyecto configurado en la raíz
del repositorio y el preset de framework **Other**. El archivo `vercel.json`
indica que Vercel debe publicar la raíz, donde están `index.html`, `styles.css`,
`assets` y `public`. No se necesita un comando de compilación.

Si el proyecto ya existe en Vercel, comprueba esos ajustes y vuelve a desplegar
la revisión que incluye `vercel.json`.
