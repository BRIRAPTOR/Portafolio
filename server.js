const express = require('express');
const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');
require('dotenv').config();

const app = express();

// Middleware para parsear los datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Ruta para procesar el formulario de contacto
app.post('/enviar', (req, res) => {
    const { nombre, email, mensaje } = req.body;
    const destinatario = 'briraptor21@gmail.com';

    // Validación de datos
    if (!nombre || !email || !mensaje) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    // Validar email con expresión regular
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('El email no es válido');
    }

    // Limitar la longitud de los campos
    if (nombre.length > 50 || mensaje.length > 1000) {
        return res.status(400).send('Los campos exceden el límite de longitud');
    }

    // Sanitizar el mensaje para eliminar cualquier etiqueta HTML y JavaScript
    const sanitizedMessage = sanitizeHtml(mensaje, {
        allowedTags: [],  // No permitir ninguna etiqueta HTML
        allowedAttributes: {} // No permitir ningún atributo
    });

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
        text: `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${sanitizedMessage}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).send('Error al procesar tu solicitud. Intenta nuevamente más tarde.');
        } else {
            console.log('Email enviado:', info.response);
            return res.status(200).send('¡Mensaje enviado con éxito!');
        }
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
