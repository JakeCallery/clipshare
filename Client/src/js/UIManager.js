import l from 'jac/logger/Logger';
import DOMUtils from 'jac/utils/DOMUtils';
import EventUtils from 'jac/utils/EventUtils';
import EventDispatcher from 'jac/events/EventDispatcher';
import GlobalEventBus from 'jac/events/GlobalEventBus';
import JacEvent from 'jac/events/JacEvent';

class UIManager extends EventDispatcher {
    constructor($doc) {
        super();

        this.geb = new GlobalEventBus();
        this.doc = $doc;
    }

    init() {
        l.debug('UI Manager Init');

        //DOM Elements
        this.sendButton = this.doc.getElementById('sendButton');

        //Delegates
        let self = this;
        this.sendButtonClickDelegate = EventUtils.bind(self, self.handleSendButtonClick);

        //Events
        this.sendButton.addEventListener('click', self.sendButtonClickDelegate);
    }

    handleSendButtonClick($evt){
        l.debug('Caught Send Button Click');
        this.geb.dispatchEvent(new JacEvent('requestsend', 'ping'));
    }
}

export default UIManager;
