class TerminDom {
    getInputValue(selector) {
        let input = document.querySelector(selector)
        if (!input) {
            throw new DOMException('Input is not found: ' + selector)
        }
        return input.value
    }

    clickElement(selector) {
        let element = document.querySelector(selector)
        if (!element) {
            throw new DOMException('Element is not found: ' + selector)
        }
        element.click()
    }

    getAvailableDateTime(selector) {
        return document.querySelectorAll(selector)
    }
}

class LaboTerminPage {
    constructor(dom) {
        this.dom = dom

        this.selectors = {
            availableDay: 'div.CELL > a[link="1"] > input',
            inputYear: 'input#year',
            inputMonth: 'input#month',
            monthBefore: 'a#labbevoreMonth',
            monthNext: 'a#labnextMonth'
        }
    }

    getPageTimestamp() {       
        return Date.parse(
            '01 ' + 
            this.dom.getInputValue(this.selectors.inputMonth) + ' ' +
            this.dom.getInputValue(this.selectors.inputYear)
        )
    }

    getMonthTimestamp(monthsToAdd) {
        const currentDate = new Date()
        return (new Date(currentDate.getFullYear(), currentDate.getMonth() + monthsToAdd, 1)).getTime()
    }

    isDateTimeAvailable() {
        return this.dom.getAvailableDateTime(this.availableDay).length > 0
    }

    openNextMonth() {
        this.dom.clickElement(this.selectors.monthNext)
    }

    openPreviousMonth() {
        this.dom.clickElement(this.selectors.monthBefore)
    }
}

class LaboStatemachine {
    constructor(terminPage, maxMonthCount) {
        this.terminPage = terminPage
        this.maxMonthCount = maxMonthCount

        this.STATE_NEXT_MONTH = 'next_month'
        this.STATE_PREV_MONTH = 'prev_month'
        this.STATE_TERMIN_FOUND = 'termin_found'
    }

    getState() {
        if (localStorage.laboTerminState == null) {
            localStorage.laboTerminState = this.STATE_NEXT_MONTH
        }
        return localStorage.laboTerminState
    }

    setState(state) {
        localStorage.laboTerminState = state
    }

    run() {
        try {
            let pageDate = this.terminPage.getPageTimestamp()
            let startMonthTimestamp = this.terminPage.getMonthTimestamp(0)
            let stopMonthTimestamp = this.terminPage.getMonthTimestamp(this.maxMonthCount)

            console.debug('Process state', {
                'state' : this.getState()
            })

            switch (this.getState()) {
                case this.STATE_PREV_MONTH:
                    if (startMonthTimestamp < pageDate) {
                        this.terminPage.openPreviousMonth()
                    }
                    if (this.terminPage.isDateTimeAvailable()) {
                        this.setState(this.STATE_TERMIN_FOUND)
                    } else if (startMonthTimestamp >= pageDate) {
                        this.setState(this.STATE_NEXT_MONTH)
                    }
                    break

                case this.STATE_NEXT_MONTH:
                    if (pageDate < stopMonthTimestamp) {
                        this.terminPage.openNextMonth()
                    }
                    if (this.terminPage.isDateTimeAvailable()) {
                        this.setState(this.STATE_TERMIN_FOUND)
                    } else if (pageDate >= stopMonthTimestamp) {
                        this.setState(this.STATE_PREV_MONTH)
                    }
                    break

                case this.STATE_TERMIN_FOUND:
                    // alarm!
                    alert('I found termin!')
                    break

                default:
                    this.setState(null)
                    break
            }
        } catch (e) {
            console.debug(e)
        }
    }
}

(function() {
    let dom = new TerminDom()
    let page = new LaboTerminPage(dom)
    let statemachine = new LaboStatemachine(page, 6)
    let timeoutHandle = null

    function startSearch() {
        if (timeoutHandle) { return }
        timeoutHandle = setInterval(statemachine.run.bind(statemachine), 5000)
    }

    function stopSearch() {
        if (!timeoutHandle) { return }
        clearInterval(timeoutHandle)
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (!"laboStartSearch" in request) { return true; }
        
        localStorage.laboMachineEnabled = request.laboStartSearch

        if (request.laboStartSearch) {
            startSearch()
        } else {
            stopSearch()
        }
    })

    if (localStorage.laboMachineEnabled) {
        startSearch()
    }
})()
