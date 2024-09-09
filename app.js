$(function() {

    $(".salario").on("input", function(){

        horasTrabajas = document.getElementById("horas").value;
        salarioXHora = document.getElementById("salarioHora").value;
        
        var s = horasTrabajas * salarioXHora;
        const sBruto = parseFloat(s.toFixed(2));
    
        document.getElementById("sBruto").value = sBruto;
    
        calcularSalarioNeto();

    });

    function calcularSalarioNeto(){
        var sBruto = document.getElementById("sBruto").value;
    
        var i = sBruto * 0.0975;
        const seguroSocial = parseFloat(i.toFixed(2));
        document.getElementById("sSocial").value = seguroSocial;   
        
        var i = sBruto * 0.0125;
        const seguroEducativo = parseFloat(i.toFixed(2));
        document.getElementById("sEducativo").value = seguroEducativo;
        
        var sAnual = sBruto *13 ;
        let impuestoRenta = 0; 
        let mensual = 0;
        if(sAnual > 50000){
            impuestoRenta = ((50000 - 11000) * 0.15) + ((sAnual - 50000) * 0.25);
            mensual = impuestoRenta / 12;
            document.getElementById("iRenta").value = mensual.toFixed(2);
        } else if (sAnual > 11000){
            impuestoRenta = (sAnual - 11000) * 0.15;
            mensual = impuestoRenta / 12;
            document.getElementById("iRenta").value = mensual.toFixed(2);
        } else {
            document.getElementById("iRenta").value = 0;
        }
        //TODO restar descuentos
        var desc1 = document.getElementById("desc1").value;
        var desc2 = document.getElementById("desc2").value;
        var desc3 = document.getElementById("desc3").value;

        const descuentos = parseFloat(desc1) + parseFloat(desc2) + parseFloat(desc3);


        const sNeto = sBruto - (seguroSocial + seguroEducativo + mensual + descuentos);
        document.getElementById("sNeto").value = sNeto.toFixed(2); // Convertir sNeto a decimal con 2 dígitos


    }

});
