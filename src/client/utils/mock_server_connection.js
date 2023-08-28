// stub import for file-loader
import {} from '../../../../kb/firmware/layermaps/layermaps.c';

class MockServerConnection {
    constructor(callbacks) {
        for (const event of ['connect', 'disconnect', 'layermaps.c', 'progress']) {
            this[event] = callbacks[event];
        }

        setTimeout(callbacks['connect'], 0);
        fetch('layermaps.c').then(r => r.text()).then(layermaps_contents => callbacks['layermaps.c'](layermaps_contents));
    }

    cancelFlash() {
        // noop
    }

    sendLayermaps() {
        let callbacks = this;
        setTimeout(() => {
            callbacks['progress']({ op: 'make', during: '', traceback: {} });
        }, 0);
        setTimeout(() => {
            callbacks['progress']({ op: 'flash', during: '', traceback: {} });
        }, 1500);
        setTimeout(() => {
            callbacks['progress']({ op: 'error', during: 'make', traceback: {
                stderr: 'Serverside operations are disabled for this live demo. '
                    + 'For full functionality, clone the project on Gitlab and try it locally!'
            }});
        }, 2500);
    }
}

export default MockServerConnection;
