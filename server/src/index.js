const express = require('express')
const { createServer } = require("node:http")
const { Server } = require('socket.io')


const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
        methods: ['GET', 'POST']
    }
})


function mockTranslate(text, targetLang) {

    return new Promise((resolve) => {
        const delay = Math.floor(Math.random() * 500) + 300

        setTimeout(() => {
            const translations = {
                uz: {
                    hello: "Salom",
                    name: "Ism",
                    goodbye: "Xayr",
                    welcome: "Xush kelibsiz",
                    save: "Saqlash",
                    cancel: "Bekor qilish",
                    yes: "Ha",
                    no: "Yo'q"
                },
                es: {
                    hello: "Hola",
                    name: "Nombre",
                    goodbye: "Adiós",
                    welcome: "Bienvenido",
                    save: "Guardar",
                    cancel: "Cancelar",
                    yes: "Sí",
                    no: "No"
                },
                fr: {
                    hello: "Bonjour",
                    name: "Nom",
                    goodbye: "Au revoir",
                    welcome: "Bienvenue",
                    save: "Enregistrer",
                    cancel: "Annuler",
                    yes: "Oui",
                    no: "Non"
                }
            };

            const lowerText = text.toLowerCase().trim()
            const langMap = translations[targetLang]

            if (langMap && langMap[lowerText]){
                resolve(langMap[lowerText])
            } else {
                resolve(`[${targetLang.toUpperCase()}] ${text}`)
            }
        }, delay)
    })
}


io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);


    socket.on('translate', async(data) => {

        try {
            const translation = await mockTranslate(data.text, data.targetLang)

            socket.emit('translation', {
                id: Date.now().toString(),
                origin: data.text,
                translation,
                targetLang: data.targetLang,
                timestamp: new Date().toISOString()
            })

            console.log('Sent', translation)
        } catch (error) {
            socket.emit('translation_error', {
                message: 'Translation failed',
                origin: data.text
            })
        }
    })


    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    })

})


const PORT = 3001
httpServer.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})