# Guía para editar el sitio Corazón Late

> Aquí aprenderás a cambiar textos, imágenes, datos bancarios, testimonios y casi todo lo que aparece en **corazonlate.org**, sin necesidad de tocar código.

---

## 🔑 Cómo entrar al panel de administración

1. Abre **https://corazonlate.org/admin** en tu navegador.
2. Verás una pantalla que dice *"Inicia sesión con Netlify Identity"*.
3. Haz clic en **"Login with email"**.
4. Escribe tu correo y la contraseña que recibiste por invitación.
   - Si es tu primera vez, recibirás un correo de Netlify con un enlace para crear tu contraseña.
5. Una vez dentro, verás el panel con varias secciones a la izquierda.

> ⚠️ Si olvidas tu contraseña: en la pantalla de login, haz clic en *"Forgot password?"* y recibirás un correo para restablecerla.

---

## 🗂️ Las 5 secciones del panel

Al entrar verás estas opciones en el menú lateral:

### 1. **⚙️ Configuración del Sitio**
Información general que aparece en todas las páginas.
- Nombre del sitio
- Frase corta (tagline del footer)
- Correo de contacto (aparece en footer y página /contacto)
- Teléfono (opcional, déjalo vacío para ocultarlo)
- URL de Instagram + nombre de usuario visible
- URL de Facebook (opcional)

> 💡 Si cambias el correo, se actualiza automáticamente en el footer Y en la página de contacto.

### 2. **🏠 Página de Inicio**
Aquí editas **todo lo de la página principal**, organizado por secciones:

| Sección | Qué se edita |
|---|---|
| 🟥 HERO | Título, subtítulo, botones, insignia "+500 niños alcanzados", **fotos rotativas** (4 que ciclan cada 5s) |
| 📊 Estadísticas | Las 3 tarjetas en la banda roja (números, etiquetas, íconos) |
| 🎯 Misión | "¿Por qué Corazón Late?" + imagen + cita bíblica |
| 💼 Lo que Hacemos | Las 4 tarjetas de servicios (Jornadas, Talleres, Arte, Apoyo Familiar) |
| 📸 Galería | Las 6 fotos de actividades con sus títulos |
| 🔥 Banner de Impacto | La cita inspiradora + fotos rotativas de fondo (3 fotos que ciclan cada 6s) |
| 💬 Testimonios | Las 3 tarjetas de testimonios |
| 🎯 Llamado Final | El bloque rojo del final con los botones |

### 3. **👋 Página Nosotros**
- Encabezado de la página
- Misión y Visión
- **6 valores** (puedes agregar más, eliminar, cambiar el orden)
- Historia (2 párrafos)
- Llamado a la acción al final

### 4. **💝 Página Donaciones**
Lo más importante de esta sección:
- **3 tarjetas de impacto** ($10, $25, $50 — puedes agregar más o cambiar montos)
- **PayPal**: puedes activar/desactivar la opción, cambiar el `hosted_button_id` o el texto del botón
- **🏦 Datos bancarios**: cambia banco, titular, cédula, número de cuenta, tipo. Puedes activar/desactivar toda la sección bancaria.
- Llamado al voluntariado al final

### 5. **📧 Página Contacto**
- Encabezado y textos introductorios
- Títulos del formulario y mensaje de éxito

---

## ✏️ Cómo cambiar un texto

1. Entra a la sección correspondiente (ej. *Página de Inicio*).
2. Despliega la sub-sección que quieras editar (ej. *🟥 HERO*).
3. Cambia el texto en el campo correspondiente.
4. Haz clic en **"Publish"** arriba a la derecha (o "Save" si quieres guardar borrador).
5. Espera **1-2 minutos** y el sitio se actualizará automáticamente.

> 💡 Para confirmar que se publicó, abre **corazonlate.org** en una pestaña nueva (asegúrate de hacer Ctrl+F5 / Cmd+Shift+R para forzar refrescar).

---

## 🖼️ Cómo cambiar una imagen

1. Entra a la sección correspondiente.
2. Busca el campo de imagen (tiene un cuadrito gris con la imagen actual).
3. Haz clic en él → **"Upload new"** → elige el archivo desde tu computadora.
4. Una vez subida, haz clic en **"Choose selected"**.
5. **Publish** → el sitio se actualiza en 1-2 min.

### Consejos para fotos
- **Tamaño recomendado:** ancho ≤ 1400px (las muy grandes hacen lenta la web).
- **Formato:** JPG para fotos, PNG si tiene transparencia.
- **Peso ideal:** menos de 300KB cada una.
- **Si tu foto está vertical**, va bien en el HERO o en la galería. Si es horizontal/panorámica, queda mejor en el Banner de Impacto.

---

## ➕ Cómo agregar/quitar elementos de listas

Algunos campos son **listas** (testimonios, valores, fotos de la galería, datos bancarios, etc.). Para gestionarlas:

- **Agregar uno nuevo:** botón "Add" al final de la lista.
- **Eliminar uno:** botón "🗑️" (basurero) en cada item.
- **Reordenar:** arrastra el item desde el ícono "⠿" (puntitos).

---

## 🚨 Cosas que NO se pueden cambiar desde el CMS (requieren ayuda técnica)

- El **diseño visual** (colores, tipografías, estructura general).
- El **formulario de voluntariado** (los pasos, las preguntas, los campos).
- La conexión con **n8n** (donde llegan los emails de los formularios).
- El **dominio** corazonlate.org y configuración de Netlify.

Si necesitas cambiar algo de esto, contacta a tu desarrollador.

---

## ⚠️ Buenas prácticas

1. **No elimines el archivo entero** desde el CMS, solo edita campos. Si borras algo crítico, el sitio puede romperse.
2. **Antes de publicar**, revisa el preview en el panel para asegurarte que se ve bien.
3. **Si cambias muchas cosas a la vez**, hazlo de a una, publica, verifica el sitio, y luego pasa a la siguiente.
4. **Fotos pesadas** (más de 1MB) pueden hacer la web más lenta. Si tienes una foto gigante, comprímela antes de subir (usa https://squoosh.app gratis).
5. **Cambios bancarios o de PayPal** verifica TRES veces que los números son correctos antes de publicar — afecta directamente a las donaciones.

---

## 🆘 Problemas comunes

| Problema | Solución |
|---|---|
| "No puedo iniciar sesión" | Click en *Forgot password*. Si no llega el correo, revisa carpeta de spam. |
| "Publiqué pero no veo cambios" | Espera 2 min. Refresca con Ctrl+F5. Si sigue igual, contacta a tu desarrollador. |
| "Subí una imagen pero no se ve" | Verifica que el campo "Foto" muestra la imagen correcta. A veces el panel cachea — refresca el panel. |
| "Eliminé un campo sin querer" | No publiques. Cierra la pestaña sin guardar. Si ya publicaste, contacta a tu desarrollador (el cambio está en GitHub y se puede revertir). |

---

## 📞 Soporte técnico

Si necesitas ayuda con algo que no está en esta guía, contacta a tu desarrollador con:
- Descripción de lo que intentaste hacer
- Captura de pantalla del error si hay
- Hora aproximada del intento (para revisar logs)

---

**¡Listo! Ya puedes editar tu sitio con total libertad.** ❤️
