$(function() {
 
    $(".nombres-completo").on("input", function() {
        var input = $(this);
        var valor = input.val();

        // Expresión regular para permitir solo letras y un solo espacio entre palabras
        var soloLetras = /^[a-zA-Z\s]*$/;

        // Validación: solo letras, permitiendo un espacio al principio
        if (!soloLetras.test(valor) || /\s{2,}/.test(valor) || /(\s)[a-zA-Z]/.test(valor.charAt(0))) {
            valor = valor.replace(/[^a-zA-Z\s]/g, ""); // Elimina caracteres no válidos (solo permite letras y espacios)
            valor = valor.replace(/\s{2,}/g, " "); // Reemplaza múltiples espacios por uno solo
            valor = valor.replace(/^\s*(?=\s)/g, ""); // Permite espacio al inicio y elimina espacios dobles
            input.val(valor);
        }
    });

    $(".solo-numeros").on("input", function() {
        var soloNumeros = /^\d+$/; // Expresión regular para permitir solo números

        if (!soloNumeros.test($(this).val())) {
            $(this).val($(this).val().slice(0, -1));
        }
    });

    $(".dinero").on("input", function() {
        var valor = this.value;

        valor = valor.replace(/[^0-9.]/g, '');

        // Asegura que solo haya un punto decimal
        var partes = valor.split('.');
        if (partes.length > 2) {
            valor = partes[0] + '.' + partes.slice(1).join('');
        }

        if (partes.length > 1) {
            partes[1] = partes[1].substring(0, 2);
            valor = partes[0] + '.' + partes[1];
        }

        this.value = valor; 
    });

});