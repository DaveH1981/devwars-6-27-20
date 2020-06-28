const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const squares = [
    ...$$('.topRow .square'),
    ...$$('.rightRow .square'),
    ...$$('.bottomRow .square').reverse(),
    ...$$('.leftRow .square').reverse(),
];
const corners = [
    squares[4],
    squares[7],
    squares[12],
    squares[15],
];

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

class Token {
    constructor(location, rollsDisplay, tokenHTML) {
        this.rolls = 3;
        this.rollsDisplay = rollsDisplay;
        this.updateRollDisplay();

        this.location = location
        this.tokenHTML = tokenHTML;
        this.location.innerHTML += this.tokenHTML;

        this.won = false;
    }

    updateRollDisplay() {
        if (!this.rollsDisplay) return;
        this.rollsDisplay.textContent = this.rolls;
    }

    async roll(squares) {
        this.rolls--;

        const dist = Math.floor(Math.random() * 6) + 1;
        const fromIndex = squares.indexOf(this.location);
        const toIndex = (fromIndex + dist) % squares.length;


        let current = fromIndex;
        while (current != toIndex) {
            current = (current + 1) % squares.length;
            await delay(100)
            this.location.innerHTML = this.location.innerHTML.replace(this.tokenHTML, '');
            this.location = squares[current];
            this.location.innerHTML += this.tokenHTML;
        }


        if (corners.includes(this.location)) this.rolls++;

        this.updateRollDisplay();

        this.won = toIndex < fromIndex;
        console.log(this.won, toIndex, fromIndex)
        if (this.won) this.rolls = 0;

        return this.alive();
    }

    alive() {
        return this.rolls != 0;
    }

    reset(squares) {
        this.rolls = 3;
        this.updateRollDisplay();

        if (this.location) this.location.innerHTML = this.location.innerHTML.replace(this.tokenHTML, '');
        this.location = squares[0];
        this.location.innerHTML += this.tokenHTML;

        this.won = false;
    }
}

const player = new Token(squares[0], $('.rollCounterContainer'), '<i class="player fas fa-coin"></i>');
const cpu = new Token(squares[0], null, '<i class="cpu fas fa-coin"></i>');


const fullRoll = async (token, name) => {
    if (!token.alive()) return false;
    if (await token.roll(squares)) return false;


    return token.won;

    // <3 <3 <3 <3 <3
}

$('.rollButton').addEventListener('click', async () => {
    $('.fa-dice').classList.add('spin')
    setTimeout(() => $('.fa-dice').classList.remove('spin'), 1500);
    if (await fullRoll(player, 'You')) return alert('You won!') || reset(cpu);
    if (await fullRoll(cpu, 'CPU')) return alert('CPU won!') || reset(player);
    if (cpu.alive() || player.alive()) return
    alert('Everybody lost...');
    reset(cpu);
    reset(player);
})


const reset = (token) => {
    token.reset(squares)
    return true
}
