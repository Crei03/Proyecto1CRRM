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
                window.location.href = "login.html"; // Redirige a la página principal después de eliminar
            },
            error: function(xhr, status, error) {
                console.error("Error al eliminar los datos:", error);
                alert("Hubo un error al eliminar los datos. Por favor, inténtelo de nuevo.");
            }
        });
    }
}

function calcularImpuestos() {
    var horasTrabajadas = parseFloat($("#horas-trabajadas-input").val()) || 0;
        var salarioXHora = parseFloat($("#salario-hora-input").val()) || 0;  // Cambiado a #salario-hora-input

        // Calcular el salario bruto
        var sBruto = horasTrabajadas * salarioXHora;
        $("#sBruto").text("$" + sBruto.toFixed(2)); // Mostrar salario bruto

        calcularSalarioNeto(sBruto);
    }

    function calcularSalarioNeto(sBruto) {
        // Asegurarse de que sBruto sea un número, o asignarle 0 si no lo es
        sBruto = parseFloat(sBruto) || 0;
    
        // Calcular ISS (9.75%)
        var seguroSocial = sBruto * 0.0975;
        $("#sSocial").text("$" + seguroSocial.toFixed(2)); // Mostrar seguro social
    
        // Calcular ISE (1.25%)
        var seguroEducativo = sBruto * 0.0125;
        $("#sEducativo").text("$" + seguroEducativo.toFixed(2)); // Mostrar seguro educativo
    
        // Calcular ISR (15% o 25%)
        var sAnual = sBruto * 12;
        var impuestoRenta = 0;
    
        if (sAnual > 50000) {
            $("#iRenta-label").text("ISR (25%)");
            impuestoRenta = ((50000 - 11000) * 0.15) + ((sAnual - 50000) * 0.25);
        } else if (sAnual > 11000 && sAnual <= 50000) {
            $("#iRenta-label").text("ISR (15%)");
            impuestoRenta = (sAnual - 11000) * 0.15;
        }
        var mensual = impuestoRenta / 12;
        $("#iRenta").text("$" + mensual.toFixed(2)); // Mostrar ISR
    
        // Calcular deducciones adicionales
        var desc1 = parseFloat($("#deduccion1").val()) || 0;
        var desc2 = parseFloat($("#deduccion2").val()) || 0;
        var desc3 = parseFloat($("#deduccion3").val()) || 0;
    
        $("#desc1").text("$" + desc1.toFixed(2));
        $("#desc2").text("$" + desc2.toFixed(2));
        $("#desc3").text("$" + desc3.toFixed(2));
    
        var totalDescuentos = desc1 + desc2 + desc3;
        $("#descTotal").text("$" + totalDescuentos.toFixed(2)); // Mostrar descuentos totales
    
        // Calcular salario neto
        var sNeto = sBruto - (seguroSocial + seguroEducativo + mensual + totalDescuentos);
        $("#sNeto").text("$" + sNeto.toFixed(2)); // Mostrar salario neto
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