$(function() {

var input_actualizar = ""
    // Evento para permitir solo letras
    $(".solo-letras").on("input", function() {
        var input = $(this);
        var valor = input.val();
    
        // Expresión regular que permite letras y un solo espacio
        var soloLetras = /^[a-zA-Z\s]*$/;
    
        // Contar cuántos espacios hay en el input
        var countSpaces = (valor.match(/ /g) || []).length;
    
        // Si hay más de un espacio, eliminar el último carácter
        if (countSpaces > 1) {
            input.val(valor.slice(0, -1));
            return; // Sale de la función para evitar más validaciones
        }
    
        // Verifica si el valor coincide con la expresión regular (solo letras y espacios permitidos)
        if (!soloLetras.test(valor)) {
            const errorMessage = input.next(".msgError-nombres"); 
            errorMessage.show();
    
            input.addClass("error");
    
            // Elimina el último carácter ingresado si no es válido
            input.val(valor.slice(0, -1));
    
            // Después de 5 segundos, ocultar el mensaje de error y quitar el borde rojo
            setTimeout(() => {
                errorMessage.hide();
                input.removeClass("error"); 
            }, 5000);
        } else {
            const errorMessage = input.next(".msgError-nombres");
            errorMessage.hide(); 
            input.removeClass("error");
        }
    });
    
    


    // Evento para permitir solo números
    $(".solo-numeros").on("input", function() {
        var input = $(this);
        var valor = input.val();
    
        
        var soloNumeros = /^\d*$/; 
    
        if (!soloNumeros.test(valor)) {
            // Muestra el mensaje de error correspondiente
            const errorMessage = input.next(".msgError-numeros");
            errorMessage.show(); 
    
            // Cambia el borde del input a rojo
            input.addClass("error");
    
            // Elimina el último carácter ingresado no válido
            input.val(valor.slice(0, -1));
    
            // Después de 5 segundos, ocultar el mensaje de error y quitar el borde rojo
            setTimeout(() => {
                errorMessage.hide(); 
                input.removeClass("error"); 
            }, 5000);
        } else {
            
            const errorMessage = input.next(".msgError-numeros");
            errorMessage.hide(); // Oculta el mensaje de error
            input.removeClass("error");
        }
    });
    

    // Evento para manejar valores monetarios
    $(".dinero").on("input", function() {
        var input = $(this);
        var valor = input.val();
    
        
        var soloNumerosYPunto = /^\d*\.?\d*$/; 
    
        if (!soloNumerosYPunto.test(valor)) {
            // Muestra el mensaje de error correspondiente
            const errorMessage = input.next(".msgError-salario"); 
            errorMessage.show(); // Muestra el mensaje
    
            // Cambia el borde del input a rojo
            input.addClass("error");
    
            // Elimina el último carácter ingresado no válido
            input.val(valor.slice(0, -1));
    
            // Después de 5 segundos, ocultar el mensaje de error y quitar el borde rojo
            setTimeout(() => {
                errorMessage.hide();
                input.removeClass("error"); 
            }, 5000);
        } else {
            
            const errorMessage = input.next(".msgError-salario");
            errorMessage.hide(); 
            input.removeClass("error");
        }
    });

    // Evento para validar al presionar el botón de envío
    $("#boton-salario, #boton-actualizar, #boton-eliminar").on("click", function(event) {
        event.preventDefault(); // Evita que la página se recargue
    
        let valid = true; 
    
        // Verifica todos los inputs excepto el del segundo nombre
        $(".names-field, .solo-numeros, .dinero, .select").each(function() {
            var input = $(this);
    
            // Saltar el campo del segundo nombre o deducción 1 si no es obligatorio
            if (input.attr("id") === "segundo-nombre" || input.hasClass("deducion-extra-input")) {
                return true; // Salta este campo y continúa con los demás
            }
            
    
            // Si es un input normal, verifica si está vacío
            if (input.is('input') || input.is('textarea')) {
                if (input.val().trim() === "") {
                    input.addClass("error"); 
                    valid = false; // Indica que el formulario no es válido
                } else {
                    input.removeClass("error"); 
                }
            }
    
            // Si es un select, verifica que tenga un valor seleccionado
            if (input.is('select')) {
                if (input.val() === "" || input.val() === null) {
                    input.addClass("error"); 
                    valid = false;
                } else {
                    input.removeClass("error"); 
                }
            }
        });

        function limpiarInputs() {
            // Selecciona todos los inputs, textareas y también los readonly
            event.preventDefault();
            $('input[type="text"], input[type="number"], input[type="email"], textarea, input[readonly]').val('');
            $('select').val('').change();
        }
        
        
        var buttonId = $(this).attr("id"); // Obtener el ID del botón presionado
        var cedula = localStorage.getItem("cedula");
        if (!valid) {
            if (buttonId === "boton-eliminar"){
                limpiarInputs();
                alert("Usuario con cédula " + cedula +  " eliminado exitosamente!");
                window.location.href = "login.html";
            }else{
                alert("Debe rellenar todos los campos obligatorios.");
            }
            
        } else {
           // Identificar el botón presionado
            
            if (buttonId === "boton-salario") {
                alert("Registro Guardado exitosamente!");
            } else if (buttonId === "boton-actualizar") {
                alert("Registro Actualizado exitosamente!");
            }
        }
    });
    
    $(document).ready(function() {
        
        $("#login-link").on("click", function(event) {
            event.preventDefault(); // Evita que el enlace redirija inmediatamente
        
            var cedula = $("#cedula-input").val().trim(); // Obtiene el valor del input de cédula
        
            if (cedula === "") {
                alert("Debe completar el campo de cédula antes de continuar.");
                $("#cedula-input").addClass("error");
            } else {
                $("#cedula-input").removeClass("error");
        
                $.ajax({
                    url: 'bd.php', // Asegúrate de que esta ruta sea correcta
                    type: 'GET',
                    data: { cedula: cedula },
                    dataType: 'json',
                    success: function(response) {
                        console.log("Respuesta recibida:", response); // Agregar mensaje de depuración
        
                        if (response.status === 'success') {
                            // La cédula se encontró en la base de datos, redirige a la página
                            localStorage.setItem("cedula", cedula);
                            window.location.href = "HomePageActualizar.html";
                        } else {
                            // La cédula no se encontró
                            alert("La cédula no se encontró en la base de datos.");
                        }
                    },
                    error: function(xhr, status, error) {
                        console.log('Error en la solicitud:', error);
                    }
                });
            }
        });
        

        $("#cedula-input").on("input keypress", function(event) {
            var input = $(this).val();
            var cedula = input.replace(/[^0-9]/g, ''); // Solo números permitidos
        
            $(this).val(cedula);
        
            // Guardar la cédula para colocarla en el campo cédula de HomePageActualizar.html
            localStorage.setItem("cedula", cedula);
        
            if (event.type === "keypress" && event.which === 13) {
                if (cedula === "") {
                    event.preventDefault(); // Evita que el enlace redirija
                    alert("Debe completar el campo de cédula antes de continuar.");
                    $("#cedula-input").addClass("error");
                } else {
                    $("#cedula-input").removeClass("error");
        
                    console.log("Cédula enviada:", cedula); // Agregar mensaje de depuración
        
                    // Realiza la solicitud AJAX para verificar la cédula
                    $.ajax({
                        url: 'bd.php', // Reemplaza con la ruta correcta de tu archivo PHP
                        type: 'GET',
                        data: { cedula: cedula },
                        dataType: 'json',
                        success: function(response) {        
                            if (response.status === 'success') {
                                // La cédula se encontró en la base de datos, redirige a la página
                                localStorage.setItem("cedula", cedula);
                                window.location.href = "HomePageActualizar.html";
                            } else {
                                // La cédula no se encontró
                                alert("La cédula no se encontró en la base de datos.");
                            }
                        },
                        error: function(xhr, status, error) {
                            console.log('Error en la solicitud:', error);
                        }
                    });
                }
            }
        });

        // Recuperar y mostrar la cédula en el input cuando se carga la página
        var cedula = localStorage.getItem("cedula");
        
        // Si estamos en la página de actualizar
        if (window.location.pathname.includes("HomePageActualizar.html")) {
            if (cedula) {
               
                $("#mostrar-cedula").val(cedula);
            } else {
                alert("No se encontró una cédula guardada.");
                window.location.href = "login.html";
            }
        }

        

    });


    
});
