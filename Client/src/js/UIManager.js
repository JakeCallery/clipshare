import l from 'jac/logger/Logger';
import DOMUtils from 'jac/utils/DOMUtils';
import EventUtils from 'jac/utils/EventUtils';
import EventDispatcher from 'jac/events/EventDispatcher';
import GlobalEventBus from 'jac/events/GlobalEventBus';
import JacEvent from 'jac/events/JacEvent';
import BlobUtils from 'jac/utils/BlobUtils';

class UIManager extends EventDispatcher {
    constructor($doc) {
        super();

        this.geb = new GlobalEventBus();
        this.doc = $doc;
    }

    init() {
        l.debug('UI Manager Init');
        let self = this;

        //DOM Elements
        self.sendPingButton = this.doc.getElementById('sendPingButton');
        self.sendImageButton = this.doc.getElementById('sendImageButton');
        self.pasteCanvas = this.doc.getElementById('pasteCanvas');
        self.pasteCanvasCtx = pasteCanvas.getContext('2d');
        self.pasteCanvas.width = 200;
        self.pasteCanvas.height = 200;

        //Delegates
        self.sendPingClickDelegate = EventUtils.bind(self, self.handleSendPingClick);
        self.sendImageClickDelegate = EventUtils.bind(self, self.handleSendImageClick);
        self.pastedImageDelegate = EventUtils.bind(self, self.handlePastedImage);
        self.newBase64DataDelegate = EventUtils.bind(self, self.handleNewBase64Image);

        //Events
        self.sendPingButton.addEventListener('click', self.sendPingClickDelegate);
        self.sendImageButton.addEventListener('click', self.sendImageClickDelegate);
        self.geb.addEventListener('pastedimage', self.pastedImageDelegate);
        self.geb.addEventListener('newimagebase64data', self.newBase64DataDelegate);
    }

    handleNewBase64Image($evt){
        l.debug('Caught new base 64 data');
        let self = this;
        let img = new Image();
        img.addEventListener('load', () => {
            l.debug('Image Loaded');
            self.pasteCanvas.width = img.width;
            self.pasteCanvas.height = img.height;
            self.pasteCanvasCtx.clearRect(0,0, self.pasteCanvas.width, self.pasteCanvas.height);
            self.pasteCanvasCtx.drawImage(img, 0,0);
        });
        l.debug('Loading Image');
        img.src = $evt.data;
    }

    handlePastedImage($evt){
        let self = this;
        let img = $evt.data;
        if(!img.complete){
            l.debug('Image not yet loaded, waiting...');

            img.onload = () => {
                l.debug('pasted image loaded');

                l.debug('Canvas: ', self.pasteCanvas.width, self.pasteCanvas.height);
                l.debug('Img: ', img.width, img.height);

                self.pasteCanvas.width = img.width;
                self.pasteCanvas.height = img.height;

                l.debug('Canvas: ', self.pasteCanvas.width, self.pasteCanvas.height);

                self.pasteCanvasCtx.clearRect(0,0, self.pasteCanvas.width, self.pasteCanvas.height);
                self.pasteCanvasCtx.drawImage(img, 0,0);

            };

        }
    };

    handleSendImageClick($evt){
        l.debug('caught send image click');
        this.geb.dispatchEvent(new JacEvent('requestsendimage', this.pasteCanvas.toDataURL('image/png')));
    }

    handleSendPingClick($evt){
        l.debug('Caught Send Button Click');
        this.geb.dispatchEvent(new JacEvent('requestsendstring', 'ping'));
    }
}

export default UIManager;
