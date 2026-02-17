import { useCallback, useEffect, useRef, useState } from "react"
import type { Translation, TranslationError } from "../types"
import { io, type Socket } from "socket.io-client"


const SERVER_URL = 'http://localhost:3001'

export function useSocket() {
    const socketRef = useRef<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [translations, setTranslations] = useState<Translation[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const socket = io(SERVER_URL)

        socketRef.current = socket


        socket.on('connect', () => {
            setIsConnected(true)
            setError(null)
        })

        socket.on('disconnect', () => {
            setIsConnected(false)
        })

        socket.on('connect_error', () => {
            setError('Error with connecting to socket server!')
            setIsConnected(false)
        })

        socket.on('translation', (data: Translation) => {
            setTranslations((prev) => [...prev, data])
        })

        socket.on('translation_error', (data: TranslationError) => {
            setError(data.message)
        })

        return() => {
            socket.disconnect()
        }
    }, [])



    const sendForTranslation = useCallback(
        (text: string, targetLang: string) => {
            if(socketRef.current?.connected){
                socketRef.current.emit('translate', {text, targetLang})
            }
        } ,[]) 

    const clearTranslations = useCallback(() => {
        setTranslations([])
    }, [])


    return {
        isConnected,
        translations,
        error,
        sendForTranslation,
        clearTranslations
    }
}