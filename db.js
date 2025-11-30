const mysql = require('mysql2');
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'roote',
        database: 'Gestión_de_Biblioteca'
    }
);

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = connection;