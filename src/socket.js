import Vue from 'vue'

const socket = new WebSocket('ws://echo.websocket.org')

const emitter = new Vue({
    methods: {
        send (message) {
            if (socket.readyState === 1) {
                socket.send(message);
            }
        }
    }
})

socket.onmessage = function (response) {
    emitter.$emit('message', response.data);
}
socket.onerror = function (error) {
    emitter.$emit('error', error);
}

export default emitter