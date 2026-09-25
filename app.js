const entradaFecha = document.getElementById("fecha");
const entradaHoras = document.getElementById("horas");
const entradaPago = document.getElementById("pago");

const botonAgregar = document.getElementById("botonAgregar");

const tablaRegistros = document.getElementById("tablaRegistros");

const totalGeneral = document.getElementById("totalGeneral");
const totalHoras = document.getElementById("totalHoras");
const totalDias = document.getElementById("totalDias");

const filtroMes = document.getElementById("filtroMes");

const mensaje = document.getElementById("mensaje");


// ================================
// REGISTROS
// ================================

let registros = [];

try {

    const datosGuardados =
        JSON.parse(localStorage.getItem("registros"));

    if (Array.isArray(datosGuardados)) {

        registros = datosGuardados;

    }

} catch (error) {

    registros = [];

}
// Registro que estamos editando
let registroEditando = null;


// ================================
// CONVERTIR HORAS
// ================================

function convertirHoras(horasTexto) {

    horasTexto = String(horasTexto).trim();

    if (horasTexto.includes(":")) {

        const partes = horasTexto.split(":");

        if (partes.length !== 2) {
            return NaN;
        }

        const horas = Number(partes[0]);
        const minutos = Number(partes[1]);

        if (isNaN(horas) || isNaN(minutos)) {
            return NaN;
        }

        if (horas < 0) {
            return NaN;
        }

        if (minutos < 0 || minutos >= 60) {
            return NaN;
        }

        return horas + (minutos / 60);
    }

    const horas = Number(horasTexto);

    if (isNaN(horas) || horas < 0) {
        return NaN;
    }

    return horas;
}


// ================================
// CONVERTIR A MINUTOS
// ================================

function convertirAMinutos(horasTexto) {

    const horas = convertirHoras(horasTexto);

    if (isNaN(horas)) {
        return NaN;
    }

    return Math.round(horas * 60);
}


// ================================
// FORMATO DE HORAS
// ================================

function formatoHoras(minutos) {

    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;

    return (
        horas +
        ":" +
        String(minutosRestantes).padStart(2, "0")
    );
}


// ================================
// NOMBRE DEL DÍA
// ================================

function obtenerNombreDia(fecha) {

    const partes = fecha.split("-");

    const fechaObjeto = new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2])
    );

    const nombresDias = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
    ];

    return nombresDias[fechaObjeto.getDay()];
}


// ================================
// GUARDAR REGISTROS
// ================================

function guardarRegistros() {

    try {

        localStorage.setItem(
            "registros",
            JSON.stringify(registros)
        );

    } catch (error) {

        alert(
            "No se pudieron guardar los registros."
        );

    }
}


// ================================
// ACTUALIZAR RESUMEN
// ================================

function actualizarResumen() {

    const mesSeleccionado = filtroMes.value;

    let registrosMostrar = registros;

    if (mesSeleccionado !== "todos") {

        registrosMostrar = registros.filter(function(registro) {

            return registro.fecha.startsWith(
                mesSeleccionado
            );

        });
    }

    let minutosTotales = 0;
    let dineroTotal = 0;

    for (const registro of registrosMostrar) {

        const minutos = convertirAMinutos(
            registro.horas
        );

        if (!isNaN(minutos)) {
            minutosTotales += minutos;
        }

        dineroTotal += registro.total;
    }

    totalHoras.textContent =
        formatoHoras(minutosTotales);

    totalGeneral.textContent =
        dineroTotal.toFixed(2);

    totalDias.textContent =
        registrosMostrar.length;
}


// ================================
// MOSTRAR REGISTROS
// ================================

function mostrarRegistros() {

    tablaRegistros.innerHTML = "";

    const mesSeleccionado = filtroMes.value;

    let registrosMostrar = [...registros];

    // Filtrar por mes

    if (mesSeleccionado !== "todos") {

        registrosMostrar =
            registrosMostrar.filter(function(registro) {

                return registro.fecha.startsWith(
                    mesSeleccionado
                );

            });
    }

    // Ordenar por fecha
    // Más reciente primero

    registrosMostrar.sort(function(a, b) {

        return b.fecha.localeCompare(a.fecha);

    });

    for (const registro of registrosMostrar) {

        mostrarRegistro(registro);

    }

    actualizarResumen();
}


// ================================
// MOSTRAR UN REGISTRO
// ================================

function mostrarRegistro(registro) {

    const fila = document.createElement("tr");

    const celdaDia =
        document.createElement("td");

    const celdaFecha =
        document.createElement("td");

    const celdaHoras =
        document.createElement("td");

    const celdaPago =
        document.createElement("td");

    const celdaTotal =
        document.createElement("td");

    const celdaAccion =
        document.createElement("td");


    // Día

    celdaDia.textContent =
        obtenerNombreDia(registro.fecha);


    // Fecha

    celdaFecha.textContent =
        registro.fecha;


    // Horas

    celdaHoras.textContent =
        registro.horas;


    // Pago

    celdaPago.textContent =
        registro.pago.toFixed(2) + " €";


    // Total

    celdaTotal.textContent =
        registro.total.toFixed(2) + " €";


    // ================================
    // BOTÓN EDITAR
    // ================================

    const botonEditar =
        document.createElement("button");

    botonEditar.textContent =
        "✏️ Editar";

    botonEditar.className =
        "boton-editar";

    botonEditar.addEventListener(
        "click",
        function() {

            editarRegistro(registro);

        }
    );


    // ================================
    // BOTÓN ELIMINAR
    // ================================

    const botonEliminar =
        document.createElement("button");

    botonEliminar.textContent =
        "🗑️ Eliminar";

    botonEliminar.className =
        "boton-eliminar";

    botonEliminar.addEventListener(
        "click",
        function() {

            eliminarRegistro(registro);

        }
    );


    celdaAccion.appendChild(
        botonEditar
    );

    celdaAccion.appendChild(
        botonEliminar
    );


    // ================================
    // AÑADIR CELDAS
    // ================================

    fila.appendChild(celdaDia);

    fila.appendChild(celdaFecha);

    fila.appendChild(celdaHoras);

    fila.appendChild(celdaPago);

    fila.appendChild(celdaTotal);

    fila.appendChild(celdaAccion);

    tablaRegistros.appendChild(fila);
}


// ================================
// ELIMINAR REGISTRO
// ================================

function eliminarRegistro(registro) {

    const confirmar =
        confirm(
            "¿Seguro que quieres eliminar este registro?"
        );

    if (!confirmar) {
        return;
    }

    registros = registros.filter(
        function(item) {

            return item !== registro;

        }
    );

    guardarRegistros();

    actualizarListaMeses();

    mostrarRegistros();
}


// ================================
// EDITAR REGISTRO
// ================================

function editarRegistro(registro) {

    entradaFecha.value =
        registro.fecha;

    entradaHoras.value =
        registro.horas;

    entradaPago.value =
        registro.pago;

    registroEditando = registro;

    botonAgregar.textContent =
        "💾 Guardar cambios";

    mensaje.textContent =
        "✏️ Estás editando un registro";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ================================
// COMPROBAR FECHA DUPLICADA
// ================================

function existeOtraFecha(fecha) {

    return registros.some(
        function(registro) {

            return (
                registro.fecha === fecha &&
                registro !== registroEditando
            );

        }
    );
}


// ================================
// AGREGAR / EDITAR
// ================================

botonAgregar.addEventListener(
    "click",
    function() {

        const fecha =
            entradaFecha.value;

        if (fecha === "") {

            alert(
                "Debes seleccionar una fecha."
            );

            return;
        }


        const horas =
            entradaHoras.value.trim();

        if (horas === "") {

            alert(
                "Debes introducir las horas trabajadas."
            );

            return;
        }


        const pago =
            entradaPago.value;

        if (pago === "") {

            alert(
                "Debes introducir el pago por hora."
            );

            return;
        }


        // ================================
        // VALIDAR HORAS
        // ================================

        const horasDecimales =
            convertirHoras(horas);

        if (isNaN(horasDecimales)) {

            alert(
                "Las horas deben ser un número válido, por ejemplo 8 o 8:30."
            );

            return;
        }


        // ================================
        // VALIDAR PAGO
        // ================================

        const pagoNumero =
            Number(pago);

        if (
            isNaN(pagoNumero) ||
            pagoNumero < 0
        ) {

            alert(
                "El pago por hora no es válido."
            );

            return;
        }


        // ================================
        // COMPROBAR DUPLICADO
        // ================================

        if (existeOtraFecha(fecha)) {

            alert(
                "Ya existe un registro para esa fecha."
            );

            return;
        }


        // ================================
        // CALCULAR TOTAL
        // ================================

        const totalDia =
            horasDecimales *
            pagoNumero;


        // ================================
        // EDITAR
        // ================================

        if (registroEditando !== null) {

            registroEditando.fecha =
                fecha;

            registroEditando.horas =
                horas;

            registroEditando.pago =
                pagoNumero;

            registroEditando.total =
                totalDia;

            registroEditando =
                null;

            botonAgregar.textContent =
                "➕ Agregar";

            mensaje.textContent =
                "✅ Registro actualizado";
        }


        // ================================
        // NUEVO REGISTRO
        // ================================

        else {

            const registro = {

                fecha: fecha,

                horas: horas,

                pago: pagoNumero,

                total: totalDia
            };

            registros.push(registro);

            mensaje.textContent =
                "✅ Registro agregado";
        }


        // ================================
        // GUARDAR
        // ================================

        guardarRegistros();


        // ================================
        // ACTUALIZAR PÁGINA
        // ================================

        actualizarListaMeses();

        mostrarRegistros();


        // ================================
        // LIMPIAR FORMULARIO
        // ================================

        entradaFecha.value = "";

        entradaHoras.value = "";

        entradaPago.value = "";


        // Quitar mensaje después de un momento

        setTimeout(
            function() {

                mensaje.textContent = "";

            },
            2500
        );

    }
);


// ================================
// CREAR LISTA DE MESES
// ================================

function actualizarListaMeses() {

    const mesActual =
        filtroMes.value;

    const meses = [];

    for (const registro of registros) {

        const mes =
            registro.fecha.substring(
                0,
                7
            );

        if (!meses.includes(mes)) {

            meses.push(mes);

        }
    }


    // Ordenar meses

    meses.sort().reverse();

    filtroMes.innerHTML = "";


    // Opción todos

    const opcionTodos =
        document.createElement("option");

    opcionTodos.value =
        "todos";

    opcionTodos.textContent =
        "Todos los meses";

    filtroMes.appendChild(
        opcionTodos
    );


    // Crear meses

    for (const mes of meses) {

        const opcion =
            document.createElement("option");

        opcion.value =
            mes;

        const partes =
            mes.split("-");

        const año =
            partes[0];

        const numeroMes =
            Number(partes[1]);

        const nombresMeses = [
            "",
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ];

        opcion.textContent =
            nombresMeses[numeroMes] +
            " " +
            año;

        filtroMes.appendChild(
            opcion
        );
    }


    // Intentar conservar selección

    if (
        mesActual !== "" &&
        (
            mesActual === "todos" ||
            meses.includes(mesActual)
        )
    ) {

        filtroMes.value =
            mesActual;
    }
}


// ================================
// CAMBIAR MES
// ================================

filtroMes.addEventListener(
    "change",
    function() {

        mostrarRegistros();

    }
);


// ================================
// INICIAR APP
// ================================

actualizarListaMeses();

mostrarRegistros();


// ===============================
// COPIA DE SEGURIDAD
// ===============================

const botonCopia =
    document.getElementById("botonCopia");

const botonRestaurar =
    document.getElementById("botonRestaurar");

const archivoRestaurar =
    document.getElementById("archivoRestaurar");


// ===============================
// VALIDAR COPIA DE SEGURIDAD
// ===============================

// ===============================
// VALIDAR FECHA
// ===============================

function fechaValida(fecha) {

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return false;
    }

    const partes = fecha.split("-");

    const año = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    const fechaObjeto =
        new Date(año, mes - 1, dia);

    return (
        fechaObjeto.getFullYear() === año &&
        fechaObjeto.getMonth() === mes - 1 &&
        fechaObjeto.getDate() === dia
    );
}


// ===============================
// VALIDAR COPIA DE SEGURIDAD
// ===============================

function copiaValida(datos) {

    if (!Array.isArray(datos)) {
        return false;
    }

    for (const registro of datos) {

        if (
            !registro ||
            typeof registro !== "object"
        ) {
            return false;
        }

        if (
            typeof registro.fecha !== "string" ||
            !fechaValida(registro.fecha)
        ) {
            return false;
        }

        if (
            typeof registro.horas !== "string" ||
            !Number.isFinite(
                convertirHoras(registro.horas)
            ) ||
            convertirHoras(registro.horas) < 0
        ) {
            return false;
        }

        if (
            typeof registro.pago !== "number" ||
            !Number.isFinite(registro.pago) ||
            registro.pago < 0
        ) {
            return false;
        }

        if (
            typeof registro.total !== "number" ||
            !Number.isFinite(registro.total) ||
            registro.total < 0
        ) {
            return false;
        }

    }

    return true;
}


// ===============================
// DESCARGAR COPIA
// ===============================

botonCopia.addEventListener(
    "click",
    function () {

        const datos =
            JSON.stringify(
                registros,
                null,
                2
            );

        const archivo =
            new Blob(
                [datos],
                {
                    type: "application/json"
                }
            );

        const enlace =
            document.createElement("a");

        enlace.href =
            URL.createObjectURL(archivo);

        enlace.download =
            "copia-horas-trabajo.json";

        enlace.click();

        URL.revokeObjectURL(
            enlace.href
        );
    }
);


// ===============================
// BOTÓN RESTAURAR
// ===============================

botonRestaurar.addEventListener(
    "click",
    function () {

        archivoRestaurar.click();

    }
);


// ===============================
// LEER COPIA
// ===============================

archivoRestaurar.addEventListener(
    "change",
    function () {

        const archivo =
            archivoRestaurar.files[0];

        if (!archivo) {
            return;
        }

        const lector =
            new FileReader();

        lector.onload =
            function (evento) {

                try {

                    const datos =
                        JSON.parse(
                            evento.target.result
                        );


                    // ===============================
                    // VALIDAR COPIA
                    // ===============================

                    if (!copiaValida(datos)) {

                        alert(
                            "La copia no es válida o contiene datos incorrectos."
                        );

                        archivoRestaurar.value = "";

                        return;
                    }


                    // ===============================
                    // CONFIRMAR RESTAURACIÓN
                    // ===============================

                    const confirmar =
                        confirm(
                            "¿Quieres restaurar esta copia? Los registros actuales serán reemplazados."
                        );

                    if (!confirmar) {

                        archivoRestaurar.value = "";

                        return;
                    }


                    // ===============================
                    // RESTAURAR
                    // ===============================

                    registros =
                        datos;

                    guardarRegistros();

                    actualizarListaMeses();

                    mostrarRegistros();


                    alert(
                        "Copia restaurada correctamente."
                    );


                } catch (error) {

                    alert(
                        "No se pudo leer la copia."
                    );

                }

                archivoRestaurar.value = "";

            };

        lector.readAsText(archivo);
    }
);  


// ===============================
// EXPORTAR A EXCEL
// ===============================

const botonExcel = document.getElementById("botonExcel");

botonExcel.addEventListener("click", function () {

    if (registros.length === 0) {
        alert("No hay registros para exportar.");
        return;
    }

    // =================================
    // CALCULAR TOTAL DE DINERO
    // =================================

    let totalDinero = 0;

    registros.forEach(function (registro) {
        totalDinero += Number(registro.total);
    });


    // =================================
    // CALCULAR TOTAL DE HORAS
    // =================================

    let totalMinutos = 0;

    registros.forEach(function (registro) {

        const minutos = convertirAMinutos(registro.horas);

        if (!isNaN(minutos)) {
            totalMinutos += minutos;
        }

    });


    const horasTotales = Math.floor(totalMinutos / 60);

    const minutosRestantes = totalMinutos % 60;

    const totalHoras =
        horasTotales +
        ":" +
        String(minutosRestantes).padStart(2, "0");


    // =================================
    // CREAR DATOS PARA EXCEL
    // =================================

    const datosExcel = [];


    // Encabezados

    datosExcel.push([
        "Día",
        "Fecha",
        "Horas",
        "Pago por hora (€)",
        "Total (€)"
    ]);


    // Registros

    registros.forEach(function (registro) {

        datosExcel.push([
            obtenerNombreDia(registro.fecha),
            registro.fecha,
            registro.horas,
            Number(registro.pago),
            Number(registro.total)
        ]);

    });


    // =================================
    // TOTALES
    // =================================

    // Fila vacía

    datosExcel.push([]);


    // Total de horas

    datosExcel.push([
        "",
        "",
        "",
        "TOTAL HORAS:",
        totalHoras
    ]);


    // Total general de dinero

    datosExcel.push([
        "",
        "",
        "",
        "TOTAL GENERAL:",
        totalDinero
    ]);


    // =================================
    // CREAR EXCEL
    // =================================

    const hoja = XLSX.utils.aoa_to_sheet(datosExcel);

    const libro = XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        "Horas de trabajo"
    );


    // =================================
    // ANCHO DE COLUMNAS
    // =================================

    hoja["!cols"] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 20 },
        { wch: 18 }
    ];


    // =================================
    // FORMATO DE DINERO
    // =================================

    for (let fila = 2; fila <= registros.length + 1; fila++) {

        if (hoja[`D${fila}`]) {
            hoja[`D${fila}`].z = '0.00" €"';
        }

        if (hoja[`E${fila}`]) {
            hoja[`E${fila}`].z = '0.00" €"';
        }

    }


    // Formato del total general

    const filaTotalDinero = registros.length + 4;

    if (hoja[`E${filaTotalDinero}`]) {
        hoja[`E${filaTotalDinero}`].z = '0.00" €"';
    }


    // =================================
    // DESCARGAR EXCEL
    // =================================

    XLSX.writeFile(
        libro,
        "horas-de-trabajo.xlsx"
    );

});

// ===============================
// MODO OSCURO / MODO CLARO
// ===============================

const botonTema =
    document.getElementById("botonTema");


// ===============================
// APLICAR TEMA
// ===============================

function aplicarTema(tema) {

    if (tema === "oscuro") {

        document.body.classList.add("modo-oscuro");

        botonTema.textContent = "☀️";

    } else {

        document.body.classList.remove("modo-oscuro");

        botonTema.textContent = "🌙";

    }

}


// ===============================
// CAMBIAR TEMA
// ===============================

botonTema.addEventListener(
    "click",
    function () {

        const modoOscuro =
            document.body.classList.contains(
                "modo-oscuro"
            );

        if (modoOscuro) {

            aplicarTema("claro");

            localStorage.setItem(
                "tema",
                "claro"
            );

        } else {

            aplicarTema("oscuro");

            localStorage.setItem(
                "tema",
                "oscuro"
            );

        }

    }
);


// ===============================
// RECUPERAR TEMA
// ===============================

const temaGuardado =
    localStorage.getItem("tema");

if (temaGuardado === "oscuro") {

    aplicarTema("oscuro");

} else {

    aplicarTema("claro");

}
