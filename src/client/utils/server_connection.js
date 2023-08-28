import io from 'socket.io-client';

class ServerConnection {
    constructor(callbacks) {
        this.socket = io.connect();

        for (const event of ['connect', 'disconnect', 'layermaps.c', 'progress']) {
            this.socket.on(event, callbacks[event]);
        }
    }

    cancelFlash() {
        this.socket.emit('cancel_flash');
    }

    sendLayermaps(data) {
        this.socket.emit('layermaps.c', data);
    }
}

export default ServerConnection;
