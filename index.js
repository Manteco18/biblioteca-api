const express = require('express');
const cors = require('cors');
const connection = require('./db');

const app = express();
const PORT = 3000;

// Agragar middleware para permitir trafico desde app angular
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: true }));

// Registramos los endpoints 
app.post('/confirmacion', (req, res) => {
    const data = req.body;
    console.log('Confirmacion recibida desde angular:', data);

    //TODO: Procesar la indormacion, ej, registrar en la base de datos

    res.status(200).json({
        message: 'Confirmacion recibida exitosamente',
        reservado: true,
        datos: data
    });
});

app.get('/getLibros', (req, res) => {
    const sql = `SELECT * FROM Libros`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener libros:', err);
            return res.status(500).json({ message: 'Error al obtener los libros' });
        }

        res.status(200).json(results);
    });
});


// Agregar el endpoint para guardar datos de libros
app.post('/saveLibro', (req, res) => {
    let { titulo, autor, anio_publicacion, categoria, cantidad_disponible } = req.body;

    // Convertir a número
    anio_publicacion = parseInt(anio_publicacion);
    cantidad_disponible = parseInt(cantidad_disponible);

    const sql = `
        INSERT INTO Libros (titulo, autor, anio_publicacion, categoria, cantidad_disponible)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [titulo, autor, anio_publicacion, categoria, cantidad_disponible],
        (err, results) => {
            if (err) {
                console.error('Error al guardar el libro:', err);
                return res.status(500).json({ message: 'Error al guardar el libro' });
            }

            console.log('Libro registrado de manera correcta');
            res.status(201).json({
                message: 'Libro guardado exitosamente',
                idGenerado: results.insertId
            });
        }
    );
});
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// **************************************************
// Usuario
// **************************************************

// Agregar el endpoint para guardar datos de usuarios
app.post('/saveUsuario', (req, res) => {
    let { nombre, email, telefono } = req.body;

    const sql = `
        INSERT INTO Usuarios (nombre, email, telefono)
        VALUES (?, ?, ?)
    `;

    connection.query(
        sql,
        [nombre, email, telefono],
        (err, results) => {
            if (err) {
                console.error('Error al guardar el usuario:', err);
                return res.status(500).json({ message: 'Error al guardar el usuario' });
            }

            console.log('Usuario registrado correctamente');
            res.status(201).json({
                message: 'Usuario guardado exitosamente',
                idGenerado: results.insertId
            });
        }
    );
});

app.get('/getUsuarios', (req, res) => {
    const sql = "SELECT * FROM Usuarios";

    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener usuarios:", err);
            return res.status(500).json({ message: "Error al obtener usuarios" });
        }

        res.json(results);
    });
});

// **************************************************
// Prestamos
// **************************************************

app.post('/savePrestamo', (req, res) => {
    const { id_usuario, id_libro, fecha_prestamo, fecha_devolucion, estado } = req.body;

    // 1. Validar que el usuario exista
    const sqlUsuario = `SELECT * FROM Usuarios WHERE id_usuario = ?`;

    connection.query(sqlUsuario, [id_usuario], (err, userResult) => {
        if (err) {
            console.error('Error al verificar usuario:', err);
            return res.status(500).json({ message: 'Error interno' });
        }

        if (userResult.length === 0) {
            return res.status(400).json({ message: 'El usuario no existe' });
        }

        // 2. Validar que el libro exista
        const sqlLibro = `SELECT * FROM Libros WHERE id_libro = ?`;

        connection.query(sqlLibro, [id_libro], (err, bookResult) => {
            if (err) {
                console.error('Error al verificar libro:', err);
                return res.status(500).json({ message: 'Error interno' });
            }

            if (bookResult.length === 0) {
                return res.status(400).json({ message: 'El libro no existe' });
            }

            // 3. Si ambos existen → registrar el préstamo
            const sqlInsert = `
                INSERT INTO Prestamos (id_usuario, id_libro, fecha_prestamo, fecha_devolucion, estado)
                VALUES (?, ?, ?, ?, ?)
            `;

            connection.query(
                sqlInsert,
                [id_usuario, id_libro, fecha_prestamo, fecha_devolucion || null, estado || 'Prestado'],
                (err, results) => {
                    if (err) {
                        console.error('Error al registrar préstamo:', err);
                        return res.status(500).json({ message: 'Error al guardar el préstamo' });
                    }

                    console.log('Préstamo registrado correctamente');
                    res.status(201).json({
                        message: 'Préstamo guardado exitosamente',
                        idGenerado: results.insertId
                    });
                }
            );
        });
    });
});

app.get('/getPrestamos', (req, res) => {
    const sql = `
        SELECT 
            p.id_prestamo,
            p.id_usuario,
            u.nombre AS nombre_usuario,
            p.id_libro,
            l.titulo AS titulo_libro,
            p.fecha_prestamo,
            p.fecha_devolucion,
            p.estado
        FROM Prestamos p
        INNER JOIN Usuarios u ON p.id_usuario = u.id_usuario
        INNER JOIN Libros l ON p.id_libro = l.id_libro
        ORDER BY p.id_prestamo DESC
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener préstamos:", err);
            return res.status(500).json({ message: "Error al obtener préstamos" });
        }

        res.json(results);
    });
});

