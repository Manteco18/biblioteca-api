
CREATE DATABASE Gestión_de_Biblioteca;


USE Gestión_de_Biblioteca;


CREATE TABLE Libros (
    id_libro INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(150),
    anio_publicacion INT,
    categoria VARCHAR(100),
    cantidad_disponible INT NOT NULL
);


CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    telefono VARCHAR(20)
);


CREATE TABLE Prestamos (
    id_prestamo INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_libro INT NOT NULL,
    fecha_prestamo DATE NOT NULL,
    fecha_devolucion DATE,
    estado VARCHAR(20) DEFAULT 'Prestado',
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_libro) REFERENCES Libros(id_libro)
);

select * from Libros;
