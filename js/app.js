/* ===== La Mazorquitaa - Pan de Elote | app.js ===== */
(function () {
  'use strict';

  /* ---------- Datos ---------- */
  var PRODUCTOS = [
    { id: 1, nombre: 'Pan de Elote Tradicional Completo', precio: 240, img: 'imagenes/producto1.jpeg',
      desc: 'Nuestro clásico horneado en molde: miga húmeda, dulce y esponjosa, con granos de elote tierno y un dorado irresistible. Ideal para compartir en familia.' },
    { id: 2, nombre: 'Pan de Elote en Rebanadas Gourmet', precio: 45, img: 'imagenes/producto2.jpeg',
      desc: 'Una rebanada generosa y cremosa, perfecta para el café de la tarde o un antojo individual. Suave por dentro y ligeramente caramelizado por fuera.' },
    { id: 3, nombre: 'Rosca de Elote Artesanal', precio: 280, img: 'imagenes/producto3.jpeg',
      desc: 'Una rosca vistosa con aroma a maíz recién molido y mantequilla. El centro de mesa más rico para tus celebraciones y desayunos especiales.' },
    { id: 4, nombre: 'Tamales Dulces de Elote Tierno', precio: 30, img: 'imagenes/producto4.jpeg',
      desc: 'Tamal de elote tierno envuelto en su hoja, cocido al vapor hasta quedar suave y dulce. El sabor de la tradición mexicana en cada bocado.' },
    { id: 5, nombre: 'Charola de Panquecitos de Elote (6 pzas)', precio: 150, img: 'imagenes/producto5.jpeg',
      desc: 'Seis panquecitos individuales, esponjosos y dorados, con trocitos de elote. Perfectos para fiestas, regalos o para tener en casa toda la semana.' },
    { id: 6, nombre: 'Flan Napolitano de Elote', precio: 260, img: 'imagenes/producto6.jpeg',
      desc: 'Flan cremoso con caramelo y un toque de elote dulce que lo hace único. Textura de seda y sabor casero que enamora desde la primera cucharada.' },
    { id: 7, nombre: 'Galletas Artesanales de Elote (6 pzas)', precio: 85, img: 'imagenes/producto7.jpeg',
      desc: 'Galletas crujientes por fuera y suaves por dentro, con el sabor natural del maíz y un toque de mantequilla. Seis piezas para endulzar tu día.' }
  ];

  var COPY = 'Fotografía oficial © La Mazorquitaa - Todos los derechos reservados';
  var DIAPOSITIVAS = PRODUCTOS.map(function (p) {
    return { img: p.img, titulo: p.nombre, alt: p.nombre, credito: COPY, contener: false };
  }).concat([
    { img: 'imagenes/banner.jpeg', titulo: 'La Mazorquitaa - Pan de Elote', alt: 'Banner de La Mazorquitaa con panquecitos de elote', credito: 'Diseño gráfico © La Mazorquitaa - Todos los derechos reservados', contener: true },
    { img: 'imagenes/logo.jpeg', titulo: 'Nuestra mascota: la Mazorquitaa', alt: 'Logotipo de La Mazorquitaa', credito: 'Logotipo e ilustración © La Mazorquitaa - Marca registrada, todos los derechos reservados', contener: true },
    { img: 'imagenes/producto3.jpeg', titulo: 'Vista destacada: Rosca de Elote para tus celebraciones', alt: 'Vista destacada de la rosca de elote artesanal', credito: 'Fotografía promocional © La Mazorquitaa - Prohibida su reproducción sin autorización', contener: false }
  ]);

  var TEL_WA = '525556112634';
  var CLAVE = 'mazorquitaa_carrito_v1';

  /* ---------- Utilidades ---------- */
  function $(id) { return document.getElementById(id); }
  function dinero(n) {
    return '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MXN';
  }
  function crear(tag, clase, texto) {
    var el = document.createElement(tag);
    if (clase) el.className = clase;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }
  var toastTimer;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('visible'); }, 2400);
  }

  /* ---------- Menú hamburguesa ---------- */
  var nav = $('nav'), ham = $('hamburguesa');
  function cerrarNav() { nav.classList.remove('abierto'); ham.setAttribute('aria-expanded', 'false'); }
  ham.addEventListener('click', function () {
    var abierto = nav.classList.toggle('abierto');
    ham.setAttribute('aria-expanded', String(abierto));
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) cerrarNav(); });
  window.addEventListener('resize', function () { if (window.innerWidth > 960) cerrarNav(); });

  /* Resaltar enlace activo al desplazarse */
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('.nav__enlace[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var mapa = {};
    enlaces.forEach(function (a) { mapa[a.getAttribute('href').slice(1)] = a; });
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting && mapa[en.target.id]) {
          enlaces.forEach(function (a) { a.classList.remove('activo'); });
          mapa[en.target.id].classList.add('activo');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'catalogo', 'nosotros', 'contacto'].forEach(function (id) {
      var s = $(id); if (s) obs.observe(s);
    });
  }

  /* ---------- Carrusel ---------- */
  var pista = $('carruselPista'), puntosBox = $('carruselPuntos');
  var indice = 0, autoplay = null;

  DIAPOSITIVAS.forEach(function (d, i) {
    var fig = crear('figure', 'diapositiva' + (d.contener ? ' diapositiva--contener' : ''));
    fig.setAttribute('role', 'group');
    fig.setAttribute('aria-label', 'Diapositiva ' + (i + 1) + ' de ' + DIAPOSITIVAS.length);
    var img = document.createElement('img');
    img.src = d.img; img.alt = d.alt;
    if (i > 0) img.loading = 'lazy';
    var cap = document.createElement('figcaption');
    cap.appendChild(crear('strong', '', d.titulo));
    cap.appendChild(crear('small', '', d.credito));
    fig.appendChild(img); fig.appendChild(cap);
    pista.appendChild(fig);

    var p = crear('button', 'punto');
    p.type = 'button';
    p.setAttribute('role', 'tab');
    p.setAttribute('aria-label', 'Ir a la diapositiva ' + (i + 1));
    p.addEventListener('click', function () { ir(i); reiniciarAuto(); });
    puntosBox.appendChild(p);
  });

  function ir(n) {
    var total = DIAPOSITIVAS.length;
    indice = (n + total) % total;
    pista.style.transform = 'translateX(-' + (indice * 100) + '%)';
    Array.prototype.forEach.call(puntosBox.children, function (p, i) {
      p.classList.toggle('activo', i === indice);
      p.setAttribute('aria-selected', String(i === indice));
    });
  }
  function iniciarAuto() { detenerAuto(); autoplay = setInterval(function () { ir(indice + 1); }, 4500); }
  function detenerAuto() { if (autoplay) { clearInterval(autoplay); autoplay = null; } }
  function reiniciarAuto() { iniciarAuto(); }

  $('carruselPrev').addEventListener('click', function () { ir(indice - 1); reiniciarAuto(); });
  $('carruselNext').addEventListener('click', function () { ir(indice + 1); reiniciarAuto(); });
  var car = $('carrusel');
  car.addEventListener('mouseenter', detenerAuto);
  car.addEventListener('mouseleave', iniciarAuto);
  car.setAttribute('tabindex', '0');
  car.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { ir(indice - 1); reiniciarAuto(); }
    if (e.key === 'ArrowRight') { ir(indice + 1); reiniciarAuto(); }
  });
  var x0 = null;
  car.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; detenerAuto(); }, { passive: true });
  car.addEventListener('touchend', function (e) {
    if (x0 !== null) {
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) ir(indice + (dx < 0 ? 1 : -1));
      x0 = null;
    }
    iniciarAuto();
  });
  document.addEventListener('visibilitychange', function () { document.hidden ? detenerAuto() : iniciarAuto(); });
  ir(0); iniciarAuto();

  /* ---------- Catálogo ---------- */
  var grid = $('gridProductos');
  PRODUCTOS.forEach(function (p) {
    var card = crear('article', 'tarjeta');
    var img = document.createElement('img');
    img.className = 'tarjeta__img'; img.src = p.img; img.alt = p.nombre; img.loading = 'lazy';
    var cuerpo = crear('div', 'tarjeta__cuerpo');
    cuerpo.appendChild(crear('h3', 'tarjeta__nombre', p.nombre));
    cuerpo.appendChild(crear('p', 'tarjeta__desc', p.desc));
    var pie = crear('div', 'tarjeta__pie');
    var precio = crear('span', 'precio', '$' + p.precio);
    precio.appendChild(crear('small', '', ' MXN'));
    var btn = crear('button', 'btn btn--verde btn--chico', 'Agregar al carrito');
    btn.type = 'button';
    btn.addEventListener('click', function () { agregar(p.id); });
    pie.appendChild(precio); pie.appendChild(btn);
    cuerpo.appendChild(pie);
    card.appendChild(img); card.appendChild(cuerpo);
    grid.appendChild(card);
  });

  /* ---------- Carrito ---------- */
  var carrito = [];   // [{id, cant}]
  try {
    var guardado = JSON.parse(localStorage.getItem(CLAVE) || '[]');
    if (Array.isArray(guardado)) {
      carrito = guardado.filter(function (it) {
        return it && PRODUCTOS.some(function (p) { return p.id === it.id; }) && it.cant > 0;
      }).map(function (it) { return { id: it.id, cant: Math.min(99, Math.floor(it.cant)) }; });
    }
  } catch (e) { carrito = []; }

  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ } }
  function producto(id) { return PRODUCTOS.filter(function (p) { return p.id === id; })[0]; }
  function total() { return carrito.reduce(function (s, it) { return s + producto(it.id).precio * it.cant; }, 0); }
  function cantidadTotal() { return carrito.reduce(function (s, it) { return s + it.cant; }, 0); }

  function agregar(id) {
    var it = carrito.filter(function (c) { return c.id === id; })[0];
    if (it) { it.cant = Math.min(99, it.cant + 1); } else { carrito.push({ id: id, cant: 1 }); }
    cambio();
    var b = $('btnCarrito'); b.classList.remove('rebote'); void b.offsetWidth; b.classList.add('rebote');
    toast('✔ ' + producto(id).nombre + ' agregado');
  }
  function cambiarCant(id, delta) {
    var it = carrito.filter(function (c) { return c.id === id; })[0];
    if (!it) return;
    it.cant += delta;
    if (it.cant <= 0) return eliminar(id);
    it.cant = Math.min(99, it.cant);
    cambio();
  }
  function eliminar(id) { carrito = carrito.filter(function (c) { return c.id !== id; }); cambio(); }
  function vaciar() { carrito = []; cambio(); }
  function cambio() { guardar(); pintarCarrito(); }

  function pintarCarrito() {
    var cont = $('carritoItems');
    cont.textContent = '';
    $('contadorCarrito').textContent = cantidadTotal();
    var vacio = carrito.length === 0;
    $('carritoPie').classList.toggle('vacio', vacio);

    if (vacio) {
      var v = crear('div', 'carrito-vacio');
      v.appendChild(crear('span', '', '🌽'));
      v.appendChild(crear('p', '', 'Tu carrito está vacío. ¡Agrega algo delicioso!'));
      cont.appendChild(v);
    } else {
      carrito.forEach(function (it) {
        var p = producto(it.id);
        var fila = crear('div', 'item');
        var img = document.createElement('img'); img.src = p.img; img.alt = p.nombre;
        var info = crear('div');
        info.appendChild(crear('div', 'item__nombre', p.nombre));
        info.appendChild(crear('div', 'item__precio', dinero(p.precio) + ' c/u'));
        var cant = crear('div', 'item__cantidad');
        var menos = crear('button', '', '−'); menos.type = 'button'; menos.setAttribute('aria-label', 'Quitar una unidad de ' + p.nombre);
        var mas = crear('button', '', '+'); mas.type = 'button'; mas.setAttribute('aria-label', 'Agregar una unidad de ' + p.nombre);
        menos.addEventListener('click', function () { cambiarCant(p.id, -1); });
        mas.addEventListener('click', function () { cambiarCant(p.id, 1); });
        cant.appendChild(menos); cant.appendChild(crear('span', '', String(it.cant))); cant.appendChild(mas);
        info.appendChild(cant);
        var lado = crear('div', 'item__lado');
        lado.appendChild(crear('span', 'item__subtotal', dinero(p.precio * it.cant)));
        var del = crear('button', 'item__eliminar', 'Eliminar'); del.type = 'button';
        del.addEventListener('click', function () { eliminar(p.id); });
        lado.appendChild(del);
        fila.appendChild(img); fila.appendChild(info); fila.appendChild(lado);
        cont.appendChild(fila);
      });
    }
    $('carritoSubtotal').textContent = dinero(total());
    $('carritoTotal').textContent = dinero(total());
    if (!vacio && panelAbierto) prepararPayPal();
  }

  /* Panel lateral */
  var panel = $('panelCarrito'), fondo = $('fondoCarrito'), panelAbierto = false;
  function abrirCarrito() {
    panelAbierto = true;
    panel.classList.add('abierto'); panel.setAttribute('aria-hidden', 'false'); fondo.hidden = false;
    document.body.style.overflow = 'hidden';
    if (carrito.length) prepararPayPal();
    $('cerrarCarrito').focus();
  }
  function cerrarCarrito() {
    panelAbierto = false;
    panel.classList.remove('abierto'); panel.setAttribute('aria-hidden', 'true'); fondo.hidden = true;
    document.body.style.overflow = '';
  }
  $('btnCarrito').addEventListener('click', abrirCarrito);
  $('cerrarCarrito').addEventListener('click', cerrarCarrito);
  fondo.addEventListener('click', cerrarCarrito);
  $('vaciarCarrito').addEventListener('click', function () {
    if (window.confirm('¿Vaciar todo el carrito?')) vaciar();
  });

  /* ---------- PayPal ---------- */
  var paypalEstado = 'inicial'; // inicial | cargando | listo | error | pintado
  function prepararPayPal() {
    var nota = $('paypalNota');
    if (paypalEstado === 'pintado') return;
    if (paypalEstado === 'cargando') return;
    if (paypalEstado === 'error') { nota.textContent = 'No se pudo cargar PayPal. Revisa tu conexión o pide por WhatsApp.'; return; }
    if (window.paypal) { paypalEstado = 'listo'; return pintarPayPal(); }

    paypalEstado = 'cargando';
    nota.textContent = 'Cargando opciones de pago…';
    var s = document.createElement('script');
    s.src = 'https://www.paypal.com/sdk/js?client-id=sb&currency=MXN';
    s.async = true;
    s.onload = function () { paypalEstado = 'listo'; pintarPayPal(); };
    s.onerror = function () {
      paypalEstado = 'error';
      nota.textContent = 'No se pudo cargar PayPal. Revisa tu conexión o pide por WhatsApp.';
    };
    document.head.appendChild(s);
  }

  function pintarPayPal() {
    var nota = $('paypalNota');
    if (!window.paypal || !window.paypal.Buttons || paypalEstado === 'pintado') return;
    var cont = $('paypal-contenedor');
    cont.textContent = '';
    paypalEstado = 'pintado';
    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'paypal' },
      createOrder: function (data, actions) {
        var monto = total();       // se lee al momento del clic: siempre el total actual
        if (monto <= 0) { toast('Tu carrito está vacío'); return Promise.reject(new Error('Carrito vacío')); }
        return actions.order.create({
          purchase_units: [{
            description: 'Pedido La Mazorquitaa - Pan de Elote',
            amount: { currency_code: 'MXN', value: monto.toFixed(2) }
          }]
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (detalles) {
          var nombre = (detalles && detalles.payer && detalles.payer.name && detalles.payer.name.given_name) || '';
          vaciar();
          cerrarCarrito();
          toast('¡Gracias' + (nombre ? ', ' + nombre : '') + '! Pago recibido. Te contactaremos pronto.');
        });
      },
      onCancel: function () { toast('Pago cancelado. Tu carrito sigue guardado.'); },
      onError: function () { toast('Ocurrió un error con PayPal. Intenta de nuevo.'); }
    }).render('#paypal-contenedor').then(function () {
      nota.textContent = 'Pago seguro con PayPal (modo de pruebas). Total en pesos mexicanos (MXN).';
    }).catch(function () {
      paypalEstado = 'error';
      nota.textContent = 'No se pudo mostrar PayPal. Pide por WhatsApp al 55 5611 2634.';
    });
  }

  /* ---------- Modal Aviso de Privacidad ---------- */
  var modal = $('modalPrivacidad'), ultimoFoco = null;
  function abrirPrivacidad() {
    ultimoFoco = document.activeElement;
    modal.hidden = false; document.body.style.overflow = 'hidden';
    $('cerrarPrivacidad').focus();
  }
  function cerrarPrivacidad() {
    modal.hidden = true;
    if (!panelAbierto) document.body.style.overflow = '';
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-abrir-privacidad]');
    if (a) { e.preventDefault(); cerrarNav(); abrirPrivacidad(); }
  });
  $('cerrarPrivacidad').addEventListener('click', cerrarPrivacidad);
  $('aceptarPrivacidad').addEventListener('click', cerrarPrivacidad);
  modal.addEventListener('click', function (e) { if (e.target === modal) cerrarPrivacidad(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) cerrarPrivacidad(); else if (panelAbierto) cerrarCarrito();
  });
  if (location.hash === '#privacidad') abrirPrivacidad();
  window.addEventListener('hashchange', function () { if (location.hash === '#privacidad') abrirPrivacidad(); });

  /* ---------- Formulario de contacto (sin backend: abre WhatsApp / correo) ---------- */
  var form = $('formContacto'), estado = $('formEstado');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nombre = $('fNombre'), correo = $('fCorreo'), tel = $('fTelefono'), msg = $('fMensaje'), ok = $('fAcepto');
    [nombre, correo, msg].forEach(function (c) { c.classList.remove('invalido'); });
    var errores = false;
    if (!nombre.value.trim()) { nombre.classList.add('invalido'); errores = true; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim())) { correo.classList.add('invalido'); errores = true; }
    if (!msg.value.trim()) { msg.classList.add('invalido'); errores = true; }
    if (errores) { estado.className = 'formulario__estado error'; estado.textContent = 'Revisa los campos marcados.'; return; }
    if (!ok.checked) { estado.className = 'formulario__estado error'; estado.textContent = 'Debes aceptar el Aviso de Privacidad.'; return; }

    var texto = 'Hola La Mazorquitaa, soy ' + nombre.value.trim() +
      '.\n' + msg.value.trim() +
      '\n\nCorreo: ' + correo.value.trim() +
      (tel.value.trim() ? '\nTeléfono: ' + tel.value.trim() : '');
    window.open('https://wa.me/' + TEL_WA + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
    estado.className = 'formulario__estado ok';
    estado.textContent = '¡Gracias! Se abrió WhatsApp para enviar tu mensaje. También puedes escribirnos a lamazorquitaa@gmail.com.';
    form.reset();
  });

  /* ---------- Varios ---------- */
  $('anio').textContent = new Date().getFullYear();
  $('privFecha').textContent = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
  pintarCarrito();
})();
