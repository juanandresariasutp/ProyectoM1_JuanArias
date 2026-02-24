# 🎨 ColorFly Studio

Generador de paletas de colores para UI/branding con vista previa visual, bloqueo de colores, guardado local y descarga de paletas.

---

## 📚 Tabla de contenido

- [📝 Descripción](#-descripción)
- [🚀 Demo](#-demo)
- [🛠️ Tecnologías usadas](#️-tecnologías-usadas)
- [👤 Manual de usuario](#-manual-de-usuario)
- [⚙️ Manual técnico](#️-manual-técnico)
- [💻 Ejecución en local](#-cómo-ejecutar-la-aplicación-en-local)
- [🌐 Despliegue en GitHub Pages](#-cómo-desplegar-la-aplicación-en-github-pages)
- [🗂️ Estructura del proyecto](#️-estructura-del-proyecto)
- [✍️ Autor](#️-autor-del-proyecto)

---

## 📝 Descripción

**ColorFly Studio** es una aplicación web estática orientada a diseñadores y desarrolladores que necesitan generar combinaciones de color rápidas y armoniosas.

### ✨ Funcionalidades principales

- Generación de paletas de **6, 8 o 9 colores**.
- Selección de formato base: **HEX** o **HSL**.
- Bloqueo de colores individuales para conservarlos al regenerar.
- Copia de color al portapapeles con un clic.
- Vista previa visual del uso de la paleta en un mockup.
- Guardado de paletas en `localStorage`.
- Descarga de paletas guardadas en archivo `.txt`.

---

## 🚀 Demo

🔗 **Accede a la aplicación aquí:**  
[https://juanandresariasutp.github.io/ProyectoM1_JuanArias/](https://juanandresariasutp.github.io/ProyectoM1_JuanArias/)

---

## 🛠️ Tecnologías usadas

- **HTML5**
- **CSS3** (organizado por capas/archivos)
- **JavaScript Vanilla (ES6+)**
- **Google Fonts**
- **Git + GitHub**
- **GitHub Pages** para deploy

---

## 👤 Manual de usuario

### 🎯 Flujo básico de uso

#### 1️⃣ Configurar y generar la paleta

1. Dirígete a la sección **"Generador de Paletas"** (la primera sección visible al cargar la aplicación).
2. En el panel de **Controles**, selecciona:
   - **Tamaño de paleta**: elige entre `6 colores`, `8 colores` o `9 colores` según tus necesidades.
   - **Formato de color**: elige entre `HEX` (ej: `#FF5733`) o `HSL` (ej: `hsl(120, 100%, 50%)`).
3. Pulsa el botón **"Generar Paleta 🛠️"** para crear una nueva combinación de colores aleatoria.
4. Se mostrarán las tarjetas de color en la cuadrícula con valores en ambos formatos (HEX y HSL).

#### 2️⃣ Trabajar con colores individuales

- **Copiar un color**: haz clic sobre cualquier tarjeta de color. Se copiará automáticamente al portapapeles y verás una notificación de confirmación.
- **Bloquear un color**: haz clic en el **icono de candado** en la esquina superior derecha de una tarjeta. El color bloqueado se conservará cuando generes una nueva paleta. El candado cambia de abierto a cerrado para indicar el estado.
- **Desbloquear un color**: vuelve a hacer clic en el candado cerrado para desbloquearlo.

#### 3️⃣ Ver la paleta en contexto (Ejemplo Visual)

1. Baja a la sección **"Ejemplo Visual"**.
2. Verás un mockup que muestra cómo se vería tu paleta de colores en una aplicación real (header, banner, contenido, sidebar, footer).
3. Los colores asignados se actualizan automáticamente según tu paleta generada.
4. Puedes pulsar **"Generar"** en esta sección para crear una nueva paleta sin regresar al generador.

#### 4️⃣ Guardar una paleta

1. Una vez estés satisfecho con tu paleta, pulsa el botón **"Guardar 💾"** en el panel de controles.
2. Se guardará automáticamente en tu navegador (en `localStorage`).
3. Verás una notificación de confirmación: "Paleta guardada".

#### 5️⃣ Gestionar paletas guardadas

Desplázate a la sección **"Paletas guardadas"** para ver todas tus paletas:

- **Información de cada paleta**:
  - Muestras visuales de los colores (_swatches_).
  - Formato (HEX o HSL).
  - Cantidad de colores.
  - Fecha y hora en que se guardó.

- **Descargar una paleta**:
  - Pulsa el botón **"Descargar"** en la paleta que desees.
  - Se descargará un archivo `.txt` con los valores HEX y HSL de cada color.
  - Útil para compartir o usar en otros proyectos.

- **Eliminar una paleta**:
  - Pulsa el botón **"Eliminar"** (rojo) en la paleta.
  - Se borrará de inmediato.

- **Limpiar todas las paletas guardadas**:
  - Pulsa el botón **"Limpiar guardadas"** en la parte superior.
  - Se abrirá un diálogo de confirmación.
  - Confirma si deseas borrar **todas** las paletas (esta acción es irreversible).

### 📚 Secciones adicionales

- **Fundamentos de la teoría del COLOR**: encontrarás información sobre combinaciones armónicas de colores y un enlace a Wikipedia para profundizar.
- **¿Necesitas un Profesional?**: sección para contactar a un diseñador profesional si requieres un trabajo más personalizado.
- **FAQ**: respuestas a preguntas frecuentes sobre funcionamiento, descarga, diferencias entre formatos, etc.

### 💡 Consejos prácticos

- Usa el **bloqueo de colores** para experimentar: bloquea los colores que te gusten y regenera el resto.
- Prueba ambos formatos (**HEX** y **HSL**) según tu herramienta de diseño: HEX es estándar en desarrollo web, HSL es más intuitivo para ajustar variaciones.
- Descarga tus paletas favoritas en `.txt` para tener un respaldo o compartir con tu equipo.
- Usa el mockup visual para verificar que los colores funcionan bien juntos antes de guardar.

---

## ⚙️ Manual técnico

### 🧠 Decisiones técnicas

- Aplicación **100% frontend** (sin backend), ideal para hosting estático.
- Estado en memoria para la sesión (`currentPalette`, `paletteFormat`, `paletteSize`).
- Persistencia simple y efectiva con `localStorage` (`colorfly.savedPalettes`).
- Render dinámico del DOM sin librerías externas para mantener bajo el peso del proyecto.
- CSS modular para facilitar mantenimiento, escalabilidad y lectura del código.

### 🔩 Funciones clave de `assets/js/main.js` (explicación breve)

- **`generate()`**: coordina el flujo principal; construye y renderiza una nueva paleta, luego muestra feedback visual.
- **`buildPalette()`**: genera la nueva paleta respetando los colores bloqueados por índice.
- **`renderPalette()`**: crea dinámicamente las tarjetas de color, etiquetas HEX/HSL, candados y eventos de copia.
- **`updateVisualExample()`**: actualiza el mockup visual asignando colores por `data-preview-color`.
- **`setQuantity()` / `setFormat()`**: cambian configuración global de tamaño/formato y sincronizan botones activos.
- **`savePalette()` / `getSavedPalettes()` / `renderSavedPalettes()`**: ciclo completo de guardado, lectura y visualización de paletas persistidas.
- **`downloadSavedPalette()`**: exporta una paleta guardada en `.txt` con datos de cada color en HEX y HSL.
- **`copyColorToClipboard()`**: copia el valor de color seleccionado al portapapeles del navegador.
- **`showToast()`**: maneja notificaciones no intrusivas para acciones de usuario.
- **`setupNavToggle()`**: controla apertura/cierre del menú responsive en pantallas pequeñas.

### 🧱 Organización de estilos CSS

- `reset.css`: normalización de estilos base.
- `variables.css`: tokens de diseño (colores, fuentes, spacing, radios).
- `base.css`: estilos globales y tipográficos.
- `layout.css`: distribución principal, secciones y comportamiento responsive.
- `components.css`: estilos de componentes reutilizables.
- `pages.css`: reglas puntuales por sección/página.

---

## 💻 Cómo ejecutar la aplicación en local

### 📋 Requisitos previos

Solo necesitas:
- **Navegador web moderno**: Chrome, Firefox, Edge, Safari o similar.
- **Git instalado** (para clonar el repositorio) o descargarlo como ZIP.
- **Editor de código** (recomendado: VS Code) si deseas modificar el código.
- **No requiere instalación de dependencias** ni servidores complejos.

### 📥 Pasos para la instalación

#### Paso 1: Abrir la terminal/consola

- **En Windows**: Abre `cmd` o **PowerShell**.
- **En Mac**: Abre `Terminal`.
- **En Linux**: Abre tu terminal (Ctrl + Alt + T en la mayoría de distribuciones).

#### Paso 2: Clonar el repositorio

Ejecuta el siguiente comando:

```bash
git clone https://github.com/juanandresariasutp/ProyectoM1_JuanArias.git
```

Si no tienes Git instalado, puedes descargar el ZIP directamente desde [GitHub](https://github.com/juanandresariasutp/ProyectoM1_JuanArias).

#### Paso 3: Navegar a la carpeta del proyecto

Ejecuta:

```bash
cd ProyectoM1_JuanArias
```

Para verificar que estás en el directorio correcto, lista el contenido:

```bash
ls
```

Deberías ver archivos como `index.html` y una carpeta `assets/`.

#### Paso 4: Abrir en Visual Studio Code

```bash
code .
```

Se abrirá automáticamente VS Code con el proyecto cargado.

#### Paso 5: Instalar Live Server (extensión recomendada)

1. En VS Code, abre el panel de **Extensiones** (Ctrl + Shift + X en Windows/Linux, Cmd + Shift + X en Mac).
2. Busca **"Live Server"** creado por **Ritwick Dey**.
3. Haz clic en **Instalar**.

#### Paso 6: Ejecutar con Live Server

1. Haz clic derecho sobre el archivo `index.html`.
2. Selecciona **"Open with Live Server"**.
3. Se abrirá automáticamente en `http://localhost:5500/` (o similar).
4. Cualquier cambio que guardes se reflejará en tiempo real en el navegador.

### 🎯 Alternativa: abrir directamente

Si prefieres no usar Live Server, simplemente:

1. Navega a la carpeta del proyecto.
2. Haz doble clic en `index.html`.
3. Se abrirá en tu navegador predeterminado.

---

## 🌐 Cómo desplegar la aplicación en GitHub Pages

1. Subir el proyecto a un repositorio de GitHub.
2. Ir a **Settings** del repositorio.
3. Entrar en **Pages**.
4. En **Build and deployment** configurar:
   - Source: **Deploy from a branch**
   - Branch: **main** (o la rama que uses)
   - Folder: **/ (root)**
5. Guardar.
6. Esperar la publicación y copiar la URL generada.
7. Reemplazar el enlace pendiente en la sección **Demo**.

---

## 🗂️ Estructura del proyecto

```text
colorfly-studio/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   ├── reset.css
    │   ├── variables.css
    │   ├── base.css
    │   ├── layout.css
    │   ├── components.css
    │   └── pages.css
    ├── images/
    └── js/
        └── main.js
```

---

## ✍️ Autor del proyecto

**Juan Andrés Arias Tascón**

🎓 **Ingeniero de Sistemas | Desarrollador de Software**  
👨‍💻 Desarrollador Web en formación – 2026

⭐ Proyecto creado con fines educativos y de práctica.

---

**Módulo 1 - Proyecto Integrador**  
*Soy Henry - Bootcamp de Desarrollo Full Stack*

