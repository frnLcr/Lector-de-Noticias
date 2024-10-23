import React, { useState, useEffect, useRef } from 'react';

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [error, setError] = useState(null);
  const [noticiaActual, setNoticiaActual] = useState(0);
  const [estaLeyendo, setEstaLeyendo] = useState(false);
  const [paginaCargada, setPaginaCargada] = useState(false);
  const [velocidadLectura, setVelocidadLectura] = useState(1.0);
  const [tamanoLetra, setTamanoLetra] = useState(1);
  const noticiaRefs = useRef([]);
  const instruccionesRef = useRef(null);

  // Función para ajustar el tamaño de letra
  const ajustarTamanoLetra = (accion) => {
    setTamanoLetra(prevTamano => {
      let nuevoTamano;
      if (accion === 'aumentar') {
        nuevoTamano = Math.min(prevTamano + 0.1, 2);
        leerTexto('Tamaño de letra aumentado', true, true);
      } else {
        nuevoTamano = Math.max(prevTamano - 0.1, 0.8);
        leerTexto('Tamaño de letra reducido', true, true);
      }
      return Number(nuevoTamano.toFixed(1));
    });
  };

  // Función para leer el texto en voz alta
  const leerTexto = (texto, interrumpir = true, prioridad = false) => {
    if (interrumpir) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    utterance.rate = velocidadLectura;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voces = speechSynthesis.getVoices();
    const vozEspanol = voces.find(voz => voz.lang.startsWith('es'));
    if (vozEspanol) {
      utterance.voice = vozEspanol;
    }

    if (prioridad) {
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => speechSynthesis.speak(utterance), 250);
    }

    return utterance;
  };

  // Manejo de teclas para cambiar la velocidad de lectura y tamaño de letra
  useEffect(() => {
    const manejarTeclasVelocidad = (e) => {
      if (e.key === 'ArrowLeft') {
        setVelocidadLectura((prevVelocidad) => {
          const nuevaVelocidad = Math.max(0.5, prevVelocidad - 0.5);
          leerTexto(`Velocidad ajustada a ${nuevaVelocidad}x`, true, true);
          return nuevaVelocidad;
        });
      } else if (e.key === 'ArrowRight') {
        setVelocidadLectura((prevVelocidad) => {
          const nuevaVelocidad = Math.min(2.0, prevVelocidad + 0.5);
          leerTexto(`Velocidad ajustada a ${nuevaVelocidad}x`, true, true);
          return nuevaVelocidad;
        });
      }
    };

    const manejarTeclasTexto = (e) => {
      if (e.ctrlKey) {
        if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          ajustarTamanoLetra('aumentar');
        } else if (e.key === 'k' || e.key === 'K') {
          e.preventDefault();
          ajustarTamanoLetra('reducir');
        }
      }
    };

    window.addEventListener('keydown', manejarTeclasVelocidad);
    window.addEventListener('keydown', manejarTeclasTexto);
    return () => {
      window.removeEventListener('keydown', manejarTeclasVelocidad);
      window.removeEventListener('keydown', manejarTeclasTexto);
    };
  }, []);

  // Aplicar el tamaño de letra dinámicamente
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', tamanoLetra.toString());
  }, [tamanoLetra]);

  useEffect(() => {
    if (estaLeyendo) {
      leerTexto(noticias[noticiaActual]?.title + '. ' + noticias[noticiaActual]?.description, true);
    }
  }, [velocidadLectura, noticiaActual, estaLeyendo]);

  const leerBienvenida = () => {
    const mensajeBienvenida = `
      Bienvenido al lector de noticias accesible..
      al apretar la letr H puedes escuchar las intrucciones de como podes usar nuestra pagina web
    `;
    leerTexto(mensajeBienvenida, true, true);
  };

  const leerIntrucciones = () => {
    const mensajeBienvenida = `
      Se han cargado ${noticias.length} noticias para tu lectura.
      Para ayudarte a navegar, aquí están las instrucciones:
      Usa la flecha hacia arriba para ir a la noticia anterior.
      Usa la flecha hacia abajo para ir a la siguiente noticia.
      Presiona la barra espaciadora para escuchar la noticia actual o detener la lectura.
      Presiona Enter para abrir el enlace de la noticia en una nueva ventana.
      Presiona la tecla H en cualquier momento para escuchar estas instrucciones nuevamente.
      Presiona la tecla M para silenciar todas las lecturas.
      Presiona la tecla R para repetir la última noticia leída.
      Control más L para aumentar el tamaño de letra.
      Control más K para reducir el tamaño de letra.
      Estás en la primera noticia. Presiona la barra espaciadora para comenzar a escucharla.
    `;
    leerTexto(mensajeBienvenida, true, true);
  };

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const url = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=TU_API_KEY';
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles?.length > 0) {
          setNoticias(data.articles);
          setPaginaCargada(true);
        } else {
          const errorMsg = 'No se pudieron cargar las noticias. Por favor, intente más tarde.';
          setError(errorMsg);
          leerTexto(errorMsg, true, true);
        }
      } catch (error) {
        const errorMsg = 'Hubo un problema al conectar con el servidor. Por favor, verifique su conexión a internet.';
        setError(errorMsg);
        leerTexto(errorMsg, true, true);
      }
    };
    
    leerTexto('Cargando noticias, por favor espere...', true, true);
    fetchNoticias();
  }, []);

  useEffect(() => {
    if (paginaCargada && noticias.length > 0) {
      setTimeout(() => {
        leerBienvenida();
        if (instruccionesRef.current) {
          instruccionesRef.current.focus();
        }
      }, 500);
    }
  }, [paginaCargada, noticias.length]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          navegarNoticias('siguiente');
          break;
        case 'ArrowUp':
          e.preventDefault();
          navegarNoticias('anterior');
          break;
        case ' ':
          e.preventDefault();
          toggleLectura();
          break;
        case 'Enter':
          e.preventDefault();
          abrirNoticia();
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          leerIntrucciones();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          speechSynthesis.cancel();
          leerTexto('Lectura detenida', true, true);
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          repetirNoticia();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [noticiaActual, noticias]);

  const navegarNoticias = (direccion) => {
    setEstaLeyendo(false);
    let nuevaNoticia = noticiaActual;
    
    if (direccion === 'siguiente' && noticiaActual < noticias.length - 1) {
      nuevaNoticia = noticiaActual + 1;
    } else if (direccion === 'anterior' && noticiaActual > 0) {
      nuevaNoticia = noticiaActual - 1;
    } else {
      const mensaje = direccion === 'siguiente' 
        ? 'Has llegado a la última noticia' 
        : 'Has llegado a la primera noticia';
      leerTexto(mensaje, true, true);
      return;
    }

    setNoticiaActual(nuevaNoticia);
    const mensaje = `Noticia ${nuevaNoticia + 1} de ${noticias.length}. ${noticias[nuevaNoticia].title}`;
    leerTexto(mensaje, true, true);
  };

  const repetirNoticia = () => {
    const noticia = noticias[noticiaActual];
    if (noticia) {
      const texto = `Repitiendo noticia ${noticiaActual + 1} de ${noticias.length}. ${noticia.title}. ${noticia.description || ''}`;
      leerTexto(texto, true, true);
    }
  };

  useEffect(() => {
    if (noticiaRefs.current[noticiaActual]) {
      noticiaRefs.current[noticiaActual].focus();
      noticiaRefs.current[noticiaActual].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [noticiaActual]);

  const toggleLectura = () => {
    setEstaLeyendo(!estaLeyendo);
    const noticia = noticias[noticiaActual];
    if (!estaLeyendo && noticia) {
      const texto = `${noticia.title}. ${noticia.description || ''}`;
      leerTexto(texto, true, true);
    } else {
      speechSynthesis.cancel();
      leerTexto('Lectura pausada', true, true);
    }
  };

  const abrirNoticia = () => {
    const noticia = noticias[noticiaActual];
    if (noticia && noticia.url) {
      window.open(noticia.url, '_blank');
      leerTexto('Abriendo noticia en una nueva ventana. Puedes volver a esta página con Alt + Tab.');
    }
  };

  return (
    <main className="noticias-container" role="main" style={{ fontSize: `${tamanoLetra}rem` }}>
      <h1 tabIndex="0">Lector de Noticias Accesible</h1>

      {error && (
        <div className="error-container" role="alert" aria-live="assertive">
          <p className="error">{error}</p>
        </div>
      )}

      <div 
        ref={instruccionesRef}
        className="instrucciones" 
        role="region" 
        aria-label="Instrucciones de navegación"
        tabIndex="0"
      >
        <h2>Instrucciones de Navegación</h2>
        <ul>
          <li>Flechas ↑↓: Navegar entre noticias</li>
          <li>Flechas ←→: Cambiar velocidad de lectura</li>
          <li>ESPACIO: Leer/pausar noticia actual</li>
          <li>ENTER: Abrir enlace de la noticia</li>
          <li>H: Escuchar instrucciones</li>
          <li>M: Silenciar todas las lecturas</li>
          <li>R: Repetir última noticia</li>
          <li>Control + L: Aumentar tamaño de letra</li>
          <li>Control + K: Reducir tamaño de letra</li>
        </ul>
        <p>Total de noticias disponibles: {noticias.length}</p>
        <p>Tamaño de letra actual: {(tamanoLetra * 100).toFixed(0)}%</p>
      </div>

      {noticias.length > 0 ? (
        <section role="feed" aria-label="Lista de noticias" className="noticias-lista">
          {noticias.map((article, index) => (
            <article
              key={index}
              ref={el => noticiaRefs.current[index] = el}
              className={`noticia ${index === noticiaActual ? 'noticia-activa' : ''}`}
              role="article"
              aria-selected={index === noticiaActual}
              tabIndex={index === noticiaActual ? 0 : -1}
              aria-label={`Noticia ${index + 1} de ${noticias.length}`}
            >
              {article.urlToImage && (
                <img 
                  src={article.urlToImage} 
                  alt={article.title}
                  className="noticia-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.alt = 'Error al cargar la imagen';
                  }}
                />
              )}
              <h2>{article.title}</h2>
              <p>{article.description}</p>
              <div className="noticia-meta">
                <p className="noticia-fecha">{new Date(article.publishedAt).toLocaleDateString('es-ES')}</p>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="noticia-enlace"
                  aria-label={`Leer más sobre: ${article.title}`}
                >
                  Leer artículo completo
                </a>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <p role="status" aria-live="polite">Cargando noticias...</p>
      )}
    </main>
  );
};

export default Noticias;

/*Se han cargado ${noticias.length} noticias para tu lectura.
Para ayudarte a navegar, aquí están las instrucciones:
Usa la flecha hacia arriba para ir a la noticia anterior.
Usa la flecha hacia abajo para ir a la siguiente noticia.
Presiona la barra espaciadora para escuchar la noticia actual o detener la lectura.
Presiona Enter para abrir el enlace de la noticia en una nueva ventana.
Presiona la tecla H en cualquier momento para escuchar estas instrucciones nuevamente.
Presiona la tecla M para silenciar todas las lecturas.
Presiona la tecla R para repetir la última noticia leída.
Control más L para aumentar el tamaño de letra.
Control más K para reducir el tamaño de letra.
Estás en la primera noticia. Presiona la barra espaciadora para comenzar a escucharla.*/