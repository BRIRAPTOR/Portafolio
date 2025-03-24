const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Middleware para parsear los datos del formulario
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Servir archivos estáticos (HTML, CSS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para mostrar el sitio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para procesar el formulario de contacto
app.post('/enviar', (req, res) => {
    const { nombre, email, mensaje } = req.body;
    const destinatario = 'briraptor21@gmail.com';

    // Configuración del transporter (ejemplo con Gmail)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'brianhazel.mail@gmail.com',
            pass: process.env.PASS
        }
    });

    const mailOptions = {
        from: email,
        to: destinatario,
        subject: 'Nuevo mensaje de contacto - Portafolio',
        text: `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.send('Error al enviar el mensaje. Por favor intenta nuevamente.');
        } else {
            console.log('Email enviado: ' + info.response);
            res.send('¡Mensaje enviado con éxito!');
        }
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
