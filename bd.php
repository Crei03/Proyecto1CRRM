<?php
$servidor = "localhost";
$usuario = "d42024";
$password = "1234";
$base_datos = "planilla";

$conn = new mysqli($servidor, $usuario, $password, $base_datos);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(array('status' => 'error', 'message' => 'Error de conexión a la base de datos: ' . $conn->connect_error)));
}

// Manejo de la solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // Borrar datos de la tabla planilla
    if ($action === 'delete') {
        $cedula = $_POST['cedula'] ?? '';

        if (!empty($cedula)) {
            $stmt = $conn->prepare("DELETE FROM planilla WHERE cedula=?");
            if ($stmt) {
                $stmt->bind_param('s', $cedula);

                if ($stmt->execute()) {
                    echo json_encode(array('status' => 'success', 'message' => 'Datos eliminados correctamente.'));
                } else {
                    echo json_encode(array('status' => 'error', 'message' => 'Error al eliminar los datos: ' . $stmt->error));
                }
                $stmt->close();
            } else {
                echo json_encode(array('status' => 'error', 'message' => 'Error al preparar la consulta: ' . $conn->error));
            }
        } else {
            echo json_encode(array('status' => 'error', 'message' => 'Cédula no proporcionada.'));
        }
    } 
    // Insertar o actualizar datos
    else {
        // Recoger y escapar datos
        $cedula = $conn->real_escape_string($_POST['cedula'] ?? '');

        // Validar la cédula para determinar si es una inserción o una actualización
        if (empty($cedula)) {
            echo json_encode(array('status' => 'error', 'message' => 'Cédula no proporcionada.'));
            exit;
        }

        // Verificar si el registro existe para decidir entre insertar o actualizar
        $query = "SELECT COUNT(*) FROM planilla WHERE cedula = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('s', $cedula);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();

        // Datos a insertar o actualizar
        $prefijo = $conn->real_escape_string($_POST['prefijo'] ?? '');
        $tomo = $conn->real_escape_string($_POST['tomo'] ?? '');
        $asiento = $conn->real_escape_string($_POST['asiento'] ?? '');
        $nombre1 = $conn->real_escape_string($_POST['nombre1'] ?? '');
        $nombre2 = $conn->real_escape_string($_POST['nombre2'] ?? '');
        $apellido1 = $conn->real_escape_string($_POST['apellido1'] ?? '');
        $apellido2 = $conn->real_escape_string($_POST['apellido2'] ?? '');
        $provincia = $conn->real_escape_string($_POST['provincia'] ?? '');
        $distrito = $conn->real_escape_string($_POST['distrito'] ?? '');
        $corregimiento = $conn->real_escape_string($_POST['corregimiento'] ?? '');
        $htrabajadas = $conn->real_escape_string($_POST['htrabajadas'] ?? '0');
        $shora = $conn->real_escape_string($_POST['shora'] ?? '0');
        $sbruto = $conn->real_escape_string($_POST['sbruto'] ?? '0');
        $ssocial = $conn->real_escape_string($_POST['ssocial'] ?? '0');
        $seducativo = $conn->real_escape_string($_POST['seducativo'] ?? '0');
        $irenta = $conn->real_escape_string($_POST['irenta'] ?? '0');
        $descuento1 = $conn->real_escape_string($_POST['descuento1'] ?? '0');
        $descuento2 = $conn->real_escape_string($_POST['descuento2'] ?? '0');
        $descuento3 = $conn->real_escape_string($_POST['descuento3'] ?? '0');
        $sneto = $conn->real_escape_string($_POST['sneto'] ?? '0');

        if ($count > 0) {
            // Actualizar datos sin cambiar el prefijo, tomo, asiento ni la cédula
            $sql = "UPDATE planilla SET   
                nombre1 = ?, 
                nombre2 = ?, 
                apellido1 = ?, 
                apellido2 = ?, 
                provincia = ?, 
                distrito = ?, 
                corregimiento = ?, 
                htrabajadas = ?, 
                shora = ?, 
                sbruto = ?, 
                ssocial = ?, 
                seducativo = ?, 
                irenta = ?, 
                descuento1 = ?, 
                descuento2 = ?, 
                descuento3 = ?, 
                sneto = ? 
                WHERE cedula = ?";
        
            $stmt = $conn->prepare($sql);
            if ($stmt) {
                $stmt->bind_param('ssssssssssssdddddd', 
                    $nombre1, 
                    $nombre2, 
                    $apellido1, 
                    $apellido2, 
                    $provincia, 
                    $distrito, 
                    $corregimiento, 
                    $htrabajadas, 
                    $shora, 
                    $sbruto, 
                    $ssocial, 
                    $seducativo, 
                    $irenta, 
                    $descuento1, 
                    $descuento2, 
                    $descuento3, 
                    $sneto, 
                    $cedula);
        
                if ($stmt->execute()) {
                    echo json_encode(array('status' => 'success', 'message' => 'Datos actualizados correctamente.'));
                } else {
                    echo json_encode(array('status' => 'error', 'message' => 'Error al actualizar los datos: ' . $stmt->error));
                }
                $stmt->close();
            } else {
                echo json_encode(array('status' => 'error', 'message' => 'Error al preparar la consulta de actualización: ' . $conn->error));
            }
        }else {
            
            $sql = "INSERT INTO planilla (prefijo, tomo, asiento, cedula, 
                nombre1, nombre2, apellido1, apellido2, 
                provincia, distrito, corregimiento, 
                htrabajadas, shora, sbruto, 
                ssocial, seducativo, irenta, 
                descuento1, descuento2, descuento3, sneto) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $stmt = $conn->prepare($sql);
            if ($stmt) {
                $stmt->bind_param('ssssssssssssddddddddd', 
                    $prefijo, $tomo, $asiento, $cedula, 
                    $nombre1, $nombre2, $apellido1, 
                    $apellido2, $provincia, $distrito, 
                    $corregimiento, $htrabajadas, 
                    $shora, $sbruto, $ssocial, 
                    $seducativo, $irenta, 
                    $descuento1, $descuento2, 
                    $descuento3, $sneto);

                if ($stmt->execute()) {
                    echo json_encode(array('status' => 'success', 'message' => 'Datos insertados correctamente.'));
                } else {
                    echo json_encode(array('status' => 'error', 'message' => 'Error al insertar los datos: ' . $stmt->error));
                }
                $stmt->close();
            } else {
                echo json_encode(array('status' => 'error', 'message' => 'Error al preparar la consulta de inserción: ' . $conn->error));
            }
        }
    }
} 
// Manejo de solicitudes GET para obtener datos
else if (isset($_GET['cedula'])) {
    // Obtener datos por cédula
    $cedula = $_GET['cedula'];

    $query = "SELECT * FROM planilla WHERE cedula = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $cedula);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $datos = $result->fetch_assoc();
        echo json_encode(array('status' => 'success', 'data' => $datos));
    } else {
        echo json_encode(array('status' => 'error', 'message' => 'Cédula no encontrada.'));
    }

    $stmt->close();
} else if (isset($_GET['codigo_distrito'])) {
    // Obtener corregimientos por código de distrito
    $codigo_distrito = $_GET['codigo_distrito'];

    $query = "SELECT codigo_corregimiento, nombre_corregimiento FROM corregimiento WHERE codigo_distrito = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $codigo_distrito);
    $stmt->execute();
    $result = $stmt->get_result();

    $corregimientos = array();
    while ($row = $result->fetch_assoc()) {
        $corregimientos[] = array('codigo' => $row['codigo_corregimiento'], 'nombre' => $row['nombre_corregimiento']);
    }

    echo json_encode($corregimientos);
    $stmt->close();
} else if (isset($_GET['codigo_provincia'])) {
    // Obtener distritos por código de provincia
    $codigo_provincia = $_GET['codigo_provincia'];

    $query = "SELECT codigo_distrito, nombre_distrito FROM distrito WHERE codigo_provincia = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $codigo_provincia);
    $stmt->execute();
    $result = $stmt->get_result();

    $distritos = array();
    while ($row = $result->fetch_assoc()) {
        $distritos[] = array('codigo' => $row['codigo_distrito'], 'nombre' => $row['nombre_distrito']);
    }

    echo json_encode($distritos);
    $stmt->close();
} else {
    // Obtener todas las provincias
    $query = "SELECT codigo_provincia, nombre_provincia FROM provincia";
    $result = $conn->query($query);

    $provincias = array();
    while ($row = $result->fetch_assoc()) {
        $provincias[] = array('codigo' => $row['codigo_provincia'], 'nombre' => $row['nombre_provincia']);
    }

    echo json_encode($provincias);
}

// Cerrar la conexión
$conn->close();
?>
