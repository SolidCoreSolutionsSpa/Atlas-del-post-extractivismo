

// === PARALLAX SOBRE LA IMAGEN ===
const imagen = document.querySelector('.imagen-mapa');

if (imagen) {
  document.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const offsetX = 0.5 - e.clientX / innerWidth;
    const offsetY = 0.5 - e.clientY / innerHeight;
    const moveX = offsetX * 20;
    const moveY = offsetY * 20;
    imagen.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  document.addEventListener('mouseleave', () => {
    imagen.style.transform = 'translate(0, 0)';
  });
}


// === BOTÓN "VOLVER" DINÁMICO ===
const volver = document.getElementById('volverBtn');
if (volver) {
  const destino = volver.dataset.volver || "index.html";
  volver.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.add('animar-zoom-out');
    setTimeout(() => {
      window.location.href = destino;
    }, 600);
  });
}



// === REDIRECCIONES A OTRAS VISTAS (solo si NO hay ficha) ===
const redirecciones = {
  
  'punto-puerto': 'puertopresente.html',
  'punto-perturbacion': 'perturbacionaerea.html',
  'punto-choapa': 'provinciachoapa.html',
  'punto-jilguero': 'jilguero.html',
  'punto-jote': 'jote.html',
  'punto-bosques': 'eucalipto.html',
  'punto-luminaria': 'luminaria.html',
  'punto-cables':'electricidad.html',
  'punto-diuca':'diuca.html',
  'punto-succión':'succionpordesalacion.html',
};

Object.entries(redirecciones).forEach(([id, url]) => {
 
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener('click', (e) => {
        e.preventDefault();
        const rect = elemento.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        document.body.style.transformOrigin = `${x}px ${y}px`;
        document.body.classList.add('zoom-dirigido');

        setTimeout(() => {
          window.location.href = url;
        }, 600);
      });
    }
  
});

// === PARALLAX TAMBIÉN PARA LOS PUNTOS ===
const puntos = document.querySelectorAll('.punto, .icono-paisaje, .paisaje-parallax, .radar-point');

document.addEventListener('mousemove', (e) => {
  const { innerWidth, innerHeight } = window;
  const offsetX = 0.5 - e.clientX / innerWidth;
  const offsetY = 0.5 - e.clientY / innerHeight;
  const moveX = offsetX * 20;
  const moveY = offsetY * 20;

  if (imagen) {
    imagen.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }

  const puntoOffsetX = offsetX * 10; // movimiento más leve que la imagen
  const puntoOffsetY = offsetY * 10;

  puntos.forEach(p => {
    if (p.classList.contains('radar-point')) {
      // ✅ Para radar-point usamos variables CSS (no pisamos su animación)
      p.style.setProperty('--tx', `${puntoOffsetX}px`);
      p.style.setProperty('--ty', `${puntoOffsetY}px`);
    } else {
      // ✅ Para los demás, transform directo
      p.style.transform = `translate(calc(-50% + ${puntoOffsetX}px), calc(-50% + ${puntoOffsetY}px))`;
    }
  });
});

document.addEventListener('mouseleave', () => {
  if (imagen) imagen.style.transform = 'translate(0, 0)';
  puntos.forEach(p => {
    if (p.classList.contains('radar-point')) {
      p.style.removeProperty('--tx');
      p.style.removeProperty('--ty');
    } else {
      p.style.transform = 'translate(-50%, -50%)';
    }
  });
});

document.querySelectorAll('.breadcrumb-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const url = link.getAttribute('href');

    // Zoom-out desde el centro de la pantalla
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;

    document.body.style.transformOrigin = `${x}px ${y}px`;
    document.body.classList.add('animar-zoom-out');

    setTimeout(() => {
      window.location.href = url;
    }, 600);
  });
});


document.querySelectorAll('.filtro-btn').forEach(btn => {
  const tipo = btn.dataset.tipo;

  btn.addEventListener('mouseenter', () => {
    document.querySelectorAll(`.${tipo}`).forEach(elem => {
      elem.classList.add('mostrar-leyenda');
    });
  });

  btn.addEventListener('mouseleave', () => {
    document.querySelectorAll(`.${tipo}`).forEach(elem => {
      elem.classList.remove('mostrar-leyenda');
    });
  });
});

const descripcion = document.getElementById("descripcionPaisaje");
const titulo = document.getElementById("tituloPaisaje");
const texto = document.getElementById("textoPaisaje");

const descripciones = {
  "punto-biótico": {
    titulo: "Paisajes Bióticos",
    texto: "Transformaciones que impactan seres vivos del ecosistema, como flora, fauna, microorganismos o comunidades más que humanas."
  },
  "punto-antrópico": {
    titulo: "Paisajes Antrópicos",
    texto: "Consecuencias generadas por la intervención humana en el territorio, ya sea por acción directa o indirecta."
  },
  "punto-físico": {
    titulo: "Paisajes Físicos",
    texto: "Transformaciones del suelo y relieve originadas por la acción extractiva sobre el territorio."
  }
};

const contenido = document.getElementById("contenidoDescripcion");

document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener("mouseenter", () => {
    const id = btn.id;
    if (descripciones[id]) {
      contenido.style.opacity = 0;

      setTimeout(() => {
        titulo.textContent = descripciones[id].titulo;
        texto.textContent = descripciones[id].texto;
        descripcion.classList.add("visible");
        contenido.style.opacity = 1;
      }, 150);
    }
  });

  btn.addEventListener("mouseleave", () => {
    descripcion.classList.remove("visible");
    titulo.textContent = "";
    texto.textContent = "";
    contenido.style.opacity = 0;
  });
});

// === PUNTOS RADAR EN INDEX ===
document.querySelectorAll('.radar-point').forEach((punto) => {
  punto.addEventListener('click', (e) => {
    e.preventDefault();
    const url = punto.dataset.url;
    if (!url) return;

    // origen del zoom = centro visual del punto
    const rect = punto.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top  + rect.height / 2;

    document.body.style.transformOrigin = `${x}px ${y}px`;
    document.body.classList.add('zoom-dirigido');

    setTimeout(() => {
      window.location.href = url;
    }, 600);
  });
});

// === HOVER en Choapa: cambiar imagen con crossfade ===
document.addEventListener('DOMContentLoaded', () => {
  const choapaBtn = document.getElementById('choapa-btn');
  const mapImg    = document.querySelector('.imagen-mapa');
  if (!choapaBtn || !mapImg) return;

  const originalSrc = mapImg.getAttribute('src');
  const hoverSrc    = choapaBtn.getAttribute('data-bg');
  if (!hoverSrc) return;

  // Pre-cargar imagen de hover
  const preload = new Image();
  preload.src = hoverSrc;

  let swapping = false; // evita solapamientos

  const swapTo = (nextSrc) => {
    if (swapping || mapImg.src.endsWith(nextSrc)) return;
    swapping = true;

    mapImg.classList.add('is-fading');

    const doSwap = () => {
      mapImg.removeEventListener('transitionend', doSwap);

      const onLoaded = () => {
        // pequeño frame para que el fade-in sea suave
        requestAnimationFrame(() => {
          mapImg.classList.remove('is-fading');
          mapImg.onload = null;
          swapping = false;
        });
      };

      mapImg.onload = onLoaded;
      mapImg.src = nextSrc;
    };

    mapImg.addEventListener('transitionend', doSwap, { once: true });

    // respaldo si no dispara transitionend
    setTimeout(() => {
      if (mapImg.classList.contains('is-fading')) doSwap();
    }, 500);
  };

  choapaBtn.addEventListener('mouseenter', () => swapTo(hoverSrc));
  choapaBtn.addEventListener('mouseleave', () => swapTo(originalSrc));
});

// === FUNCIÓN REUTILIZABLE PARA HOVERS DE LUGARES (actualizada sin ingresarBtn) ===
function configurarHoverLugar({ id, color, texto, descripcion, imagen }) {
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById(id);
    const parrafo = document.querySelector('#contenido p'); // párrafo principal
    const mapImg = document.querySelector('.imagen-mapa');
    const todosLosPuntos = document.querySelectorAll('.radar-point');

    if (!btn || !parrafo || !mapImg) return;

    // Estado original
    const originalParrafo = parrafo.textContent;
    const originalSrc = mapImg.getAttribute('src');

    const hoverParrafo = descripcion;
    const hoverSrc = imagen || btn.getAttribute('data-bg');

    // Precarga imagen
    const preload = new Image();
    preload.src = hoverSrc;

    // Crossfade de imagen
    let swapping = false;
    const sameFile = (a, b) => a.split('/').pop() === b.split('/').pop();
    const swapTo = (nextSrc) => {
      if (swapping || sameFile(mapImg.src, nextSrc)) return;
      swapping = true;
      mapImg.classList.add('is-fading');
      const doSwap = () => {
        mapImg.removeEventListener('transitionend', doSwap);
        mapImg.onload = () => {
          requestAnimationFrame(() => {
            mapImg.classList.remove('is-fading');
            mapImg.onload = null;
            swapping = false;
          });
        };
        mapImg.src = nextSrc;
      };
      mapImg.addEventListener('transitionend', doSwap, { once: true });
      setTimeout(() => { if (mapImg.classList.contains('is-fading')) doSwap(); }, 500);
    };

    // Hover IN / OUT
    const setHover = () => {
      parrafo.textContent = hoverParrafo;
      swapTo(hoverSrc);

      // Oculta los otros puntos
      todosLosPuntos.forEach(p => {
        if (p !== btn) p.classList.add('oculto');
        else p.classList.add('suave');
      });
    };

    const unsetHover = () => {
      parrafo.textContent = originalParrafo;
      swapTo(originalSrc);

      // Restaura los puntos
      todosLosPuntos.forEach(p => p.classList.remove('oculto', 'suave'));
    };

    // Eventos
    btn.addEventListener('mouseenter', setHover);
    btn.addEventListener('mouseleave', unsetHover);
    btn.addEventListener('focus', setHover);
    btn.addEventListener('blur', unsetHover);
  });
}

// === CONFIGURACIÓN DE LUGARES ===
configurarHoverLugar({
  id: 'choapa-btn',
  color: '#d57a00',
  texto: 'PROVINCIA DE CHOAPA, COQUIMBO',
  descripcion: 'La minería en el norte de Chile enfrenta una crisis hídrica que ha llevado una nueva era de plantas desalinizadoras que extraen agua del océano Pacífico, Aunque la desalinización ofrece una propuesta "verde", mira como su sostenimiento puede generar controversias socio-ecológicas.',
  imagen: 'img/mapa-global-de-cobre-T.jpg'
});

configurarHoverLugar({
  id: 'charleroi-btn',
  color: '#1a1a1a',
  texto: 'KOLWEZI – CONGO (PROXIMAMENTE)',
  descripcion: 'En Charleroi, los paisajes postindustriales dialogan con la memoria minera europea y su vínculo con el cobre sudamericano.',
  imagen: 'img/mapa-global-de-carbon-T.jpg'
});
configurarHoverLugar({
  id: 'congo-btn',
  color: '#443ad4ff',
  texto: 'KOLWEZI – CONGO',
  descripcion: 'En las últimas dos decadas, Kowelzi, ciudad minera de la República Democrática del Congo, enfrenta tensiones entre la minería, la degradación ambiental y la rápida urbanización que reconfigura los paisajes como rastros extractivos, minas expuestas, escombreras y sitios abandonados.',
  imagen: 'img/mapa-global-de-cobalto-T.jpg'
});
configurarHoverLugar({
  id: 'indonesia-btn',
  color: '#e4db66ff',
  texto: 'SUMATERA UTARA – INDONESIA',
  descripcion: 'Una de las regiones de aceite de palma más productivas del mundo ha configurado un paisaje de extracción agroindustrial, donde los ciclos de siembra y resiembra desplazan comunidades, reordenan los ecosistemas y consolidan un régimen de monocultivo.',
  imagen: 'img/mapa-global-de-aceite-T.jpg'
});



// === INTERACCIÓN CON EL TEXTO "SELECCIONA UN PUNTO..." PERSONALIZADA ===
document.addEventListener('DOMContentLoaded', () => {
  const instruccion = document.querySelector('.instruccion');
  const puntos = document.querySelectorAll('.radar-point');
  const parrafoOriginal = instruccion.textContent;

  if (!instruccion || puntos.length === 0) return;

  // Configuración personalizada por ID o clase
  const mensajes = {
    'choapa-btn': {
      texto: 'CHOAPA, COQUIMBO, CHILE',
      color: '#d57a00' // naranja
    },
    'charleroi-btn': {
      texto: 'CHARLEROI, BÉLGICA (PROXIMAMENTE)',
      color: '#1a1a1a' // negro
    },
    'congo-btn': {
      texto: 'KOLWEZI – CONGO (PROXIMAMENTE)',
      color: '#382ebeff' // azul
    },
    'indonesia-btn': {
      texto: 'SUMATERA UTARA – INDONESIA (PROXIMAMENTE)',
      color: '#c0b959ff' // azul
    },
    // Si agregas más puntos, los puedes sumar aquí:
    // 'otro-btn': { texto: 'CONGO, ÁFRICA CENTRAL', color: '#1f43e8' }
  };

  puntos.forEach((punto) => {
    const id = punto.id;
    const config = mensajes[id];

    punto.addEventListener('mouseenter', () => {
      if (config) {
        instruccion.textContent = config.texto;
        instruccion.style.color = config.color;
        instruccion.style.transform = 'scale(1.05)';
        instruccion.style.fontWeight = '600';
      } else {
        // Si no está en la lista, usa un texto genérico
        const nombre = punto.getAttribute('aria-label') || 'este territorio';
        instruccion.textContent = `Explora ${nombre}.`;
        instruccion.style.color = '#000';
      }
    });

    punto.addEventListener('mouseleave', () => {
      instruccion.textContent = parrafoOriginal;
      instruccion.style.color = '#555';
      instruccion.style.transform = 'scale(1)';
      instruccion.style.fontWeight = '600';
    });
  });
});