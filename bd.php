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

    if ($action == 'update') {
        // Actualizar datos en la tabla planilla
        $datos = $_POST['datos'];
    
        // Consulta SQL para actualizar los datos de la tabla
        $stmt = $conn->prepare("UPDATE planilla SET nombre1=?, nombre2=?, apellido1=?, apellido2=?, provincia=?, distrito=?, corregimiento=?, htrabajadas=?, shora=?, sbruto=?, ssocial=?, seducativo=?, irenta=?, descuento1=?, descuento2=?, descuento3=?, sneto=? WHERE cedula=?");
    
        if ($stmt === false) {
            die(json_encode(array('status' => 'error', 'message' => 'Error al preparar la consulta: ' . $conn->error)));
        }
    
        // Vinculación de parámetros a la consulta preparada
        $stmt->bind_param(
            'sssssssddddddddds',
            $datos['nombre1'],
            $datos['nombre2'],
            $datos['apellido1'],
            $datos['apellido2'],
            $datos['provincia'],
            $datos['distrito'],
            $datos['corregimiento'],
            $datos['htrabajadas'],
            $datos['shora'],
            $datos['sbruto'],
            $datos['ssocial'],
            $datos['seducativo'],
            $datos['irenta'],
            $datos['descuento1'],
            $datos['descuento2'],
            $datos['descuento3'],
            $datos['sneto'],
            $datos['cedula']
        );
    
        // Ejecutar la consulta
        if ($stmt->execute()) {
            echo json_encode(array('status' => 'success', 'message' => 'Datos actualizados correctamente.'));
        } else {
            echo json_encode(array('status' => 'error', 'message' => 'Error al actualizar los datos: ' . $stmt->error));
        }

        $stmt->close();
    } elseif ($action == 'delete') {
        // Borrar datos de la tabla planilla
        $cedula = $_POST['cedula'];

        $stmt = $conn->prepare("DELETE FROM planilla WHERE cedula=?");
        $stmt->bind_param('s', $cedula);

        if ($stmt->execute()) {
            echo json_encode(array('status' => 'success', 'message' => 'Datos eliminados correctamente.'));
        } else {
            echo json_encode(array('status' => 'error', 'message' => 'Error al eliminar los datos: ' . $stmt->error));
        }

        $stmt->close();
    } else {
        // Insertar nuevos datos en la tabla planilla
        $prefijo = $conn->real_escape_string($_POST['prefijo']);
        $tomo = $conn->real_escape_string($_POST['tomo']);
        $asiento = $conn->real_escape_string($_POST['asiento']);
        $cedula = $conn->real_escape_string($_POST['cedula']);
        $nombre1 = $conn->real_escape_string($_POST['nombre1']);
        $nombre2 = $conn->real_escape_string($_POST['nombre2']);
        $apellido1 = $conn->real_escape_string($_POST['apellido1']);
        $apellido2 = $conn->real_escape_string($_POST['apellido2']);
        $provincia = $conn->real_escape_string($_POST['provincia']);
        $distrito = $conn->real_escape_string($_POST['distrito']);
        $corregimiento = $conn->real_escape_string($_POST['corregimiento']);
        $htrabajadas = $conn->real_escape_string($_POST['htrabajadas']);
        $shora = $conn->real_escape_string($_POST['shora']);
        $sbruto = $conn->real_escape_string($_POST['sbruto']);
        $ssocial = $conn->real_escape_string($_POST['ssocial']);
        $seducativo = $conn->real_escape_string($_POST['seducativo']);
        $irenta = $conn->real_escape_string($_POST['irenta']);
        $descuento1 = $conn->real_escape_string($_POST['descuento1']);
        $descuento2 = $conn->real_escape_string($_POST['descuento2']);
        $descuento3 = $conn->real_escape_string($_POST['descuento3']);
        $sneto = $conn->real_escape_string($_POST['sneto']);

        $sql = "INSERT INTO planilla (prefijo, tomo, asiento, cedula, nombre1, nombre2, apellido1, apellido2, provincia, distrito, corregimiento, htrabajadas, shora, sbruto, ssocial, seducativo, irenta, descuento1, descuento2, descuento3, sneto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param('ssssssssssssddddddddd', $prefijo, $tomo, $asiento, $cedula, $nombre1, $nombre2, $apellido1, $apellido2, $provincia, $distrito, $corregimiento, $htrabajadas, $shora, $sbruto, $ssocial, $seducativo, $irenta, $descuento1, $descuento2, $descuento3, $sneto);
            if ($stmt->execute()) {
                echo json_encode(array('status' => 'success', 'message' => 'Datos insertados correctamente.'));
            } else {
                echo json_encode(array('status' => 'error', 'message' => 'Error al insertar los datos: ' . $stmt->error));
            }
            $stmt->close();
        } else {
            echo json_encode(array('status' => 'error', 'message' => 'Error al preparar la consulta: ' . $conn->error));
        }
    }
} else if (isset($_GET['cedula'])) {
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
