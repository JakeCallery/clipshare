import l from 'jac/logger/Logger';
import DOMUtils from 'jac/utils/DOMUtils';
import EventUtils from 'jac/utils/EventUtils';
import EventDispatcher from 'jac/events/EventDispatcher';
import GlobalEventBus from 'jac/events/GlobalEventBus';
import JacEvent from 'jac/events/JacEvent';

class WSManager extends EventDispatcher {
    constructor() {
        super();

        this.geb = new GlobalEventBus();

        this.connect = undefined;
    }

    init() {
        l.debug('WS Manager Init');
        let self = this;

        this.connection = new WebSocket('ws://192.168.1.95:8888');

        this.connection.onopen = () => {
            this.connection.send('Ping');
        };

        this.connection.onerror = ($err) => {
            l.error('WebSocket error: ', $err);
        };

        this.connection.onmessage = ($evt) => {
            l.debug('Caught Message from Server: ', $evt.data);
        };

    }
}

export default WSManager;