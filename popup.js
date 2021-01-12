class TerminPopupController {
    constructor() {
        this.buttonStart = document.getElementById('button_start')
        this.buttonStop = document.getElementById('button_stop')
        this.addListeners()
    }

    addListeners() {
        this.buttonStart.addEventListener('click', this.startTerminSearch.bind(this))
        this.buttonStop.addEventListener('click', this.stopTerminSearch.bind(this))
    }

    startTerminSearch() {     
        this.sendMessage({laboStartSearch: true});
    }

    stopTerminSearch() {
        this.sendMessage({laboStartSearch: false});
    }

    sendMessage(message) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message);
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    window.dextLaboPopupController = new TerminPopupController();
});
