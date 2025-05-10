// Cargar ciudades al iniciar
let ciudades = [];
let rutas = [];
window.onload = async () => {
  const origenSelect = document.getElementById('origen');
  const destinoSelect = document.getElementById('destino');
  
  mostrarCiudades();
  mostrarRutas();
  // Obtener ciudades desde el backend
  const res = await fetch('/api/ciudades');
  const ciudades = await res.json();

  // Llenar selects de origen y destino con ciudades
  ciudades.forEach(c => {
    const option1 = document.createElement('option');
    option1.value = c.id;
    option1.textContent = c.nombre;
    origenSelect.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = c.id;
    option2.textContent = c.nombre;
    destinoSelect.appendChild(option2);
  });

  // Llenar selects para agregar rutas
  ciudades.forEach(c => {
    ['rutaOrigen', 'rutaDestino'].forEach(id => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.nombre;-
      document.getElementById(id).appendChild(opt);
    });
  });
};

// Función para buscar rutas óptimas
async function buscarRutas() {
  const origen = document.getElementById('origen').value;
  const destino = document.getElementById('destino').value;
  const resultado = document.getElementById('resultado');

  if (origen === destino) {
    resultado.innerHTML = '<p>El origen y destino deben ser diferentes.</p>';
    return;
  }

  resultado.innerHTML = 'Buscando rutas...';

  try {
    const res = await fetch(`/api/rutas/optimas?origen=${origen}&destino=${destino}`);
    const data = await res.json();

    if (data.error) {
      resultado.innerHTML = `<p>${data.error}</p>`;
      return;
    }

    resultado.innerHTML = `
      <h3>Origen: ${data.origen}</h3>
      <h3>Destino: ${data.destino}</h3>
      ${data.rutas.map((ruta, i) => `
        <div>
          <strong>Ruta ${i + 1}:</strong> ${ruta.camino.join(' → ')}<br>
          <strong>Distancia:</strong> ${ruta.distancia}
        </div>
        <hr>
      `).join('')}
    `;
  } catch (err) {
    resultado.innerHTML = `<p>Error al buscar rutas.</p>`;
  }
}

// Función para agregar una nueva ciudad
async function agregarCiudad() {
  const nombre = document.getElementById('nuevaCiudad').value.trim();
  if (!nombre) return alert('Ingresa un nombre válido.');

  const res = await fetch('/api/ciudades', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  });

  const data = await res.json();
  if (data.id) {
    alert(`Ciudad "${nombre}" agregada.`);
    location.reload(); // recarga selects
  } else {
    alert(data.error || 'Error al agregar ciudad.');
  }
}

// Función para agregar una nueva ruta
async function agregarRuta() {
  const origenId = document.getElementById('rutaOrigen').value;
  const destinoId = document.getElementById('rutaDestino').value;
  const distancia = parseFloat(document.getElementById('rutaDistancia').value);
  const estado = document.getElementById('rutaEstado').value;

  if (origenId === destinoId) return alert('Origen y destino deben ser diferentes.');
  if (isNaN(distancia) || distancia <= 0) return alert('Distancia inválida.');

  const res = await fetch('/api/rutas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origenId, destinoId, distancia, estado })
  });

  const data = await res.json();
  if (data.id) {
    alert('Ruta agregada con éxito.');
  } else {
    alert(data.error || 'Error al agregar ruta.');
  }
}


async function mostrarCiudades() {
  const res = await fetch('/api/ciudades');
  ciudades = await res.json();  // Guardar las ciudades en la variable global
  const select = document.getElementById('ciudadesList');
  select.innerHTML = ''; // Limpiar el select antes de llenarlo

  ciudades.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;  // Valor del option será el ID de la ciudad
    opt.textContent = c.nombre;  // Nombre visible de la ciudad
    select.appendChild(opt);
  });

  // Si ya hay una ciudad seleccionada, mostrar su nombre en el input
  mostrarNombreCiudad();

}

function mostrarNombreCiudad() {
  const select = document.getElementById('ciudadesList');
  const ciudadId = select.value;  // Obtenemos el ID de la ciudad seleccionada

  if (!ciudadId) return;  // Si no hay ciudad seleccionada, no hacer nada

  // Buscar la ciudad correspondiente en la lista de ciudades 
  const ciudad = ciudades.find(c => c.id == ciudadId);
  
  // Si la ciudad existe, poner su nombre en el input
  if (ciudad) {
    document.getElementById('nombreCiudadActualizar').value = ciudad.nombre;
  } else {
    document.getElementById('nombreCiudadActualizar').value = '';
  }
}

/*function mostrarNombreCiudad() {
  const select = document.getElementById('ciudadesList');
  const ciudadId = select.value;

  if (!ciudadId) return;

  const ciudad = ciudades.find(c => c.id == ciudadId);  // Buscamos la ciudad por su id
  document.getElementById('nombreCiudadActualizar').value = ciudad ? ciudad.nombre : '';
}*/


//acutuzalizar cuidad en el input

async function actualizarCiudad() {
  const select = document.getElementById('ciudadesList');
  const id = select.value;
  const nombre = document.getElementById('nombreCiudadActualizar').value.trim();

  if (!nombre) return alert('Nombre inválido.');

  const res = await fetch(`/api/ciudades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  });

  const data = await res.json();
  alert(data.message || 'Ciudad actualizada');
  location.reload();
}


async function eliminarCiudad() {
  const id = document.getElementById('ciudadesList').value;
  if (!id) return alert('Selecciona una ciudad');

  if (!confirm('¿Eliminar esta ciudad?')) return;

  const res = await fetch(`/api/ciudades/${id}`, { method: 'DELETE' });
  const data = await res.json();
  alert(data.message || 'Ciudad eliminada');

  await mostrarCiudades();
  location.reload(); // opcional si necesitas actualizar más cosas
}

async function cargarCiudadesEnSelects() {
  const res = await fetch('/api/ciudades');
  const ciudades = await res.json();

  const origenSelect = document.getElementById('origenIdSelect');
  const destinoSelect = document.getElementById('destinoIdSelect');
  [origenSelect, destinoSelect].forEach(select => select.innerHTML = '');

  ciudades.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.nombre;
    origenSelect.appendChild(opt.cloneNode(true));
    destinoSelect.appendChild(opt);
  });
}


async function mostrarRutas() {
  await cargarCiudadesEnSelects();

  const res = await fetch('/api/rutas');
  rutas = await res.json();
  
  const select = document.getElementById('rutasList');
  select.innerHTML = '';  // Limpiar opciones anteriores

  rutas.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;  // El ID de la ruta
    opt.textContent = `${r.origen} ➝ ${r.destino}`;  // Mostrar los nombres de las ciudades de origen y destino
    select.appendChild(opt);
  });

  // Si ya hay una ruta seleccionada, mostrar su información
  mostrarNombreRuta();
}
function mostrarNombreRuta() {
  const select = document.getElementById('rutasList');
  const rutaId = select.value;
  const ruta = rutas.find(r => r.id == rutaId);

  if (ruta) {
    document.getElementById('rutaDistanciaActualizar').value = ruta.distancia;
    document.getElementById('rutaEstadoActualizar').value = ruta.estado;

    const origenSelect = document.getElementById('origenIdSelect');
    const destinoSelect = document.getElementById('destinoIdSelect');

    // Buscar el option que coincide con el nombre y seleccionarlo
    [...origenSelect.options].forEach(opt => {
      if (opt.textContent === ruta.origen) origenSelect.value = opt.value;
    });
    [...destinoSelect.options].forEach(opt => {
      if (opt.textContent === ruta.destino) destinoSelect.value = opt.value;
    });
  }
}


async function actualizarRuta() {
  const select = document.getElementById('rutasList');
  const id = select.value;

  const origenId = document.getElementById('origenIdSelect').value;
  const destinoId = document.getElementById('destinoIdSelect').value;
  const distancia = document.getElementById('rutaDistanciaActualizar').value.trim();
  const estado = document.getElementById('rutaEstadoActualizar').value.trim();

  if (!origenId || !destinoId || !distancia || isNaN(distancia)) {
    return alert('Por favor, completa correctamente todos los campos.');
  }

  const res = await fetch(`/api/rutas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      origenId,
      destinoId,
      distancia: parseFloat(distancia),
      estado
    })
  });

  const data = await res.json();

  if (res.ok) {
    alert('Ruta actualizada correctamente');
    mostrarRutas();
  } else {
    alert(`Error: ${data.message || 'Hubo un problema al actualizar la ruta'}`);
  }
}


async function eliminarRuta() {
  const select = document.getElementById('rutasList');
  const id = select.value;

  if (!id) return alert('No se ha seleccionado ninguna ruta.');
  if (!confirm('¿Eliminar esta ruta?')) return;

  const res = await fetch(`/api/rutas/${id}`, { method: 'DELETE' });
  const data = await res.json();

  if (res.ok) {
    alert(data.message || 'Ruta eliminada');
    mostrarRutas();
  } else {
    alert(data.error || 'Error al eliminar la ruta');
  }
}