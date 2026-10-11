// ================================
// MIS HORAS DE TRABAJO - APP COMPLETA
// ================================
//
// ÍNDICE:
//   1. Utilidades (conversión de horas, fechas, etc.)
//   2. Sistema de modales (reemplaza alert/confirm)
//   3. Estado y elementos del DOM
//   4. Tabla de registros
//   5. Formulario (agregar/editar)
//   6. Entrada/Salida (reloj)
//   7. Filtro por mes
//   8. Copia de seguridad (exportar/importar)
//   9. Exportar a Excel
//  10. Modo oscuro/claro
//  11. Multi-trabajo (selección de empresa)
//  12. Inicialización
//
// ================================


// ================================
// 1. UTILIDADES
// ================================

// Sistema de idiomas
const Traducciones = {
    es: {
        titulo: "📋 Mis Horas de Trabajo",
        labelFecha: "Fecha",
        labelHoras: "Horas trabajadas",
        labelPago: "Pago por hora (€)",
        labelTrabajo: "🏢 Trabajo",
        placeholderHoras: "Ej: 8:30",
        placeholderPago: "Ej: 10",
        todosTrabajos: "Todos los trabajos",
        todosMeses: "Todos los meses",
        botonAgregar: "➕ Agregar",
        botonGuardar: "💾 Guardar cambios",
        botonEntrada: "⏰ Entrada",
        botonSalida: "🛑 Salida",
        estadoRelojOff: "No has fichado hoy",
        botonCopia: "💾 Descargar copia de seguridad",
        botonRestaurar: "📂 Restaurar copia",
        botonExcel: "📊 Exportar a Excel",
        resumenHoras: "⏱️ Horas trabajadas",
        resumenDinero: "💰 Dinero ganado",
        resumenDias: "📅 Días trabajados",
        filtroMes: "📅 Mostrar mes:",
        colDia: "Día",
        colFecha: "Fecha",
        colTrabajo: "Trabajo",
        colHoras: "Horas",
        colPago: "Pago/hora",
        colTotal: "Total",
        colAcciones: "Acciones",
        btnEditar: "✏️ Editar",
        btnEliminar: "🗑️ Eliminar",
        // Días
        dias: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        // Meses
        meses: ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        // Mensajes
        msgEditando: "✏️ Estás editando un registro",
        msgAgregado: "✅ Registro agregado",
        msgActualizado: "✅ Registro actualizado",
        msgSinAlmacen: "Tu navegador no soporta almacenamiento local. La app no funcionará correctamente.",
        msgNoGuardar: "No se pudieron guardar los registros.",
        // Validaciones
        valFecha: "Debes seleccionar una fecha.",
        valHoras: "Debes introducir las horas trabajadas.",
        valPago: "Debes introducir el pago por hora.",
        valHorasInvalida: "Las horas deben ser un número válido, por ejemplo 8 o 8:30.",
        valPagoInvalido: "El pago por hora no es válido.",
        valEmpresaRequerida: "Selecciona una empresa existente o crea una nueva con el botón ➕ antes de agregar el registro.",
        valEmpresaEditando: "Selecciona una empresa para guardar los cambios. Si no tienes ninguna, créala con el botón ➕.",
        valDuplicada: "Ya existe un registro para esa fecha y empresa.",
        // Eliminar
        elimConfirmar: "¿Seguro que quieres eliminar este registro?",
        // Reloj
        relojSinEmpresa: "Debes seleccionar una empresa/trabajo antes de fichar entrada o salida.",
        relojInicio: "🌅 ¡Has comenzado tu jornada laboral! Entrada registrada a las ",
        relojFin: "✅ Salida registrada: ",
        relojFin2: "🌙 ¡ooo que no sea un adios definitivo! Salida registrada: ",
        relojTrabajando: "Trabajando desde las ",
        relojLlevas: " (llevas ",
        relojCorto: "Has trabajado menos de 1 minuto. No se registrará.",
        relojPagoNecesario: "Introduce tu pago por hora en el formulario para calcular el total.",
        relojDuplicado: "Ya existe un registro para hoy. ¿Quieres añadir estas horas igualmente?",
        // Copia
        copiaConfirmar: "¿Quieres restaurar esta copia? Los registros actuales serán reemplazados.",
        copiaInvalida: "La copia no es válida o contiene datos incorrectos.",
        copiaRestaurada: "Copia restaurada correctamente.",
        copiaError: "No se pudo leer la copia.",
        // Excel
        excelSinDatos: "No hay registros para exportar.",
        excelSinEmpresa: "No hay registros para la empresa '",
        excelTotalHoras: "TOTAL HORAS:",
        excelTotalGeneral: "TOTAL GENERAL:",
        // Trabajos
        nuevoTrabajoTitulo: "Nuevo trabajo",
        nuevoTrabajoMsg: "Escribe el nombre del nuevo trabajo o empresa:",
        nuevoTrabajoPlaceholder: "Ej: Oficina, Reparto, Clases...",
        nuevoTrabajoBtn: "Añadir",
        nuevoTrabajoVacio: "El nombre no puede estar vacío.",
        nuevoTrabajoDuplicado: "Ya existe un trabajo con ese nombre.",
        nuevoTrabajoOk: "✅ Trabajo '",
        nuevoTrabajoAdd: "' añadido",
        asignarTitulo: "Asignar registros",
        asignarMsg: "¿Asignar ",
        asignarMsg2: " registro(s) a '",
        asignarMsg3: "'?",
        asignarSinSel: "Selecciona primero un trabajo para asignar los registros.",
        asignarSinDatos: "No hay registros sin asignar.",
        asignarOk: " registro(s) asignados a '",
        eliminarTitulo: "Eliminar trabajo",
        eliminarMsg: "¿Seguro que quieres eliminar '",
        eliminarMsg2: "'? Se eliminarán todos sus registros.",
        eliminarSinSel: "Selecciona un trabajo para eliminar.",
        eliminarOk: "🗑️ Trabajo '",
        eliminarOk2: "' eliminado",
        // Botones modal
        btnSi: "Sí",
        btnNo: "No",
        btnAceptar: "Aceptar",
        btnCancelar: "Cancelar"
    },
    en: {
        titulo: "📋 My Work Hours",
        labelFecha: "Date",
        labelHoras: "Hours worked",
        labelPago: "Pay per hour (€)",
        labelTrabajo: "🏢 Company",
        placeholderHoras: "Ex: 8:30",
        placeholderPago: "Ex: 10",
        todosTrabajos: "All companies",
        todosMeses: "All months",
        botonAgregar: "➕ Add",
        botonGuardar: "💾 Save changes",
        botonEntrada: "⏰ Clock in",
        botonSalida: "🛑 Clock out",
        estadoRelojOff: "You haven't clocked in today",
        botonCopia: "💾 Download backup",
        botonRestaurar: "📂 Restore backup",
        botonExcel: "📊 Export to Excel",
        resumenHoras: "⏱️ Hours worked",
        resumenDinero: "💰 Money earned",
        resumenDias: "📅 Days worked",
        filtroMes: "📅 Show month:",
        colDia: "Day",
        colFecha: "Date",
        colTrabajo: "Company",
        colHoras: "Hours",
        colPago: "Pay/hour",
        colTotal: "Total",
        colAcciones: "Actions",
        btnEditar: "✏️ Edit",
        btnEliminar: "🗑️ Delete",
        dias: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        meses: ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        msgEditando: "✏️ You are editing a record",
        msgAgregado: "✅ Record added",
        msgActualizado: "✅ Record updated",
        msgSinAlmacen: "Your browser doesn't support local storage. The app won't work correctly.",
        msgNoGuardar: "Could not save records.",
        valFecha: "You must select a date.",
        valHoras: "You must enter the hours worked.",
        valPago: "You must enter the pay per hour.",
        valHorasInvalida: "Hours must be a valid number, for example 8 or 8:30.",
        valPagoInvalido: "The pay per hour is not valid.",
        valEmpresaRequerida: "Select an existing company or create a new one with the ➕ button before adding the record.",
        valEmpresaEditando: "Select a company to save changes. If you don't have one, create it with the ➕ button.",
        valDuplicada: "A record already exists for that date and company.",
        elimConfirmar: "Are you sure you want to delete this record?",
        relojSinEmpresa: "You must select a company before clocking in or out.",
        relojInicio: "🌅 Your workday has started! Clock in registered at ",
        relojFin: "✅ Clock out registered: ",
        relojFin2: "🌙 Don't make it a final goodbye! Clock out registered: ",
        relojTrabajando: "Working since ",
        relojLlevas: " (elapsed ",
        relojCorto: "You worked less than 1 minute. It won't be registered.",
        relojPagoNecesario: "Enter your pay per hour in the form to calculate the total.",
        relojDuplicado: "A record already exists for today. Do you want to add these hours anyway?",
        copiaConfirmar: "Do you want to restore this backup? Current records will be replaced.",
        copiaInvalida: "The backup is not valid or contains incorrect data.",
        copiaRestaurada: "Backup restored successfully.",
        copiaError: "Could not read the backup.",
        excelSinDatos: "No records to export.",
        excelSinEmpresa: "No records for company '",
        excelTotalHoras: "TOTAL HOURS:",
        excelTotalGeneral: "TOTAL GENERAL:",
        nuevoTrabajoTitulo: "New company",
        nuevoTrabajoMsg: "Enter the name of the new company:",
        nuevoTrabajoPlaceholder: "Ex: Office, Delivery, Classes...",
        nuevoTrabajoBtn: "Add",
        nuevoTrabajoVacio: "The name cannot be empty.",
        nuevoTrabajoDuplicado: "A company with that name already exists.",
        nuevoTrabajoOk: "✅ Company '",
        nuevoTrabajoAdd: "' added",
        asignarTitulo: "Assign records",
        asignarMsg: "Assign ",
        asignarMsg2: " record(s) to '",
        asignarMsg3: "'?",
        asignarSinSel: "Select a company first to assign records.",
        asignarSinDatos: "There are no unassigned records.",
        asignarOk: " record(s) assigned to '",
        eliminarTitulo: "Delete company",
        eliminarMsg: "Are you sure you want to delete '",
        eliminarMsg2: "'? All its records will be deleted.",
        eliminarSinSel: "Select a company to delete.",
        eliminarOk: "🗑️ Company '",
        eliminarOk2: "' deleted",
        btnSi: "Yes",
        btnNo: "No",
        btnAceptar: "Accept",
        btnCancelar: "Cancel"
    }
};

let idiomaActual = localStorage.getItem("idioma") || "es";

function t(clave) {
    const traduccion = Traducciones[idiomaActual][clave];
    if (traduccion === undefined) {
        console.warn("Falta traducción:", clave);
        return clave;
    }
    return traduccion;
}


const Utilidades = {
    convertirHoras(horasTexto) {
        horasTexto = String(horasTexto).trim();

        if (horasTexto.includes(":")) {
            const partes = horasTexto.split(":");
            if (partes.length !== 2) return NaN;

            const horas = Number(partes[0]);
            const minutos = Number(partes[1]);

            if (isNaN(horas) || isNaN(minutos)) return NaN;
            if (horas < 0) return NaN;
            if (minutos < 0 || minutos >= 60) return NaN;

            return horas + (minutos / 60);
        }

        const horas = Number(horasTexto);
        if (isNaN(horas) || horas < 0) return NaN;
        return horas;
    },

    convertirAMinutos(horasTexto) {
        const horas = this.convertirHoras(horasTexto);
        if (isNaN(horas)) return NaN;
        return Math.round(horas * 60);
    },

    formatoHoras(minutos) {
        const horas = Math.floor(minutos / 60);
        const minutosRestantes = minutos % 60;
        return horas + ":" + String(minutosRestantes).padStart(2, "0");
    },

    obtenerNombreDia(fecha) {
        const partes = fecha.split("-");
        const fechaObjeto = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
        return t("dias")[fechaObjeto.getDay()];
    },

    fechaValida(fecha) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
        const partes = fecha.split("-");
        const año = Number(partes[0]);
        const mes = Number(partes[1]);
        const dia = Number(partes[2]);
        const fechaObjeto = new Date(año, mes - 1, dia);
        return fechaObjeto.getFullYear() === año && fechaObjeto.getMonth() === mes - 1 && fechaObjeto.getDate() === dia;
    },

    localStorageDisponible() {
        try {
            const test = "__test__";
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }
};


// ================================
// 2. SISTEMA DE MODALES
// ================================

const Modal = {
    contenedor: null,
    modal: null,
    titulo: null,
    mensaje: null,
    input: null,
    botonAceptar: null,
    botonCancelar: null,
    callbackAceptar: null,
    callbackCancelar: null,

    init() {
        this.contenedor = document.createElement("div");
        this.contenedor.className = "modal-overlay";
        this.contenedor.style.display = "none";

        this.modal = document.createElement("div");
        this.modal.className = "modal";

        this.titulo = document.createElement("h3");
        this.titulo.className = "modal-titulo";

        this.mensaje = document.createElement("p");
        this.mensaje.className = "modal-mensaje";

        this.input = document.createElement("input");
        this.input.className = "modal-input";
        this.input.type = "text";
        this.input.style.display = "none";

        const botones = document.createElement("div");
        botones.className = "modal-botones";

        this.botonCancelar = document.createElement("button");
        this.botonCancelar.className = "modal-boton modal-boton-cancelar";
        this.botonCancelar.textContent = t("btnCancelar");
        this.botonCancelar.setAttribute("aria-label", "Cancelar");

        this.botonAceptar = document.createElement("button");
        this.botonAceptar.className = "modal-boton modal-boton-aceptar";
        this.botonAceptar.textContent = t("btnAceptar");
        this.botonAceptar.setAttribute("aria-label", "Aceptar");

        botones.appendChild(this.botonCancelar);
        botones.appendChild(this.botonAceptar);

        this.modal.appendChild(this.titulo);
        this.modal.appendChild(this.mensaje);
        this.modal.appendChild(this.input);
        this.modal.appendChild(botones);

        this.contenedor.appendChild(this.modal);
        document.body.appendChild(this.contenedor);

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.contenedor.style.display === "flex") {
                this.cerrar();
            }
        });

        this.contenedor.addEventListener("click", (e) => {
            if (e.target === this.contenedor) this.cerrar();
        });

        this.botonAceptar.addEventListener("click", () => {
            if (this.callbackAceptar) this.callbackAceptar(this.input.value);
            this.cerrar();
        });

        this.botonCancelar.addEventListener("click", () => {
            if (this.callbackCancelar) this.callbackCancelar();
            this.cerrar();
        });
    },

    mostrar({ titulo, mensaje, conInput = false, placeholder = "", valorInput = "", textoAceptar = "Aceptar", textoCancelar = "Cancelar", onAceptar = null, onCancelar = null }) {
        this.titulo.textContent = titulo;
        this.mensaje.textContent = mensaje;
        this.botonAceptar.textContent = textoAceptar;
        this.botonCancelar.textContent = textoCancelar;
        this.callbackAceptar = onAceptar;
        this.callbackCancelar = onCancelar;

        if (conInput) {
            this.input.style.display = "block";
            this.input.placeholder = placeholder;
            this.input.value = valorInput;
            setTimeout(() => this.input.focus(), 100);
        } else {
            this.input.style.display = "none";
        }

        this.botonCancelar.style.display = onCancelar ? "inline-block" : "none";
        this.contenedor.style.display = "flex";
    },

    cerrar() {
        this.contenedor.style.display = "none";
        this.callbackAceptar = null;
        this.callbackCancelar = null;
    },

    alert(mensaje, titulo = "Aviso") {
        this.mostrar({ titulo, mensaje, textoAceptar: t("btnAceptar") });
    },

    confirm(mensaje, titulo = "Confirmar", onAceptar = null) {
        this.mostrar({ titulo, mensaje, textoAceptar: t("btnSi"), textoCancelar: t("btnNo"), onAceptar });
    }
};

Modal.init();


// ================================
// 3. ESTADO Y ELEMENTOS DEL DOM
// ================================

if (!Utilidades.localStorageDisponible()) {
    Modal.alert(t("msgSinAlmacen"), "Error");
}

const entradaFecha = document.getElementById("fecha");
const entradaHoras = document.getElementById("horas");
const entradaPago = document.getElementById("pago");
const entradaTrabajo = document.getElementById("trabajo");
const botonAgregar = document.getElementById("botonAgregar");
const tablaRegistros = document.getElementById("tablaRegistros");
const totalGeneral = document.getElementById("totalGeneral");
const totalHoras = document.getElementById("totalHoras");
const totalDias = document.getElementById("totalDias");
const filtroMes = document.getElementById("filtroMes");
const mensaje = document.getElementById("mensaje");

let registros = [];
let registroEditando = null;

try {
    const datosGuardados = JSON.parse(localStorage.getItem("registros"));
    if (Array.isArray(datosGuardados)) registros = datosGuardados;
} catch {
    registros = [];
}

function guardarRegistros() {
    try {
        localStorage.setItem("registros", JSON.stringify(registros));
    } catch {
        Modal.alert("No se pudieron guardar los registros.", "Error");
    }
}


// ================================
// 4. TABLA DE REGISTROS
// ================================

function mostrarRegistros() {
    const mesSeleccionado = filtroMes.value;
    const trabajoSeleccionado = selectTrabajo.value;
    let registrosMostrar = [...registros];

    // Filtrar por trabajo
    if (trabajoSeleccionado !== "") {
        registrosMostrar = registrosMostrar.filter(r => r.trabajo === trabajoSeleccionado);
    }

    if (mesSeleccionado !== "todos") {
        registrosMostrar = registrosMostrar.filter(r => r.fecha.startsWith(mesSeleccionado));
    }

    registrosMostrar.sort((a, b) => b.fecha.localeCompare(a.fecha));

    tablaRegistros.innerHTML = "";

    for (const registro of registrosMostrar) {
        const fila = document.createElement("tr");
        fila.dataset.fecha = registro.fecha;

        const celdaDia = document.createElement("td");
        celdaDia.textContent = Utilidades.obtenerNombreDia(registro.fecha);

        const celdaFecha = document.createElement("td");
        celdaFecha.textContent = registro.fecha;

        const celdaTrabajo = document.createElement("td");
        celdaTrabajo.textContent = registro.trabajo || "—";

        const celdaHoras = document.createElement("td");
        celdaHoras.textContent = registro.horas;

        const celdaPago = document.createElement("td");
        celdaPago.textContent = registro.pago.toFixed(2) + " €";

        const celdaTotal = document.createElement("td");
        celdaTotal.textContent = registro.total.toFixed(2) + " €";

        const celdaAccion = document.createElement("td");

        const botonEditar = document.createElement("button");
        botonEditar.textContent = t("btnEditar");
        botonEditar.className = "boton-editar";
        botonEditar.setAttribute("aria-label", "Editar registro del " + registro.fecha);
        botonEditar.addEventListener("click", () => editarRegistro(registro));

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = t("btnEliminar");
        botonEliminar.className = "boton-eliminar";
        botonEliminar.setAttribute("aria-label", "Eliminar registro del " + registro.fecha);
        botonEliminar.addEventListener("click", () => eliminarRegistro(registro));

        celdaAccion.appendChild(botonEditar);
        celdaAccion.appendChild(botonEliminar);

        fila.appendChild(celdaDia);
        fila.appendChild(celdaFecha);
        fila.appendChild(celdaTrabajo);
        fila.appendChild(celdaHoras);
        fila.appendChild(celdaPago);
        fila.appendChild(celdaTotal);
        fila.appendChild(celdaAccion);

        tablaRegistros.appendChild(fila);
    }

    actualizarResumen();
}

function actualizarResumen() {
    const mesSeleccionado = filtroMes.value;
    const trabajoSeleccionado = selectTrabajo.value;
    let registrosMostrar = registros;

    // Filtrar por trabajo
    if (trabajoSeleccionado !== "") {
        registrosMostrar = registrosMostrar.filter(r => r.trabajo === trabajoSeleccionado);
    }

    if (mesSeleccionado !== "todos") {
        registrosMostrar = registrosMostrar.filter(r => r.fecha.startsWith(mesSeleccionado));
    }

    let minutosTotales = 0;
    let dineroTotal = 0;

    for (const registro of registrosMostrar) {
        const minutos = Utilidades.convertirAMinutos(registro.horas);
        if (!isNaN(minutos)) minutosTotales += minutos;
        dineroTotal += registro.total;
    }

    totalHoras.textContent = Utilidades.formatoHoras(minutosTotales);
    totalGeneral.textContent = dineroTotal.toFixed(2);
    totalDias.textContent = registrosMostrar.length;
}

function eliminarRegistro(registro) {
    Modal.confirm("¿Seguro que quieres eliminar este registro?", "Eliminar registro", () => {
        registros = registros.filter(item => item !== registro);
        guardarRegistros();
        actualizarListaMeses();
        mostrarRegistros();
    });
}

function editarRegistro(registro) {
    entradaFecha.value = registro.fecha;
    entradaHoras.value = registro.horas;
    entradaPago.value = registro.pago;
    registroEditando = registro;
    botonAgregar.textContent = t("botonGuardar");
    mensaje.textContent = t("msgEditando");
    window.scrollTo({ top: 0, behavior: "smooth" });
}


// ================================
// 5. FORMULARIO (AGREGAR/EDITAR)
// ================================

function existeOtraFecha(fecha) {
    const trabajoActual = selectTrabajo.value;
    return registros.some(r =>
        r.fecha === fecha &&
        r !== registroEditando &&
        (r.trabajo || "") === trabajoActual
    );
}

botonAgregar.addEventListener("click", () => {
    const fecha = entradaFecha.value;
    if (fecha === "") { Modal.alert(t("valFecha"), "Campo vacío"); return; }

    const horas = entradaHoras.value.trim();
    if (horas === "") { Modal.alert(t("valHoras"), "Campo vacío"); return; }

    const pago = entradaPago.value;
    if (pago === "") { Modal.alert(t("valPago"), "Campo vacío"); return; }

    const horasDecimales = Utilidades.convertirHoras(horas);
    if (isNaN(horasDecimales)) { Modal.alert(t("valHorasInvalida"), "Horas inválidas"); return; }

    const pagoNumero = Number(pago);
    if (isNaN(pagoNumero) || pagoNumero < 0) { Modal.alert(t("valPagoInvalido"), "Pago inválido"); return; }

    if (selectTrabajo.value === "") {
        if (registroEditando !== null) {
            Modal.alert(t("valEmpresaEditando"), "Empresa requerida");
        } else {
            Modal.alert(t("valEmpresaRequerida"), "Empresa requerida");
        }
        return;
    }

    if (existeOtraFecha(fecha)) { Modal.alert(t("valDuplicada"), "Fecha duplicada"); return; }

    const totalDia = horasDecimales * pagoNumero;

    const trabajo = selectTrabajo.value;

    if (registroEditando !== null) {
        registroEditando.fecha = fecha;
        registroEditando.horas = horas;
        registroEditando.pago = pagoNumero;
        registroEditando.total = totalDia;
        registroEditando.trabajo = trabajo;
        registroEditando = null;
        botonAgregar.textContent = t("botonAgregar");
        mensaje.textContent = t("msgActualizado");
    } else {
        registros.push({ fecha, horas, pago: pagoNumero, total: totalDia, trabajo });
        mensaje.textContent = t("msgAgregado");
    }

    guardarRegistros();
    actualizarListaMeses();
    mostrarRegistros();

    entradaFecha.value = "";
    entradaHoras.value = "";
    entradaPago.value = "";

    setTimeout(() => { mensaje.textContent = ""; }, 2500);
});


// ================================
// 6. ENTRADA / SALIDA (RELOJ)
// ================================

const botonReloj = document.getElementById("botonReloj");
const estadoReloj = document.getElementById("estadoReloj");

let horaEntrada = null;
let trabajando = false;

// Cargar estado del reloj desde localStorage
try {
    const estadoGuardado = JSON.parse(localStorage.getItem("reloj"));
    if (estadoGuardado && estadoGuardado.trabajando) {
        horaEntrada = new Date(estadoGuardado.horaEntrada);
        trabajando = true;
    }
} catch {}

function guardarEstadoReloj() {
    try {
        localStorage.setItem("reloj", JSON.stringify({ trabajando, horaEntrada: horaEntrada ? horaEntrada.toISOString() : null }));
    } catch {}
}

function actualizarBotonReloj() {
    if (trabajando) {
        botonReloj.textContent = t("botonSalida");
        botonReloj.className = "boton-salida";
        const ahora = new Date();
        const diff = Math.floor((ahora - horaEntrada) / 1000);
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        estadoReloj.textContent = t("relojTrabajando") + horaEntrada.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) + t("relojLlevas") + h + "h " + m + "m)";
    } else {
        botonReloj.textContent = t("botonEntrada");
        botonReloj.className = "boton-entrada";
        estadoReloj.textContent = t("estadoRelojOff");
    }
}

botonReloj.addEventListener("click", () => {
    if (selectTrabajo.value === "") {
        Modal.alert(t("relojSinEmpresa"), "Empresa no seleccionada");
        return;
    }

    if (!trabajando) {
        // Fichar entrada
        horaEntrada = new Date();
        trabajando = true;
        guardarEstadoReloj();
        actualizarBotonReloj();
        mensaje.textContent = t("relojInicio") + horaEntrada.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
        setTimeout(() => { mensaje.textContent = ""; }, 2500);
    } else {
        // Fichar salida
        const horaSalida = new Date();
        const diffMs = horaSalida - horaEntrada;
        const diffMinutos = Math.round(diffMs / 60000);

        if (diffMinutos < 1) {
            Modal.alert(t("relojCorto"), "Tiempo muy corto");
            return;
        }

        const horasTexto = Utilidades.formatoHoras(diffMinutos);
        const fechaHoy = horaSalida.toISOString().split("T")[0];

        // Usar el pago por hora del último registro, o pedirlo
        const pagoUltimo = registros.length > 0 ? registros[registros.length - 1].pago : 0;
        const pagoNumero = Number(entradaPago.value) || pagoUltimo;

        if (pagoNumero <= 0) {
            Modal.alert(t("relojPagoNecesario"), "Pago necesario");
            return;
        }

        const totalDia = (diffMinutos / 60) * pagoNumero;

        // Verificar si ya existe registro para hoy
        const trabajoActual = selectTrabajo.value;

        if (existeOtraFecha(fechaHoy)) {
            Modal.confirm(t("relojDuplicado"), "Registro duplicado", () => {
                registros.push({ fecha: fechaHoy, horas: horasTexto, pago: pagoNumero, total: totalDia, trabajo: trabajoActual });
                guardarRegistros();
                actualizarListaMeses();
                actualizarListaTrabajos();
                mostrarRegistros();
                mensaje.textContent = t("relojFin2") + horasTexto + (idiomaActual === "es" ? " trabajadas" : " worked");
                setTimeout(() => { mensaje.textContent = ""; }, 2500);
            });
        } else {
            registros.push({ fecha: fechaHoy, horas: horasTexto, pago: pagoNumero, total: totalDia, trabajo: trabajoActual });
            guardarRegistros();
            actualizarListaMeses();
            actualizarListaTrabajos();
            mostrarRegistros();
            mensaje.textContent = t("relojFin") + horasTexto + (idiomaActual === "es" ? " trabajadas" : " worked");
            setTimeout(() => { mensaje.textContent = ""; }, 2500);
        }

        trabajando = false;
        horaEntrada = null;
        guardarEstadoReloj();
        actualizarBotonReloj();
    }
});

// Actualizar cada minuto si está trabajando
setInterval(() => {
    if (trabajando) actualizarBotonReloj();
}, 60000);

actualizarBotonReloj();


// ================================
// 7. FILTRO POR MES
// ================================

function actualizarListaMeses() {
    const mesActual = filtroMes.value;
    const meses = [];

    for (const registro of registros) {
        const mes = registro.fecha.substring(0, 7);
        if (!meses.includes(mes)) meses.push(mes);
    }

    meses.sort().reverse();
    filtroMes.innerHTML = "";

    const opcionTodos = document.createElement("option");
    opcionTodos.value = "todos";
    opcionTodos.textContent = t("todosMeses");
    filtroMes.appendChild(opcionTodos);

    for (const mes of meses) {
        const opcion = document.createElement("option");
        opcion.value = mes;
        const partes = mes.split("-");
        opcion.textContent = t("meses")[Number(partes[1])] + " " + partes[0];
        filtroMes.appendChild(opcion);
    }

    if (mesActual !== "" && (mesActual === "todos" || meses.includes(mesActual))) {
        filtroMes.value = mesActual;
    }
}

filtroMes.addEventListener("change", () => mostrarRegistros());


// ================================
// 8. COPIA DE SEGURIDAD
// ================================

const botonCopia = document.getElementById("botonCopia");
const botonRestaurar = document.getElementById("botonRestaurar");
const archivoRestaurar = document.getElementById("archivoRestaurar");

function copiaValida(datos) {
    if (!Array.isArray(datos)) return false;
    for (const registro of datos) {
        if (!registro || typeof registro !== "object") return false;
        if (typeof registro.fecha !== "string" || !Utilidades.fechaValida(registro.fecha)) return false;
        if (typeof registro.horas !== "string" || !Number.isFinite(Utilidades.convertirHoras(registro.horas)) || Utilidades.convertirHoras(registro.horas) < 0) return false;
        if (typeof registro.pago !== "number" || !Number.isFinite(registro.pago) || registro.pago < 0) return false;
        if (typeof registro.total !== "number" || !Number.isFinite(registro.total) || registro.total < 0) return false;
        if (registro.trabajo !== undefined && typeof registro.trabajo !== "string") return false;
    }
    return true;
}

botonCopia.addEventListener("click", () => {
    const datos = JSON.stringify(registros, null, 2);
    const archivo = new Blob([datos], { type: "application/json" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = "copia-horas-trabajo.json";
    enlace.click();
    URL.revokeObjectURL(enlace.href);
});

botonRestaurar.addEventListener("click", () => archivoRestaurar.click());

archivoRestaurar.addEventListener("change", () => {
    const archivo = archivoRestaurar.files[0];
    if (!archivo) return;

    Modal.confirm(t("copiaConfirmar"), "Restaurar copia", () => {
        const lector = new FileReader();
        lector.onload = (evento) => {
            try {
                const datos = JSON.parse(evento.target.result);
                if (!copiaValida(datos)) {
                    Modal.alert(t("copiaInvalida"), "Error");
                    return;
                }
                registros = datos;
                guardarRegistros();
                actualizarListaMeses();
                mostrarRegistros();
                Modal.alert(t("copiaRestaurada"), "Éxito");
            } catch {
                Modal.alert(t("copiaError"), "Error");
            }
        };
        lector.readAsText(archivo);
    });

    archivoRestaurar.value = "";
});


// ================================
// 9. EXPORTAR A EXCEL
// ================================

const botonExcel = document.getElementById("botonExcel");

botonExcel.addEventListener("click", () => {
    // Filtrar por empresa seleccionada (si hay alguna)
    const trabajoSeleccionado = selectTrabajo.value;
    let registrosExportar = registros;

    if (trabajoSeleccionado !== "") {
        registrosExportar = registros.filter(r => (r.trabajo || "") === trabajoSeleccionado);
    }

    if (registrosExportar.length === 0) {
        Modal.alert(trabajoSeleccionado !== ""
            ? t("excelSinEmpresa") + trabajoSeleccionado + "'."
            : t("excelSinDatos"), "Sin datos");
        return;
    }

    let totalDinero = 0;
    let totalMinutos = 0;

    registrosExportar.forEach((registro) => {
        totalDinero += Number(registro.total);
        const minutos = Utilidades.convertirAMinutos(registro.horas);
        if (!isNaN(minutos)) totalMinutos += minutos;
    });

    const horasTotales = Math.floor(totalMinutos / 60);
    const minutosRestantes = totalMinutos % 60;
    const totalHoras = horasTotales + ":" + String(minutosRestantes).padStart(2, "0");

    const datosExcel = [];
    datosExcel.push([t("colDia"), t("colFecha"), t("colTrabajo"), t("colHoras"), t("colPago") + " (€)", t("colTotal") + " (€)"]);

    registrosExportar.forEach((registro) => {
        datosExcel.push([
            Utilidades.obtenerNombreDia(registro.fecha),
            registro.fecha,
            registro.trabajo || "",
            registro.horas,
            Number(registro.pago),
            Number(registro.total)
        ]);
    });

    datosExcel.push([]);
    datosExcel.push(["", "", "", t("excelTotalHoras"), totalHoras]);
    datosExcel.push(["", "", "", t("excelTotalGeneral"), totalDinero]);

    const hoja = XLSX.utils.aoa_to_sheet(datosExcel);
    const libro = XLSX.utils.book_new();
    const nombreHoja = trabajoSeleccionado !== "" ? trabajoSeleccionado : "Horas de trabajo";
    XLSX.utils.book_append_sheet(libro, hoja, nombreHoja);

    hoja["!cols"] = [{ wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 20 }, { wch: 18 }];

    for (let fila = 2; fila <= registrosExportar.length + 1; fila++) {
        if (hoja[`D${fila}`]) hoja[`D${fila}`].z = '0.00" €"';
        if (hoja[`E${fila}`]) hoja[`E${fila}`].z = '0.00" €"';
    }

    const filaTotalDinero = registrosExportar.length + 4;
    if (hoja[`E${filaTotalDinero}`]) hoja[`E${filaTotalDinero}`].z = '0.00" €"';

    const nombreArchivo = trabajoSeleccionado !== ""
        ? "horas-" + trabajoSeleccionado.toLowerCase().replace(/\s+/g, "-") + ".xlsx"
        : "horas-de-trabajo.xlsx";

    XLSX.writeFile(libro, nombreArchivo);
});


// ================================
// 10. MODO OSCURO / MODO CLARO
// ================================

const botonTema = document.getElementById("botonTema");

function aplicarTema(tema) {
    if (tema === "oscuro") {
        document.body.classList.add("modo-oscuro");
        botonTema.textContent = "☀️";
    } else {
        document.body.classList.remove("modo-oscuro");
        botonTema.textContent = "🌙";
    }
}

botonTema.addEventListener("click", () => {
    const modoOscuro = document.body.classList.contains("modo-oscuro");
    if (modoOscuro) {
        aplicarTema("claro");
        localStorage.setItem("tema", "claro");
    } else {
        aplicarTema("oscuro");
        localStorage.setItem("tema", "oscuro");
    }
});

const temaGuardado = localStorage.getItem("tema");
if (temaGuardado === "oscuro") {
    aplicarTema("oscuro");
} else {
    aplicarTema("claro");
}


// ================================
// 11. MULTI-TRABAJO (MENÚ DESPLEGABLE)
// ================================

const selectTrabajo = document.getElementById("trabajo");

function actualizarListaTrabajos() {
    const trabajoActual = selectTrabajo.value;
    const trabajos = [];

    for (const registro of registros) {
        if (registro.trabajo && !trabajos.includes(registro.trabajo)) {
            trabajos.push(registro.trabajo);
        }
    }

    trabajos.sort();

    selectTrabajo.innerHTML = "";

    const opcionTodos = document.createElement("option");
    opcionTodos.value = "";
    opcionTodos.textContent = t("todosTrabajos");
    selectTrabajo.appendChild(opcionTodos);

    for (const trabajo of trabajos) {
        const opcion = document.createElement("option");
        opcion.value = trabajo;
        opcion.textContent = trabajo;
        selectTrabajo.appendChild(opcion);
    }

    if (trabajoActual && trabajos.includes(trabajoActual)) {
        selectTrabajo.value = trabajoActual;
    }
}

const empresaActual = document.getElementById("empresaActual");

function actualizarEmpresaActual() {
    const trabajoSeleccionado = selectTrabajo.value;
    if (trabajoSeleccionado === "") {
        empresaActual.textContent = t("todosTrabajos");
    } else {
        empresaActual.textContent = "🏢 " + trabajoSeleccionado;
    }
}

selectTrabajo.addEventListener("change", () => {
    actualizarEmpresaActual();
    mostrarRegistros();
});

const botonNuevoTrabajo = document.getElementById("botonNuevoTrabajo");

botonNuevoTrabajo.addEventListener("click", () => {
    Modal.mostrar({
        titulo: t("nuevoTrabajoTitulo"),
        mensaje: t("nuevoTrabajoMsg"),
        conInput: true,
        placeholder: t("nuevoTrabajoPlaceholder"),
        textoAceptar: t("nuevoTrabajoBtn"),
        onAceptar: (nombre) => {
            const nombreTrim = nombre.trim();
            if (nombreTrim === "") {
                Modal.alert(t("nuevoTrabajoVacio"), "Error");
                return;
            }

            // Verificar si ya existe
            const trabajosExistentes = Array.from(selectTrabajo.options).map(o => o.value.toLowerCase());
            if (trabajosExistentes.includes(nombreTrim.toLowerCase())) {
                Modal.alert(t("nuevoTrabajoDuplicado"), "Nombre duplicado");
                return;
            }

            // Agregar al select y seleccionarlo
            const opcion = document.createElement("option");
            opcion.value = nombreTrim;
            opcion.textContent = nombreTrim;
            selectTrabajo.appendChild(opcion);
            selectTrabajo.value = nombreTrim;
            actualizarEmpresaActual();
            mostrarRegistros();
            mensaje.textContent = t("nuevoTrabajoOk") + nombreTrim + t("nuevoTrabajoAdd");
            setTimeout(() => { mensaje.textContent = ""; }, 2500);
        }
    });
});

// Botón asignar registros sin empresa
const botonAsignarTrabajo = document.getElementById("botonAsignarTrabajo");

botonAsignarTrabajo.addEventListener("click", () => {
    const trabajoSeleccionado = selectTrabajo.value;

    if (trabajoSeleccionado === "") {
        Modal.alert(t("asignarSinSel"), "Sin selección");
        return;
    }

    // Contar registros sin empresa
    const sinEmpresa = registros.filter(r => !r.trabajo || r.trabajo.trim() === "");

    if (sinEmpresa.length === 0) {
        Modal.alert(t("asignarSinDatos"), "Sin datos");
        return;
    }

    Modal.confirm(
        t("asignarMsg") + sinEmpresa.length + t("asignarMsg2") + trabajoSeleccionado + t("asignarMsg3"),
        t("asignarTitulo"),
        () => {
            registros = registros.map(r => {
                if (!r.trabajo || r.trabajo.trim() === "") {
                    r.trabajo = trabajoSeleccionado;
                }
                return r;
            });
            guardarRegistros();
            actualizarListaTrabajos();
            actualizarListaMeses();
            actualizarEmpresaActual();
            mostrarRegistros();
            mensaje.textContent = "✅ " + sinEmpresa.length + t("asignarOk") + trabajoSeleccionado + "'";
            setTimeout(() => { mensaje.textContent = ""; }, 2500);
        }
    );
});

// Botón eliminar trabajo
const botonEliminarTrabajo = document.getElementById("botonEliminarTrabajo");

botonEliminarTrabajo.addEventListener("click", () => {
    const trabajoSeleccionado = selectTrabajo.value;

    if (trabajoSeleccionado === "") {
        Modal.alert(t("eliminarSinSel"), "Sin selección");
        return;
    }

    Modal.confirm(
        t("eliminarMsg") + trabajoSeleccionado + t("eliminarMsg2"),
        t("eliminarTitulo"),
        () => {
            registros = registros.filter(r => {
                const registroTrabajo = (r.trabajo || "").trim().toLowerCase();
                const seleccionado = trabajoSeleccionado.trim().toLowerCase();
                return registroTrabajo !== seleccionado;
            });
            guardarRegistros();
            actualizarListaTrabajos();
            actualizarListaMeses();
            actualizarEmpresaActual();
            mostrarRegistros();
            mensaje.textContent = t("eliminarOk") + trabajoSeleccionado + t("eliminarOk2");
            setTimeout(() => { mensaje.textContent = ""; }, 2500);
        }
    );
});


// ================================
// 12. CAMBIO DE IDIOMA
// ================================

const botonIdioma = document.getElementById("botonIdioma");

function aplicarIdioma() {
    // Actualizar botón de idioma
    botonIdioma.textContent = idiomaActual === "es" ? "🌐 ES" : "🌐 EN";

    // Actualizar atributo lang del HTML
    document.documentElement.lang = idiomaActual;

    // Actualizar título
    document.querySelector("h1").textContent = t("titulo");

    // Actualizar labels del formulario
    document.querySelector('label[for="fecha"]').textContent = t("labelFecha");
    document.querySelector('label[for="horas"]').textContent = t("labelHoras");
    document.querySelector('label[for="pago"]').textContent = t("labelPago");
    document.querySelector('label[for="trabajo"]').textContent = t("labelTrabajo");

    // Placeholders
    document.getElementById("horas").placeholder = t("placeholderHoras");
    document.getElementById("pago").placeholder = t("placeholderPago");

    // Botón agregar
    if (registroEditando === null) {
        botonAgregar.textContent = t("botonAgregar");
    } else {
        botonAgregar.textContent = t("botonGuardar");
    }

    // Botón reloj
    actualizarBotonReloj();

    // Botones de copia y excel
    botonCopia.textContent = t("botonCopia");
    botonRestaurar.textContent = t("botonRestaurar");
    botonExcel.textContent = t("botonExcel");

    // Tarjetas resumen
    document.querySelector(".resumen .tarjeta:nth-child(1) h3").textContent = t("resumenHoras");
    document.querySelector(".resumen .tarjeta:nth-child(2) h3").textContent = t("resumenDinero");
    document.querySelector(".resumen .tarjeta:nth-child(3) h3").textContent = t("resumenDias");

    // Filtro
    document.querySelector('label[for="filtroMes"]').textContent = t("filtroMes");

    // Cabecera tabla
    const ths = document.querySelectorAll("thead th");
    if (ths.length >= 7) {
        ths[0].textContent = t("colDia");
        ths[1].textContent = t("colFecha");
        ths[2].textContent = t("colTrabajo");
        ths[3].textContent = t("colHoras");
        ths[4].textContent = t("colPago");
        ths[5].textContent = t("colTotal");
        ths[6].textContent = t("colAcciones");
    }

    // Regenerar listas dinámicas
    actualizarListaMeses();
    actualizarListaTrabajos();
    actualizarEmpresaActual();
    mostrarRegistros();
}

botonIdioma.addEventListener("click", () => {
    idiomaActual = idiomaActual === "es" ? "en" : "es";
    localStorage.setItem("idioma", idiomaActual);
    aplicarIdioma();
});


// ================================
// 13. INICIALIZACIÓN
// ================================

aplicarIdioma();
actualizarListaMeses();
actualizarListaTrabajos();
actualizarEmpresaActual();
mostrarRegistros();
