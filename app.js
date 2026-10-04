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
        const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        return nombresDias[fechaObjeto.getDay()];
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
        this.botonCancelar.textContent = "Cancelar";
        this.botonCancelar.setAttribute("aria-label", "Cancelar");

        this.botonAceptar = document.createElement("button");
        this.botonAceptar.className = "modal-boton modal-boton-aceptar";
        this.botonAceptar.textContent = "Aceptar";
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
        this.mostrar({ titulo, mensaje });
    },

    confirm(mensaje, titulo = "Confirmar", onAceptar = null) {
        this.mostrar({ titulo, mensaje, textoAceptar: "Sí", textoCancelar: "No", onAceptar });
    }
};

Modal.init();


// ================================
// 3. ESTADO Y ELEMENTOS DEL DOM
// ================================

if (!Utilidades.localStorageDisponible()) {
    Modal.alert("Tu navegador no soporta almacenamiento local. La app no funcionará correctamente.", "Error");
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
        botonEditar.textContent = "✏️ Editar";
        botonEditar.className = "boton-editar";
        botonEditar.setAttribute("aria-label", "Editar registro del " + registro.fecha);
        botonEditar.addEventListener("click", () => editarRegistro(registro));

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "🗑️ Eliminar";
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
    botonAgregar.textContent = "💾 Guardar cambios";
    mensaje.textContent = "✏️ Estás editando un registro";
    window.scrollTo({ top: 0, behavior: "smooth" });
}


// ================================
// 5. FORMULARIO (AGREGAR/EDITAR)
// ================================

function existeOtraFecha(fecha) {
    return registros.some(r => r.fecha === fecha && r !== registroEditando);
}

botonAgregar.addEventListener("click", () => {
    const fecha = entradaFecha.value;
    if (fecha === "") { Modal.alert("Debes seleccionar una fecha.", "Campo vacío"); return; }

    const horas = entradaHoras.value.trim();
    if (horas === "") { Modal.alert("Debes introducir las horas trabajadas.", "Campo vacío"); return; }

    const pago = entradaPago.value;
    if (pago === "") { Modal.alert("Debes introducir el pago por hora.", "Campo vacío"); return; }

    const horasDecimales = Utilidades.convertirHoras(horas);
    if (isNaN(horasDecimales)) { Modal.alert("Las horas deben ser un número válido, por ejemplo 8 o 8:30.", "Horas inválidas"); return; }

    const pagoNumero = Number(pago);
    if (isNaN(pagoNumero) || pagoNumero < 0) { Modal.alert("El pago por hora no es válido.", "Pago inválido"); return; }

    if (existeOtraFecha(fecha)) { Modal.alert("Ya existe un registro para esa fecha.", "Fecha duplicada"); return; }

    const totalDia = horasDecimales * pagoNumero;

    const trabajo = selectTrabajo.value;

    if (registroEditando !== null) {
        registroEditando.fecha = fecha;
        registroEditando.horas = horas;
        registroEditando.pago = pagoNumero;
        registroEditando.total = totalDia;
        registroEditando.trabajo = trabajo;
        registroEditando = null;
        botonAgregar.textContent = "➕ Agregar";
        mensaje.textContent = "✅ Registro actualizado";
    } else {
        registros.push({ fecha, horas, pago: pagoNumero, total: totalDia, trabajo });
        mensaje.textContent = "✅ Registro agregado";
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
        botonReloj.textContent = "🛑 Salida";
        botonReloj.className = "boton-salida";
        const ahora = new Date();
        const diff = Math.floor((ahora - horaEntrada) / 1000);
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        estadoReloj.textContent = "Trabajando desde las " + horaEntrada.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) + " (llevas " + h + "h " + m + "m)";
    } else {
        botonReloj.textContent = "⏰ Entrada";
        botonReloj.className = "boton-entrada";
        estadoReloj.textContent = "No has fichado hoy";
    }
}

botonReloj.addEventListener("click", () => {
    if (!trabajando) {
        // Fichar entrada
        horaEntrada = new Date();
        trabajando = true;
        guardarEstadoReloj();
        actualizarBotonReloj();
        mensaje.textContent = "🌅 ¡Has comenzado tu jornada laboral! Entrada registrada a las " + horaEntrada.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
        setTimeout(() => { mensaje.textContent = ""; }, 2500);
    } else {
        // Fichar salida
        const horaSalida = new Date();
        const diffMs = horaSalida - horaEntrada;
        const diffMinutos = Math.round(diffMs / 60000);

        if (diffMinutos < 1) {
            Modal.alert("Has trabajado menos de 1 minuto. No se registrará.", "Tiempo muy corto");
            return;
        }

        const horasTexto = Utilidades.formatoHoras(diffMinutos);
        const fechaHoy = horaSalida.toISOString().split("T")[0];

        // Usar el pago por hora del último registro, o pedirlo
        const pagoUltimo = registros.length > 0 ? registros[registros.length - 1].pago : 0;
        const pagoNumero = Number(entradaPago.value) || pagoUltimo;

        if (pagoNumero <= 0) {
            Modal.alert("Introduce tu pago por hora en el formulario para calcular el total.", "Pago necesario");
            return;
        }

        const totalDia = (diffMinutos / 60) * pagoNumero;

        // Verificar si ya existe registro para hoy
        if (existeOtraFecha(fechaHoy)) {
            Modal.confirm("Ya existe un registro para hoy. ¿Quieres añadir estas horas igualmente?", "Registro duplicado", () => {
                registros.push({ fecha: fechaHoy, horas: horasTexto, pago: pagoNumero, total: totalDia });
                guardarRegistros();
                actualizarListaMeses();
                mostrarRegistros();
                mensaje.textContent = "🌙 ¡ooo que no sea un adios definitivo! Salida registrada: " + horasTexto + " trabajadas";
                setTimeout(() => { mensaje.textContent = ""; }, 2500);
            });
        } else {
            registros.push({ fecha: fechaHoy, horas: horasTexto, pago: pagoNumero, total: totalDia });
            guardarRegistros();
            actualizarListaMeses();
            mostrarRegistros();
            mensaje.textContent = "✅ Salida registrada: " + horasTexto + " trabajadas";
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
    opcionTodos.textContent = "Todos los meses";
    filtroMes.appendChild(opcionTodos);

    const nombresMeses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    for (const mes of meses) {
        const opcion = document.createElement("option");
        opcion.value = mes;
        const partes = mes.split("-");
        opcion.textContent = nombresMeses[Number(partes[1])] + " " + partes[0];
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

    Modal.confirm("¿Quieres restaurar esta copia? Los registros actuales serán reemplazados.", "Restaurar copia", () => {
        const lector = new FileReader();
        lector.onload = (evento) => {
            try {
                const datos = JSON.parse(evento.target.result);
                if (!copiaValida(datos)) {
                    Modal.alert("La copia no es válida o contiene datos incorrectos.", "Error");
                    return;
                }
                registros = datos;
                guardarRegistros();
                actualizarListaMeses();
                mostrarRegistros();
                Modal.alert("Copia restaurada correctamente.", "Éxito");
            } catch {
                Modal.alert("No se pudo leer la copia.", "Error");
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
    if (registros.length === 0) { Modal.alert("No hay registros para exportar.", "Sin datos"); return; }

    let totalDinero = 0;
    let totalMinutos = 0;

    registros.forEach((registro) => {
        totalDinero += Number(registro.total);
        const minutos = Utilidades.convertirAMinutos(registro.horas);
        if (!isNaN(minutos)) totalMinutos += minutos;
    });

    const horasTotales = Math.floor(totalMinutos / 60);
    const minutosRestantes = totalMinutos % 60;
    const totalHoras = horasTotales + ":" + String(minutosRestantes).padStart(2, "0");

    const datosExcel = [];
    datosExcel.push(["Día", "Fecha", "Trabajo", "Horas", "Pago por hora (€)", "Total (€)"]);

    registros.forEach((registro) => {
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
    datosExcel.push(["", "", "", "TOTAL HORAS:", totalHoras]);
    datosExcel.push(["", "", "", "TOTAL GENERAL:", totalDinero]);

    const hoja = XLSX.utils.aoa_to_sheet(datosExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Horas de trabajo");

    hoja["!cols"] = [{ wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 20 }, { wch: 18 }];

    for (let fila = 2; fila <= registros.length + 1; fila++) {
        if (hoja[`D${fila}`]) hoja[`D${fila}`].z = '0.00" €"';
        if (hoja[`E${fila}`]) hoja[`E${fila}`].z = '0.00" €"';
    }

    const filaTotalDinero = registros.length + 4;
    if (hoja[`E${filaTotalDinero}`]) hoja[`E${filaTotalDinero}`].z = '0.00" €"';

    XLSX.writeFile(libro, "horas-de-trabajo.xlsx");
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
    opcionTodos.textContent = "Todos los trabajos";
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

selectTrabajo.addEventListener("change", () => mostrarRegistros());

const botonNuevoTrabajo = document.getElementById("botonNuevoTrabajo");

botonNuevoTrabajo.addEventListener("click", () => {
    Modal.mostrar({
        titulo: "Nuevo trabajo",
        mensaje: "Escribe el nombre del nuevo trabajo o empresa:",
        conInput: true,
        placeholder: "Ej: Oficina, Reparto, Clases...",
        textoAceptar: "Añadir",
        onAceptar: (nombre) => {
            const nombreTrim = nombre.trim();
            if (nombreTrim === "") {
                Modal.alert("El nombre no puede estar vacío.", "Error");
                return;
            }
            selectTrabajo.value = nombreTrim;
            actualizarListaTrabajos();
            selectTrabajo.value = nombreTrim;
            mostrarRegistros();
            mensaje.textContent = "✅ Trabajo '" + nombreTrim + "' añadido";
            setTimeout(() => { mensaje.textContent = ""; }, 2500);
        }
    });
});


// ================================
// 12. INICIALIZACIÓN
// ================================

actualizarListaMeses();
actualizarListaTrabajos();
mostrarRegistros();
