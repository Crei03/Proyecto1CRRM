$(document).ready(function(){
    
    for (let i = 1; i <= 13; i++) {
        $('#folio-select').append(`<option value="${i}">${i}</option>`);
    }
    let persona = null;
    $('.datos-personales').on('input', function(){
        let cedula1= $('#folio-select').val();
        let cedula2= $('#tomo-input').val();
        let cedula3= $('#asiento-input').val();
        let cedula= cedula1 + cedula2 + cedula3;
        // pasa los valores de texto a números. evita el NaN
        var sbruto = parseFloat($('#sBruto').text().trim().replace(/[^0-9.-]+/g, ''));
        var ssocial = parseFloat($('#sSocial').text().trim().replace(/[^0-9.-]+/g, ''));
        var seducativo = parseFloat($('#sEducativo').text().trim().replace(/[^0-9.-]+/g, ''));
        var irenta = parseFloat($('#iRenta').text().trim().replace(/[^0-9.-]+/g, ''));
        var sneto = parseFloat($('#sNeto').text().trim().replace(/[^0-9.-]+/g, ''));
        
        persona = {
            prefijo : cedula1,
            tomo : cedula2,
            asiento : cedula3,
            cedula : cedula,
            nombre1 : $('#primer-nombre').val(),
            nombre2 : $('#segundo-nombre').val(),
            apellido1 : $('#primer-apellido').val(),
            apellido2 : $('#segundo-apellido').val(),
            provincia : $('#provincia').val(),
            distrito : $('#distrito').val(),
            corregimiento : $('#corregimiento').val(),
            htrabajadas : $('#horas-trabajadas-input').val(),
            shora : $('#salario-hora-input').val(),
            sbruto :  sbruto,
            ssocial : ssocial,
            seducativo :  seducativo,
            irenta : irenta,
            descuento1 : $('#deduccion1').val(),
            descuento2 : $('#deduccion2').val(),
            descuento3 : $('#deduccion3').val(),
            sneto : sneto,
        }
        console.log(persona);
    });

    $('#boton-salario').click(function(){
        $.ajax({
            type: 'POST',
            url: 'bd.php',
            data: persona,
            success: function(response) {
                console.log(response);
            },
            error: function(textStatus) {
                console.error('Error al cargar los distritos: ' + textStatus);
            }
        });
    });

});