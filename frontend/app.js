const API_URL = "http://localhost:3000/contactos";

const nombre = document.getElementById("nombre");
const telefono = document.getElementById("telefono");
const correo = document.getElementById("correo");
const foto = document.getElementById("foto");
const lista = document.getElementById("listaContactos");
const agregarBtn = document.getElementById("agregarBtn");

async function cargarContactos() {
  lista.innerHTML = "";
  const res = await fetch(API_URL);
  const contactos = await res.json();

  contactos.forEach(c => {
    const div = document.createElement("div");
    div.className = "contacto";
    div.innerHTML = `
      <div class="contacto-info">
        <img src="http://localhost:3000${c.foto || '/uploads/default.png'}" alt="foto" />
        <div>
          <strong>${c.nombre}</strong><br/>
          ${c.telefono} - ${c.correo}
        </div>
      </div>
      <button class="eliminar" onclick="eliminarContacto(${c.id})">X</button>
    `;
    lista.appendChild(div);
  });
}

agregarBtn.addEventListener("click", async () => {
  if (!nombre.value || !telefono.value || !correo.value) {
    alert("Completa todos los campos obligatorios");
    return;
  }

  const formData = new FormData();
  formData.append("nombre", nombre.value);
  formData.append("telefono", telefono.value);
  formData.append("correo", correo.value);
  if (foto.files[0]) formData.append("foto", foto.files[0]);

  await fetch(API_URL, {
    method: "POST",
    body: formData
  });

  nombre.value = telefono.value = correo.value = "";
  foto.value = "";
  cargarContactos();
});

async function eliminarContacto(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  cargarContactos();
}

cargarContactos();
