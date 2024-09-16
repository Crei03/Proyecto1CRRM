$(document).ready(function() {
    cargarProvincias();

    var $selectProvincia = $('#provincia');
    var $selectDistrito = $('#distrito');
    var $selectCorregimiento = $('#corregimiento');

    // Manejar el cambio de la selección de provincias
    $selectProvincia.on('change', function() {
        var codigoProvinciaSeleccionada = $(this).val();
        limpiarOpciones($selectDistrito);
        limpiarOpciones($selectCorregimiento);
        cargarDistritos(codigoProvinciaSeleccionada);
    });

    // Manejar el cambio de la selección de distritos
    $selectDistrito.on('change', function() {
        var codigoDistritoSeleccionado = $(this).val();
        limpiarOpciones($selectCorregimiento);
        cargarCorregimientos(codigoDistritoSeleccionado);
    });
});

function cargarProvincias() {
    $.ajax({
        type: 'GET',
        url: 'bd.php',
        success: function(response) {
            var provincias = JSON.parse(response);
            var $selectProvincia = $('#provincia');

            provincias.forEach(function(provincia) {
                var option = $('<option>').val(provincia.codigo).text(provincia.nombre);
                $selectProvincia.append(option);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al cargar las provincias: ' + textStatus);
        }
    });
}

function cargarDistritos(codigo_provincia) {
    $.ajax({
        type: 'GET',
        url: 'bd.php',
        data: { codigo_provincia: codigo_provincia },
        success: function(response) {
            var distritos = JSON.parse(response);
            var $selectDistrito = $('#distrito');

            distritos.forEach(function(distrito) {
                var option = $('<option>').val(distrito.codigo).text(distrito.nombre);
                $selectDistrito.append(option);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al cargar los distritos: ' + textStatus);
        }
    });
}

function cargarCorregimientos(codigo_distrito) {
    $.ajax({
        type: 'GET',
        url: 'bd.php',
        data: { codigo_distrito: codigo_distrito },
        success: function(response) {
            var corregimientos = JSON.parse(response);
            var $selectCorregimiento = $('#corregimiento');

            corregimientos.forEach(function(corregimiento) {
                var option = $('<option>').val(corregimiento.codigo).text(corregimiento.nombre);
                $selectCorregimiento.append(option);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al cargar los corregimientos: ' + textStatus);
        }
    });
}


function limpiarOpciones($selectElement) {
    $selectElement.html('<option value="" disabled selected>Seleccione una opción</option>');
}