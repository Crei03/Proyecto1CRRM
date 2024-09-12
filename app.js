$(function() {
    // Captura de evento cuando se cambia cualquier input
    $("#horas-trabajadas-input, #salario-hora-input, #deduccion1, #deduccion2, #deduccion3").on("input", function(){
        calcularSalarioBruto();
    });

    function calcularSalarioBruto() {
        var horasTrabajadas = parseFloat($("#horas-trabajadas-input").val()) || 0;
        var salarioXHora = parseFloat($("#salario-hora-input").val()) || 0;  // Cambiado a #salario-hora-input

        // Calcular el salario bruto
        var sBruto = horasTrabajadas * salarioXHora;
        $("#sBruto").text("$" + sBruto.toFixed(2)); // Mostrar salario bruto

        calcularSalarioNeto(sBruto);
    }

    function calcularSalarioNeto(sBruto){
        // Calcular ISS (9.75%)
        var seguroSocial = sBruto * 0.0975;
        $("#sSocial").text("$" + seguroSocial.toFixed(2)); // Mostrar seguro social

        // Calcular ISE (1.25%)
        var seguroEducativo = sBruto * 0.0125;
        $("#sEducativo").text("$" + seguroEducativo.toFixed(2)); // Mostrar seguro educativo

        // Calcular ISR (15%)
        var sAnual = sBruto * 12;
        var impuestoRenta = 0;
        if (sAnual > 50000) {
            $("#iRenta-label").text("ISR (25%)");
            impuestoRenta = ((50000 - 11000) * 0.15) + ((sAnual - 50000) * 0.25);
        
        } else if (sAnual > 11000 && sAnual < 50000) {
            $("#iRenta-label").text("ISR (15%)");
            impuestoRenta = (sAnual - 11000) * 0.15;
        }
        var mensual = impuestoRenta / 12;
        $("#iRenta").text("$" + mensual.toFixed(2)); // Mostrar ISR

        // Calcular deducciones
        var desc1 = parseFloat($("#deduccion1").val()) || 0;  // Cambiado a #deduccion1
        var desc2 = parseFloat($("#deduccion2").val()) || 0;  // Cambiado a #deduccion2
        var desc3 = parseFloat($("#deduccion3").val()) || 0;  // Cambiado a #deduccion3

        $("#desc1").text("$" + desc1.toFixed(2));
        $("#desc2").text("$" + desc2.toFixed(2));
        $("#desc3").text("$" + desc3.toFixed(2));

        var totalDescuentos = desc1 + desc2 + desc3;
        $("#descTotal").text("$" + totalDescuentos.toFixed(2)); // Mostrar descuentos totales

        // Calcular salario neto
        var sNeto = sBruto - (seguroSocial + seguroEducativo + mensual + totalDescuentos);
        $("#sNeto").text("$" + sNeto.toFixed(2)); // Mostrar salario neto
    }

});
