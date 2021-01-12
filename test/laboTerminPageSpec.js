describe('LaboTerminPage', function () {
    let page = null 
    let mockScrapper = null

    beforeEach(function () {
        mockScrapper = new TerminDom()
        page = new LaboTerminPage(mockScrapper)
    })

    afterEach(function () {
        page = null 
        mockScrapper = null
    })

    describe('getYearMonthInt', ()  => {
        it('should return integer', () => {
            let stub = sinon.stub(mockScrapper, 'getInputValue').callsFake(function (selector) {
                if (selector == 'month') { return 'March' }
                if (selector == 'year') { return '2020' }
                return 999
            })
            page.selectors.inputYear = 'year'
            page.selectors.inputMonth = 'month'

            assert.equal(20202, page.getYearMonthInt())

            stub.restore()
        })
    })

    describe('getCurrentDateInt', () => {
        it('should return integer', () => {
            let curDate = new Date()
            assert.equal(
                parseInt('' + curDate.getFullYear() + curDate.getMonth()), 
                page.getCurrentDateInt()
            )
        })
    })

    describe('isDateTimeAvailable', () => {
        it('should return false if there is no available time', function () {
            let stub = sinon.stub(mockScrapper, 'getAvailableDateTime').callsFake(function (selector) {
                return []
            })

            assert.isNotOk(page.isDateTimeAvailable())
        })
        it('should return true if there is available time', function () {
            let stub = sinon.stub(mockScrapper, 'getAvailableDateTime').callsFake(function (selector) {
                return ['have_date']
            })

            assert.isOk(page.isDateTimeAvailable())
        })
    })
})