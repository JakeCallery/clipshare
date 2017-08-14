import l from 'jac/logger/Logger';
import DOMUtils from 'jac/utils/DOMUtils';
import EventUtils from 'jac/utils/EventUtils';
import EventDispatcher from 'jac/events/EventDispatcher';
import GlobalEventBus from 'jac/events/GlobalEventBus';
import JacEvent from 'jac/events/JacEvent';

class WSManager extends EventDispatcher {
    constructor($doc) {
        super();

        this.geb = new GlobalEventBus();
        this.doc = $doc;
        this.connect = undefined;
        let self = this;

        //Delegates
        this.sendRequestDelegate = EventUtils.bind(self, self.handleSendRequest);

        //Events
        this.geb.addEventListener('requestsend', self.sendRequestDelegate);
    }

    init() {
        l.debug('WS Manager Init');
        let self = this;

        let host = window.document.location.host.replace(/:.*/, '');
        self.connection = new WebSocket('ws://' + host + ':8888');

        self.connection.onopen = () => {
            //this.connection.send('Ping');
            l.debug('Websocket Connected');
        };

        self.connection.onerror = ($err) => {
            l.error('WebSocket error: ', $err);
        };

        self.connection.onmessage = ($evt) => {
            l.debug('Caught Message from Server: ', $evt.data);
        };

    }

    handleSendRequest($evt) {
        l.debug('Sending ', $evt.data);
        this.connection.send($evt.data);
    }
}

export default WSManager;