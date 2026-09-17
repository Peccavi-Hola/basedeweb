-- Proyecto de ejemplo
CREATE DATABASE IF NOT EXISTS portafolio_bd;
USE portafolio_bd;

CREATE TABLE unidades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  semanas INT NOT NULL DEFAULT 4
);

INSERT INTO unidades (nombre, semanas) VALUES
('Fundamentos de Base de Datos', 4),
('Diseño y Modelado de Bases de Datos', 4),
('Lenguaje SQL y Gestión de Datos', 4),
('Implementación y Administración', 4);

SELECT * FROM unidades;
