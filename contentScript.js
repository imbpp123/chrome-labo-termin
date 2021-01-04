(function(){
    const STATE_SEARCH_FORWARD = 'search_forward'
    const STATE_SEARCH_BACKWARD = 'search_backward'
    const TERMIN_SEARCH_TIMEOUT = 5000

    let maxMonthCount = 3

    let selectorMonthBefore = 'a#labbevoreMonth'
    let selectorMonthNext = 'a#labnextMonth'

    let selectorInputMonth = 'input#month'
    let selectorInputYear = 'input#year'

    function clickMonthButton(selector) {
        let button = document.querySelector(selector)
        if (!button) {
            throw 'Button is not found: ' + selector
        }
        button.click()
    }

    function getInputValue(selector) {
        let input = document.querySelector(selector)
        if (!input) {
            throw 'Input is not found: ' + selector
        }
        return input.value
    }

    function getCurrentDateNumber() {
        const currentDate = new Date()
        return parseInt('' + currentDate.getFullYear() + currentDate.getMonth())
    }

    function getPageDateNumber() {       
        const months = {
            'January'   : 0,
            'February'  : 1,
            'March'     : 2,
            'April'     : 3,
            'May'       : 4,
            'June'      : 5,
            'July'      : 6,
            'August'    : 7,
            'September' : 8,
            'October'   : 9,
            'November'  : 10,
            'December'  : 11
        }       
        return parseInt('' + getInputValue(selectorInputYear) + months[getInputValue(selectorInputMonth)])
    }

    function processState() {
        try {
            let pageDate = getPageDateNumber()
            let currentDate = getCurrentDateNumber()

            console.debug('Process state', {
                'state' : localStorage.laboTerminState, 
                'pageDate' : pageDate, 
                'currentDate' : currentDate
            })

            switch (localStorage.laboTerminState) {
                case STATE_SEARCH_BACKWARD:
                    if (pageDate > currentDate) {
                        clickMonthButton(selectorMonthBefore) 

                        console.debug('Button click', {'button' : selectorMonthBefore})
                    } else {
                        localStorage.laboTerminState = STATE_SEARCH_FORWARD
                        
                        console.debug('State changed', {
                            'state' : localStorage.laboTerminState, 
                            'pageDate' : pageDate, 
                            'currentDate' : currentDate
                        })
                    } 
                    break

                case STATE_SEARCH_FORWARD:
                    if (pageDate <= currentDate + maxMonthCount) {
                        clickMonthButton(selectorMonthNext)
                        
                        console.debug('Button click', {'button' : selectorMonthNext})
                    } else {
                        localStorage.laboTerminState = STATE_SEARCH_BACKWARD
                        
                        console.debug('State changed', {
                            'state' : localStorage.laboTerminState, 
                            'pageDate' : pageDate, 
                            'currentDate' : currentDate
                        })
                    }
                    break
                
                default:
                    localStorage.laboTerminState = STATE_SEARCH_FORWARD
                    console.debug('State changed', {
                        'state' : localStorage.laboTerminState, 
                        'pageDate' : pageDate, 
                        'currentDate' : currentDate
                    })
                    break
            }
        } catch(e) {
            console.debug(e)
        }
    }
    setInterval(processState, TERMIN_SEARCH_TIMEOUT)
})();