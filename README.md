# 🌐 Lector de Noticias Accesible para no videntes.

### Aplicación web accesible para la lectura de noticias mediante voz

Esta aplicación desarrollada en **React** y **Vite** está diseñada para facilitar la lectura de noticias a personas con discapacidades visuales. Utiliza la API de **NewsAPI** para obtener las noticias y proporciona un conjunto de controles accesibles mediante el teclado para mejorar la experiencia de usuario.

---

## 🚀 Funcionalidades

* **🔊 Lectura de noticias por voz**: La app utiliza `SpeechSynthesis` para leer en voz alta los titulares y descripciones de las noticias. SpeechSynthesis (TTS) es un sistema de síntesis de voz integrado en el navegador para convertir textos en audio.
* **⏩ Control de velocidad de lectura**: Ajusta la velocidad de la voz con las teclas de flechas izquierda/derecha.
* **🔠 Ajuste de tamaño de letra**: Aumenta o disminuye el tamaño del texto con `Ctrl + L` o `Ctrl + K`.
* **⌨️ Navegación accesible**: Usa las teclas de flecha para moverte entre noticias y la barra espaciadora para escuchar o pausar la lectura.
* **📖 Instrucciones de uso**: Pulsa la tecla `H` en cualquier momento para escuchar instrucciones detalladas.

---

## 📖 Instrucciones de Uso del Teclado

* **⬆️⬇️ Flechas arriba/abajo**: Navegar entre las noticias.
* **⬅️➡️ Flechas izquierda/derecha**: Ajustar la velocidad de lectura.
* **⏸ Barra espaciadora**: Leer/pausar la noticia actual.
* **⏎ Enter**: Abrir el enlace de la noticia en una nueva ventana.
* **ℹ️ H**: Escuchar las instrucciones de uso.
* **🔇 M**: Silenciar la lectura.
* **🔁 R**: Repetir la última noticia leída.
* **🔠 Ctrl + L**: Aumentar el tamaño de letra.
* **🔡 Ctrl + K**: Reducir el tamaño de letra.

---

## 🛠️ Instalación y Configuración

1. **Clona el repositorio**:

    ```bash
    git clone https://github.com/frnLcr/Lector-de-Noticias.git
    ```

2. **Instala las dependencias**:

    ```bash
    cd Lector-de-Noticias
    npm install
    ```

3. **Inicia el servidor de desarrollo**:

    ```bash
    npm run dev
    ```

4. **Abre el navegador**:

    Ve a `http://localhost:3000` para acceder a la aplicación.

---

## 🌐 API

La aplicación utiliza la API de **NewsAPI** para obtener las últimas noticias. Necesitas una API key válida de NewsAPI, que puedes obtener [aquí](https://newsapi.org/). Reemplaza la clave API en el código (`Noticias.js`) en la siguiente línea:

```javascript
const url = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=TU_API_KEY';
