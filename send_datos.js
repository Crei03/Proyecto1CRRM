$(document).ready(function() {
    // Rellenar el select con opciones
    for (let i = 1; i <= 13; i++) {
        $('#folio-select').append(`<option value="${i}">${i}</option>`);
    }

    // Botón para guardar (Insertar)
    $('#boton-salario').click(function() {
        let cedula1 = $('#folio-select').val();
        let cedula2 = $('#tomo-input').val();
        let cedula3 = $('#asiento-input').val();
        let cedula = cedula1 + cedula2 + cedula3; // Asegúrate de que todos los valores son válidos

        // Validar campos requeridos
        if (!cedula1 || !cedula2 || !cedula3) {
            alert("Por favor, completa todos los campos de cédula.");
            return;
        }

        enviarDatos('insert', cedula, true);
    });

    // Botón para actualizar
    $('#boton-actualizar').click(function() {
        let cedula_input = $('#mostrar-cedula').val(); // Obtener el valor aquí

        // Validar campo de cédula
        if (!cedula_input) {
            alert("Por favor, ingresa una cédula para actualizar.");
            return;
        }

        enviarDatos('update', cedula_input, false);
    });

    // Función que envía los datos al backend con la acción correspondiente
    function enviarDatos(actionType, cedula, insertar) {
        // Pasa los valores de texto a números
        var sbruto = parseFloat($('#sBruto').text().trim().replace(/[^0-9.-]+/g, '')) || 0;
        var ssocial = parseFloat($('#sSocial').text().trim().replace(/[^0-9.-]+/g, '')) || 0;
        var seducativo = parseFloat($('#sEducativo').text().trim().replace(/[^0-9.-]+/g, '')) || 0;
        var irenta = parseFloat($('#iRenta').text().trim().replace(/[^0-9.-]+/g, '')) || 0;
        var sneto = parseFloat($('#sNeto').text().trim().replace(/[^0-9.-]+/g, '')) || 0;

        var prefijo = $('#folio-select').val();
        var tomo = $('#tomo-input').val();
        var asiento = $('#asiento-input').val();

        if (insertar){
            // Construimos el objeto `persona` para inserción
            var persona = {
                action: actionType,  // Enviamos la acción ('insert' o 'update')
                prefijo: prefijo,
                tomo: tomo,
                asiento: asiento,
                cedula: cedula,
                nombre1: $('#primer-nombre').val(),
                nombre2: $('#segundo-nombre').val(),
                apellido1: $('#primer-apellido').val(),
                apellido2: $('#segundo-apellido').val(),
                provincia: $('#provincia').val(),
                distrito: $('#distrito').val(),
                corregimiento: $('#corregimiento').val(),
                htrabajadas: $('#horas-trabajadas-input').val(),
                shora: $('#salario-hora-input').val(),
                sbruto: sbruto,
                ssocial: ssocial,
                seducativo: seducativo,
                irenta: irenta,
                descuento1: $('#deduccion1').val(),
                descuento2: $('#deduccion2').val(),
                descuento3: $('#deduccion3').val(),
                sneto: sneto
            };
        } else {
            // Construimos el objeto `persona` para actualización
            var persona = {
                action: actionType,  // Enviamos la acción ('insert' o 'update')
                cedula: cedula,
                nombre1: $('#primer-nombre').val(),
                nombre2: $('#segundo-nombre').val(),
                apellido1: $('#primer-apellido').val(),
                apellido2: $('#segundo-apellido').val(),
                provincia: $('#provincia').val(),
                distrito: $('#distrito').val(),
                corregimiento: $('#corregimiento').val(),
                htrabajadas: $('#horas-trabajadas-input').val(),
                shora: $('#salario-hora-input').val(),
                sbruto: sbruto,
                ssocial: ssocial,
                seducativo: seducativo,
                irenta: irenta,
                descuento1: $('#deduccion1').val(),
                descuento2: $('#deduccion2').val(),
                descuento3: $('#deduccion3').val(),
                sneto: sneto
            };
        }

        console.log('Datos a enviar: ', persona);

        // Enviar los datos mediante AJAX
        $.ajax({
            type: 'POST',
            url: 'bd.php',
            data: persona,
            success: function(response) {
                console.log("Respuesta del servidor: ", response); // Imprimir respuesta para depuración
                try {
                    let jsonResponse = JSON.parse(response);  // Intentar parsear la respuesta JSON
                    console.log("Respuesta del servidor (JSON): ", jsonResponse);
                    // Manejo adicional de la respuesta según el estado
                    if (jsonResponse.status === 'success') {
                        alert(jsonResponse.message);
                    } else {
                        alert("Error: " + jsonResponse.message);
                    }
                } catch (e) {
                    console.error("Error al parsear la respuesta JSON: ", e);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error al enviar los datos: ' + textStatus, errorThrown);
            }
        });
    }
});
