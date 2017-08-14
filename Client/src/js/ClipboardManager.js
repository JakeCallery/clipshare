import l from 'jac/logger/Logger';
import DOMUtils from 'jac/utils/DOMUtils';
import EventUtils from 'jac/utils/EventUtils';
import EventDispatcher from 'jac/events/EventDispatcher';
import GlobalEventBus from 'jac/events/GlobalEventBus';
import JacEvent from 'jac/events/JacEvent';

class ClipboardManager extends EventDispatcher {
    constructor($window, $document) {
        super();

        this.win = $window;
        this.doc = $document;
        this.geb = new GlobalEventBus();
    }

    init() {
        l.debug('ClipboardManager Init');
        let self = this;

        //Delegates
        this.pasteDelegate = EventUtils.bind(self, self.handlePaste);

        this.doc.addEventListener('paste', self.pasteDelegate);
    }

    handlePaste($evt) {
        l.debug('Caught Paste');
        $evt.preventDefault();

        if($evt.clipboardData) {
            let clipItems = $evt.clipboardData.items;

            if(clipItems) {
                l.debug('Num Clipboard Items: ', clipItems.length);
                for(let i = 0; i < clipItems.length; i++){
                    let item = clipItems[i];
                    l.debug('[' + i + '] Types: ', item.type);
                    if(item.type.indexOf('image') !== -1) {
                        l.debug('Found an image to paste');

                        //handle image
                        let blob = item.getAsFile();
                        let urlObj = this.win.URL;
                        let source = urlObj.createObjectURL(blob);

                        let img = new Image();
                        img.src = source;
                        this.geb.dispatchEvent(new JacEvent('pastedimage', img));
                    }
                }
            } else {
                l.error('No Clipboard Items');
                return;
            }
        } else {
            l.error('No clipboard data');
        }
    };
}

export default ClipboardManager;