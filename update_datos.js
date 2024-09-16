$(document).ready(function() {
    cargarDatosPersonales();

    $('#horas-trabajadas-input, #salario-hora-input').on('input', calcularImpuestos);

    $('#boton-eliminar').click(borrarDatos);
});

function cargarDatosPersonales() {
    var cedula = localStorage.getItem("cedula");
    console.log("Cargando datos para la cédula:", cedula);

    $.ajax({
        url: 'bd.php',
        type: 'GET',
        data: { cedula: cedula },
        dataType: 'json',
        success: function (response) {
            console.log("Respuesta recibida:", response);
            if (response.status === 'success') {
                var datos = response.data;

                // Cargar datos en los campos del formulario
                $('#primer-nombre').val(datos.nombre1);
                $('#segundo-nombre').val(datos.nombre2);
                $('#primer-apellido').val(datos.apellido1);
                $('#segundo-apellido').val(datos.apellido2);
                $('#provincia').val(datos.provincia);
                cargarDistritos(datos.provincia, datos.distrito, datos.corregimiento);
                $('#horas-trabajadas-input').val(datos.htrabajadas);
                $('#salario-hora-input').val(datos.shora);
                $('#deduccion1').val(datos.descuento1);
                $('#deduccion2').val(datos.descuento2);
                $('#deduccion3').val(datos.descuento3);
                $('#desc1').text(datos.descuento1);
                $('#desc2').text(datos.descuento2);
                $('#desc3').text(datos.descuento3);
                $('#sNeto').text(datos.sneto);

                // Llamar a la función de cálculo de impuestos después de cargar los datos
                calcularImpuestos();
            } else {
                alert("No se encontraron datos para la cédula proporcionada.");
            }
        },
        error: function(xhr, status, error) {
            console.log('Error en la solicitud:', error);
            alert("Hubo un problema al cargar los datos. Por favor, inténtelo de nuevo.");
        }
    });
}


function borrarDatos() {
    // Obtener la cédula del almacenamiento local
    var cedula = localStorage.getItem("cedula");

    if (!cedula) {
        alert("No se encontró la cédula para eliminar los datos.");
        return;
    }

    // Confirmar la acción de borrar
    if (confirm("¿Estás seguro de que deseas eliminar los datos de esta cédula? Esta acción no se puede deshacer.")) {
        // Realizar la solicitud AJAX para borrar los datos
        $.ajax({
            url: 'bd.php', // Asegúrate de que esta ruta sea correcta
            type: 'POST',
            data: { action: 'delete', cedula: cedula },
            success: function(response) {
                console.log("Datos eliminados correctamente:", response);
                alert("Datos eliminados correctamente.");
                // Opcional: Redirigir o limpiar los campos del formulario después de eliminar
                window.location.href = "HomePage.html"; // Redirige a la página principal después de eliminar
            },
            error: function(xhr, status, error) {
                console.error("Error al eliminar los datos:", error);
                alert("Hubo un error al eliminar los datos. Por favor, inténtelo de nuevo.");
            }
        });
    }
}

function calcularImpuestos() {
    // Obtener los valores de horas trabajadas y salario por hora
    var horasTrabajadas = parseFloat($('#horas-trabajadas-input').val());
    var salarioHora = parseFloat($('#salario-hora-input').val());

    // Calcular salario bruto
    var salarioBruto = horasTrabajadas * salarioHora;
    $('#sBruto').text(salarioBruto.toFixed(2)); // Mostrar con dos decimales
    
    // Calcular impuestos y descuentos
    var seguroSocial = salarioBruto * 0.0975; // Ejemplo: 9.75% de seguro social
    var seguroEducativo = salarioBruto * 0.0125; // Ejemplo: 1.25% de seguro educativo
    var impuestoRenta = salarioBruto * 0.10; // Ejemplo: 10% de impuesto sobre la renta
    
    // Mostrar impuestos en los campos correspondientes
    $('#sSocial').text(seguroSocial.toFixed(2));
    $('#sEducativo').text(seguroEducativo.toFixed(2));
    $('#iRenta').text(impuestoRenta.toFixed(2));
    
    // Calcular salario neto
    var deduccion1 = parseFloat($('#deduccion1').val()) || 0;
    var deduccion2 = parseFloat($('#deduccion2').val()) || 0;
    var deduccion3 = parseFloat($('#deduccion3').val()) || 0;
    var totalDesc = deduccion1 + deduccion2 + deduccion3;
    $('#descTotal').text(totalDesc.toFixed(2));
    var salarioNeto = salarioBruto - seguroSocial - seguroEducativo - impuestoRenta - deduccion1 - deduccion2 - deduccion3;
    
    $('#sNeto').text(salarioNeto.toFixed(2)); // Mostrar salario neto
}

function limpiarOpciones($select) {
    $select.find('option').not(':first').remove(); // Mantener el primer option (por ejemplo, "Seleccionar...")
}

function cargarProvincias() {
    $.ajax({
        type: 'GET',
        url: 'bd.php',
        success: function (response) {
            var provincias = JSON.parse(response);
            var $selectProvincia = $('#provincia');

            provincias.forEach(function (provincia) {
                var option = $('<option>').val(provincia.codigo).text(provincia.nombre);
                $selectProvincia.append(option);
            });

            // Selecciona la provincia previamente guardada
            var cedula = localStorage.getItem("cedula");
            if (cedula) {
                // Si existe una cédula, carga los datos personales incluyendo la provincia
                cargarDatosPersonales();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error al cargar las provincias: ' + textStatus);
        }
    });
}

function cargarDistritos(codigo_provincia, codigo_distrito = null, codigo_corregimiento = null) {
    $.ajax({
        type: 'GET',
        url: 'bd.php',
        data: { codigo_provincia: codigo_provincia },
        success: function (response) {
            var distritos = JSON.parse(response);
            var $selectDistrito = $('#distrito');

            distritos.forEach(function (distrito) {
                var option = $('<option>').val(distrito.codigo).text(distrito.nombre);
                $selectDistrito.append(option);
            });

            // Si hay un distrito específico guardado, selecciónalo
            if (codigo_distrito) {
                $selectDistrito.val(codigo_distrito);
                cargarCorregimientos(codigo_distrito, codigo_corregimiento); // Carga los corregimientos después de cargar los distritos
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error al cargar los distritos: ' + textStatus);
        }
    });
}

function cargarCorregimientos(codigo_distrito, codigo_corregimiento = null) {
    $.ajax({
        type: 'GET',
        url: 'bd.php',
        data: { codigo_distrito: codigo_distrito },
        success: function (response) {
            var corregimientos = JSON.parse(response);
            var $selectCorregimiento = $('#corregimiento');

            corregimientos.forEach(function (corregimiento) {
                var option = $('<option>').val(corregimiento.codigo).text(corregimiento.nombre);
                $selectCorregimiento.append(option);
            });

            // Si hay un corregimiento específico guardado, selecciónalo
            if (codigo_corregimiento) {
                $selectCorregimiento.val(codigo_corregimiento);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error al cargar los corregimientos: ' + textStatus);
        }
    });
}