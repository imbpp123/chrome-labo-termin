describe('TerminDom', function () {
    describe('getInputValue', function () {
        beforeEach(function() {
            let input = document.createElement("input")
            input.id = 'testInput'
            input.type = "hidden"
            input.value = "ok"
            document.body.appendChild(input)
        });

        afterEach(function() {
            var input = document.getElementById('testInput');
            input.parentNode.removeChild(input);
        });

        it('should throw exception if element is not found', function () {
            let scrapper = new TerminDom()
            assert.throws(() => scrapper.getInputValue("#wrong"), DOMException)
        })

        it('should return value of input if element is found', function () {
            let scrapper = new TerminDom()
            assert.equal('ok', scrapper.getInputValue("#testInput"))
        })
    })

    describe('clickElement', function () {
        let clickElementCount = 0

        beforeEach(function() {
            let button = document.createElement("button")
            button.id = 'testButton'
            button.addEventListener('click', function (event) {
                clickElementCount++;
                event.preventDefault();
            }, false);

            document.body.appendChild(button)
            clickElementCount = 0
        });

        afterEach(function() {
            var button = document.getElementById('testButton');
            button.parentNode.removeChild(button);
        });

        it('should throw Error if element is not found', function () {
            let scrapper = new TerminDom()
            assert.throws(() => scrapper.clickElement('#wrongSelector'), DOMException)
        })

        it('should click element', function () {
            let scrapper = new TerminDom()
            scrapper.clickElement('#testButton')
            assert.equal(1, clickElementCount)
        })
    })
})