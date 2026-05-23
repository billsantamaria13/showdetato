# El Show de Tato · Sitio Web Oficial

## 📁 Estructura del proyecto

```
show-de-tato/
├── index.html          ← Página principal (4 secciones)
├── style.css           ← Estilos y animaciones
├── script.js           ← Lógica: carrusel, carrito y WhatsApp
├── brochure.pdf        ← ⚠️ SUBIR MANUALMENTE
├── bienvenida.jpeg     ← ⚠️ SUBIR MANUALMENTE
├── carrusel_1.jpeg     ← ⚠️ SUBIR MANUALMENTE
├── carrusel_2.jpeg     ← ⚠️ SUBIR MANUALMENTE
├── carrusel_3.jpeg     ← ⚠️ SUBIR MANUALMENTE
└── README.md
```

## 🖼️ Imágenes y archivos que debes subir manualmente

| Archivo | Descripción |
|---|---|
| `bienvenida.jpeg` | Foto principal del hero (sección Bienvenida) |
| `carrusel_1.jpeg` | Primera foto del carrusel (¿Quiénes somos?) |
| `carrusel_2.jpeg` | Segunda foto del carrusel |
| `carrusel_3.jpeg` | Tercera foto del carrusel |
| `brochure.pdf`    | PDF descargable con tarifas y paquetes de servicios |

> **Importante:** Los archivos deben llamarse **exactamente igual** (respetando mayúsculas, minúsculas y extensión) para que el sitio los cargue correctamente.

## 📱 Número de WhatsApp

El número de WhatsApp está configurado en **`script.js`**, línea destacada con el comentario:

```js
const WHATSAPP_NUMBER = '573505267000'; // Numero Whatsapp
```

Para cambiarlo, edita esa línea en GitHub directamente o en tu editor de texto.

## 🚀 Publicar en GitHub Pages

1. Crea un repositorio en GitHub (puede ser público o privado con Pages activado).
2. Sube todos los archivos de esta carpeta a la rama `main`.
3. Ve a **Settings → Pages → Source** y selecciona la rama `main` y carpeta `/root`.
4. GitHub te dará una URL del tipo `https://tuusuario.github.io/show-de-tato/`.
5. Vincula esa URL a tu dominio personalizado en **Settings → Pages → Custom domain**.

## 🔧 Modificaciones rápidas

| Qué cambiar | Dónde |
|---|---|
| Número de WhatsApp | `script.js` → busca `// Numero Whatsapp` |
| Precios de productos | `index.html` → busca `addToCart(` en cada botón |
| Precio base de servicios | `index.html` → busca `$2.000.000` |
| Textos y contenido | `index.html` → cada sección está comentada con su nombre |
| Colores y estilos | `style.css` → sección `:root` con variables CSS |
