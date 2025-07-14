import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"

export const webSocketBe = () => {
    const socketURL = "http://localhost:8080/ws"
    const client = new Client({
        webSocketFactory: () => new SockJS(socketURL),
        heartbeatIncoming: 5000,
        heartbeatOutgoing: 5000,
        reconnectDelay: 5000,
        debug: (d) => {
            console.debug("STOMP debug", d)
        }
    })

    return client
}