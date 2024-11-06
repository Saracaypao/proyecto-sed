const mongoose = require('mongoose');

const dbConnection = async () => {
    const mongoURI = process.env.MONGO_URL;  // Obtener la URL de la base de datos desde las variables de entorno

    if (!mongoURI) {
        throw new Error('MONGO_URL no está definida en el archivo .env');
    }

    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
        throw new Error('Error al conectar a la base de datos');
    }
};

module.exports = { dbConnection };
