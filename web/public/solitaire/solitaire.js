const suits = ['s', 'h', 'c', 'd'];
const values = ['A', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K']

let deck, pile, draw, stacks, aces, winner, clickedCard, firstClickDest, firstStackId, 
cardArr, secondsPlayed, counter, boardScore, totalScore, drawCycles, clickCount, isPaused;


const boardEls = {
    pile: document.getElementById('pile'),
    draw: document.getElementById('draw'),
    ace1: document.getElementById('ace1'),
    ace2: document.getElementById('ace2'),
    ace3: document.getElementById('ace3'),
    ace4: document.getElementById('ace4'),
    stack1: document.getElementById('stack1'),
    stack2: document.getElementById('stack2'),
    stack3: document.getElementById('stack3'),
    stack4: document.getElementById('stack4'),
    stack5: document.getElementById('stack5'),
    stack6: document.getElementById('stack6'),
    stack7: document.getElementById('stack7')
}

const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const playPauseEl = document.getElementById("play-pause");

document.querySelector('body').addEventListener('click', handleClick);

init();

function init() {
    stopTimer();
    playPauseEl.classList.remove('play');
    playPauseEl.classList.add('pause');
    clickCount = 0;
    deck = [];
    pile = [];
    draw = [];
    cardArr = [];
    stacks = [[],[],[],[],[],[],[]]
    stacksFaceUp = [1,1,1,1,1,1,1]
    aces = [[],[],[],[]]
    winner = null;
    clickedCard = null;
    secondsPlayed = null;
    counter = null;
    boardScore = 0;
    totalScore = 0;
    drawCycles = 0;
    isPaused = false;
    makeDeck();
    shuffleDeck();
    dealCards();
    render();
}

function render() {
    clearAllDivs();
    renderStacks();
    renderPile();
    renderDraw();
    renderAces();
    getScore();
    updateScore();
    if(checkWinner()) {
        clearInterval(counter);
        document.querySelector('h1').textContent = 'You Win!';
    }
}

function renderStacks() {
    let count, backs;

    stacks.forEach((stack, sIdx) => {
        count = 0;
        backs = 0;
        stackList = document.createElement('ul');
        stack.forEach((card, cIdx) => {
            let cardEl = document.createElement('li');
            cardEl.className = `card back ${card.suit}${card.value}`
            let faceUp = stacksFaceUp[sIdx];
            while(faceUp > 0){
                if(cIdx === stack.length - faceUp) {
                    cardEl.className = cardEl.className.replace(' back', '');
                }
                faceUp--;
            }

            if (cardEl.className.includes('back')){
                cardEl.style = `position: absolute; left: -7px; top: ${-7 + (cIdx * 12)}px;`;
                backs++;
            } else {
                if (count === 0) {
                    cardEl.style = `position: absolute; left: -7px;  top: ${-7 + (cIdx * 12)}px;`
                    count++
                } else {
                    cardEl.style = `position: absolute; left: -7px;  top: ${-7 + (cIdx * 12)+(9 * (cIdx-backs))}px;`
                }
            }
            stackList.appendChild(cardEl);
         })
         boardEls[`stack${sIdx +1}`].appendChild(stackList);
      })
}

function renderPile() {
   pileList = document.createElement('ul');
    pile.forEach((card, cIdx) => {
        let cardEl = document.createElement('li');
        cardEl.className = `card back ${card.suit}${card.value}`
        cardEl.style = `position: absolute; left: -7px; top: ${-7 + (cIdx*-.5)}px;`
        pileList.appendChild(cardEl);
      }); 
      boardEls.pile.appendChild(pileList);
}
function renderDraw() {
   drawList = document.createElement('ul');
    draw.forEach((card, cIdx) => {
        let cardEl = document.createElement('li');
        cardEl.className = `card ${card.suit}${card.value}`
        cardEl.style = `position: absolute; left: -7px; top: ${-7 + (cIdx*-.5)}px;`
        drawList.appendChild(cardEl);
      });
      boardEls.draw.appendChild(drawList);
}

function renderAces() {
   aces.forEach((stack, sIdx) => {
       acesList = document.createElement('ul');
        stack.forEach((card, cIdx) => {
            let cardEl = document.createElement('li');
            cardEl.className = `card ${card.suit}${card.value}`
            cardEl.style = `position: absolute; left: -7px; top: ${-7 + (cIdx*-.5)}px;`
            acesList.appendChild(cardEl);
         });
         boardEls[`ace${sIdx +1}`].appendChild(acesList);
      });

}

function checkWinner() {
    for (let i = 0; i < aces.length; i++) {
        if (aces[i].length < 13) {
            return false;
        }
    }
    return true;
}

function makeDeck() {
    suits.forEach(suit => {
        values.forEach(value => {
            let card = {value: value, suit: suit};
            deck.push(card);
        });
    });
}

function shuffleDeck() {
    deck = deck.sort(()=> Math.random() -.5);
}
                             
function dealCards() {
    stacks.forEach((stack, idx) => {
        for (let i = 0; i < idx +1; i++)
        stack.unshift(deck.shift());
    });
    deck.forEach(card =>{
        pile.push(card);
    });              
}

function getScore() {
    totalScore = 0;
    aces.forEach(pile => {
        pile.forEach(card => {
            totalScore+=10;
        })
    });
    totalScore += boardScore;
}

function updateScore() {
    let displayScore = totalScore;
    if (displayScore < 0) displayScore = 0;
    scoreEl.textContent = `Score - ${displayScore}`
}

function clearAllDivs() {
    for(let boardEl in boardEls) {
        while(boardEls[boardEl].firstChild) {
            boardEls[boardEl].removeChild(boardEls[boardEl].firstChild);
        }
    }
}

function isDoubleClick() {
    clickCount++;
    if (clickCount === 1) {
        singleClickTimer = setTimeout(function() {
        clickCount = 0;
        return false;
        }, 300);
    } else if (clickCount === 2) {
        clearTimeout(singleClickTimer);
        clickCount = 0;
        return true;
    }
}

function handleClick(evt) {

    let clickDest = getClickDestination(evt.target);
   //  start the timer on user's first click
    if(!counter && clickDest !== 'resetButton') {
        startTimer();
    }

    if (clickDest.includes('stack')) {
        isDoubleClick() ? handleStackDoubleClick(evt.target) : handleStackClick(evt.target);
    } else if (clickDest.includes('ace')) {

        handleAceClick(evt.target);
    } else if (clickDest === 'draw') {
        isDoubleClick() ? handleStackDoubleClick(evt.target) :handleDrawClick(evt.target);
    } else if (clickDest === 'pile') {
        handlePileClick();
    } else if (clickDest === 'resetButton') {
        init();
    }
    else if (clickDest === 'play')
    {
         playGame();
    }
    else if (clickDest === 'pause'){
       pauseGame();
    }
}

function handleStackDoubleClick(element) {
    let stackId = getClickDestination(element).replace('stack', '') -1;
    let clickDest = getClickDestination(element);
    let topCard;

    if(stackId) {
        topCard = stacks[stackId][stacks[stackId].length -1];
    } else { 
        topCard = draw[draw.length -1];
    }

    if (document.querySelector('.highlight')) {
        let highlightEl = document.querySelector('.highlight')
        if (isTheSameCard(highlightEl, clickedCard) && clickDest === getClickDestination(highlightEl)) {
            checkForLegalMove(clickDest);
        }
    } else {
        if (topCard && isFaceUpCard(element)) {
            checkForLegalMove(clickDest)
        }
    }
}

function isTheSameCard(cardEl, cardObj) {
    let card1 = getCardClassFromEl(cardEl);
    let card2 = getCardClassFromObj(cardObj);
    
    return card1 === card2;
}

function getCardClassFromEl(cardEl) {
    let cardClass = cardEl.className.replace('card ', '');
    cardClass = cardClass.replace(' highlight', '');
    return cardClass;
}

function getCardClassFromObj(cardObj) {
    let cardClass = `${cardObj.suit}${cardObj.value}`
    return cardClass;
}

function checkForLegalMove(clickDest) {
    
    let stackIdx = clickDest.replace('stack', '') -1;
    let card = getCardClassFromEl(document.getElementById(clickDest).lastChild);
    let cardObj = getCardObjFromClass(card);
    let acePileTopCardsArr = getAcePileTopCards();
    
    // move a card to the proper place if it's a legal play
    acePileTopCardsArr.forEach((topCardObj, aceIdx) => {
        if (topCardObj.suit === cardObj.suit) {
            if(getCardValue(topCardObj) === getCardValue(cardObj) -1) {
                if(!clickedCard) {
                    moveTopCard(stacks[stackIdx], aces[aceIdx]);
                    stacksFaceUp[stackIdx]--;
                    clickedCard = null;
                    while(cardArr.length > 0) {
                        cardArr.pop();
                    }
                    render();
    
                } else if(clickedCard) {
                    aces[aceIdx].push(clickedCard);
                    clickedCard = null;
                    while(cardArr.length > 0) {
                        cardArr.pop();
                    }
                    render();
                }
            }
        } 
    });

    // move an ace to the first available empty ace pile
    for (let aceIdx = 0; aceIdx < acePileTopCardsArr.length; aceIdx++) {
        if(acePileTopCardsArr[aceIdx] === 0 && getCardValue(cardObj) === 1) {
            
            if(!clickedCard) {
                moveTopCard(stacks[stackIdx], aces[aceIdx]);
                stacksFaceUp[stackIdx]--;
                clickedCard = null;
                while(cardArr.length > 0) {
                    cardArr.pop();
                }
                render();

            } else if(clickedCard) {
                aces[aceIdx].push(clickedCard);
                clickedCard = null;
                while(cardArr.length > 0) {
                    cardArr.pop();
                }
                render();
            }
            break;
        }
    }
}

function moveTopCard(fromStack, toStack) {
    toStack.push(fromStack.pop())
}


function getAcePileTopCards() {
    let acePileTopCards = []
    for(let i = 0; i < aces.length; i++) {
        if(aces[i].length > 0) {
            acePileTopCards.push((aces[i][aces[i].length-1]));
        } else {
            acePileTopCards.push(0)
        }
    }
    return acePileTopCards;
}

function getCardObjFromClass(cardClass) {
    let cardObj = {};
    cardObj.suit = cardClass[0];
    let value = cardClass[1] + (cardClass[2] ? cardClass[2] : '');
    cardObj.value = value;
    return cardObj;
}

function handleStackClick(element) {

    let stackId = getClickDestination(element).replace('stack', '') -1;
    let clickDest = getClickDestination(element);
    let topCard = stacks[stackId][stacks[stackId].length -1];
    let stackPos;

    // select and highlight card to move
    if (!clickedCard && isFaceUpCard(element)) {
        firstStackId = stackId;
        firstClickDest = clickDest;
        element.className += ' highlight';
        stackPos = getPositionInStack(element.parentNode.children);
        clickedCard = stacks[stackId][stackPos];
        let cardsToPush = stackPos - stacks[stackId].length;
        while(cardsToPush < 0){
            cardArr.push(stacks[stackId].pop());
            stacksFaceUp[stackId]--;
            cardsToPush++;
        }

    // flip over unflipped card in stack
    } else if (!clickedCard && element === element.parentNode.lastChild) {
        stacksFaceUp[stackId]++;
        boardScore += 5;
        render();

    // move card to stack destination
    } else if (clickedCard && isFaceUpCard(element)) {

        // allow clicks on first clicked card
        if (stackId === firstStackId && clickDest === firstClickDest) {
            while(cardArr.length > 0) {
                stacks[stackId].push(cardArr.pop());
                stacksFaceUp[stackId]++
            }
            clickedCard = null;
            render();

        // push card to stack if play is legal
        } else if(isPlayLegal(clickedCard, topCard)){
            while(cardArr.length > 0) {
                stacks[stackId].push(cardArr.pop());
                stacksFaceUp[stackId]++;
            }
            if(firstStackId === 'draw') boardScore += 5;
            if(firstClickDest.includes('ace')) boardScore -= 5;
            clickedCard = null;
            render();
        }

    // move card to empty stack destination
    } else if (clickedCard && isEmptyStack(element) && getCardValue(clickedCard) === 13) {
        while(cardArr.length > 0) {
            stacks[stackId].push(cardArr.pop());
            stacksFaceUp[stackId]++;
        }
        if(firstStackId === 'draw') boardScore += 5;
        clickedCard = null;
        render();
    } 
} 

function handleAceClick(element) {

    let aceId = getClickDestination(element).replace('ace', '') -1;
    let clickDest = getClickDestination(element);
    console.log(clickDest);
    let topCard = aces[aceId][aces[aceId].length -1];

    // if a face up card hasn't been clicked yet, select and highlight this one
    if(!clickedCard && isFaceUpCard(element)){
        firstStackId = aceId;
        firstClickDest = clickDest;
        element.className += ' highlight';
        stackPos = getPositionInStack(element.parentNode.children);
        clickedCard = aces[aceId][stackPos];
        let cardsToPush = stackPos - aces[aceId].length;
        while(cardsToPush < 0){
            cardArr.push(aces[aceId].pop());
            cardsToPush++;
        }

    // if the highlighted card is an ace, put it in the empty ace pile
    } else if (clickedCard) {
        if(!topCard) {
            if(getCardValue(clickedCard) === 1) {
                while(cardArr.length > 0) {
                    aces[aceId].push(cardArr.pop());
                }
                clickedCard = null;
                render();
            }

        // if the highlighted card is 1 higher and of the same suit, play it on the ace
        } else {
            if (getCardValue(clickedCard) === getCardValue(topCard) + 1 && clickedCard.suit === topCard.suit) {
                while(cardArr.length > 0) {
                    aces[aceId].push(cardArr.pop());
                }
                clickedCard = null;
                render();
            }
        }    
    }
}

function handleDrawClick(element) {

    let topCard = draw[draw.length -1];
    let topCardEl = boardEls.draw.lastChild;

    // if there is no highlighted card, and the draw pile isn't an empty stack, select the top card
    if(!clickedCard && !isEmptyStack(element)){
        topCardEl.className += ' highlight';
        clickedCard = topCard;
        firstStackId = 'draw';
        firstClickDest = 'draw';
        let cardsToPush = -1;
        while(cardsToPush < 0){
            cardArr.push(draw.pop());
            cardsToPush++;
        }

    // if the highlighted card is from the draw pile, put it back in the pile (deselect it)
    } else if (!isEmptyStack(element) && topCardEl.className.includes('highlight') && getClickDestination(element) === 'draw') {
        while(cardArr.length > 0) {
            draw.push(cardArr.pop());
        }
        clickedCard = null;
        render();
    } 
}

function handlePileClick () {
    if(!clickedCard) {
        // if there are cards in the 'pile', flip one into the 'draw'
        if(pile.length > 0) {
            draw.push(pile.pop());
            render();
        // if the pile is empty, recycle the 'draw' into the 'pile' and subtract points    
        } else {
            while(draw.length > 0) {
                pile.push(draw.pop())
            }
            drawCycles++
            if (drawCycles > 1) boardScore -= 100;
            render();
        }
    }
}

function isEmptyStack(element) {
    return !!element.id;
}

function isPlayLegal(card1, card2) {
    
    let card1Color = getCardColor(card1);
    let card1Value = getCardValue(card1);
    let card2Color = getCardColor(card2);
    let card2Value = getCardValue(card2);

    if(card1Color === card2Color) {
        return false;
    } else if (card2Value - card1Value === 1) {
        return true;
    } else return false;
}

function getCardColor(cardObj) {
    if (cardObj.suit === 'h' || cardObj.suit === 'd') {
        return 'red'
    } else return 'black';
}

function getCardValue(cardObj) {
    switch(cardObj.value) {
        case 'A': return 1;
        break;
        case '02': return 2;
        break;
        case '03': return 3;
        break;
        case '04': return 4;
        break;
        case '05': return 5;
        break;
        case '06': return 6;
        break;
        case '07': return 7;
        break;
        case '08': return 8;
        break;
        case '09': return 9;
        break;
        case '10': return 10;
        break;
        case 'J': return 11;
        break;
        case 'Q': return 12;
        break;
        case 'K': return 13;
        break;
        default: console.log('getCardValue is broken')
    }
}

function getPositionInStack(HTMLCollection) {
    for(let i = 0; i < HTMLCollection.length; i++) {
        if(HTMLCollection[i].className.includes('highlight')) {
            return i;
        }
    }
}

function startTimer() {
   secondsPlayed = 0;
   counter = setInterval(count, 1000);
 }
 
 function pauseGame() {
   clearInterval(counter);
   isPaused = true;
   playPauseEl.classList.remove('play');
   playPauseEl.classList.add('pause');
 }
 
 function playGame() {
   if (!isPaused) return; // Check if already running
 
   isPaused = false;
   playPauseEl.classList.remove('pause');
   playPauseEl.classList.add('play');
   counter = setInterval(count, 1000);
 }
 
 function stopTimer() {
   secondsPlayed = 0;
   clearInterval(counter);
   timerEl.textContent = `Time - 0:00`;
 }
 
 function count() {
   if (isPaused) return; // Check if paused
 
   let hours = 0;
   let minutes = 0;
   let seconds = 0;
 
   secondsPlayed++;
 
   hours = Math.floor(minutes / 60);
   minutes = Math.floor(secondsPlayed / 60) - hours * 60;
   seconds = secondsPlayed - minutes * 60;
 
   timerEl.textContent = `Time - ${hours > 0 ? `${hours}:` : ''}${minutes < 10 && hours > 0 ? `0${minutes}` : minutes}:${
     seconds < 10 ? `0${seconds}` : seconds}`;
 }

function isFaceUpCard(element) {
    return (element.className.includes('card') && !(element.className.includes('back')) && !(element.className.includes('outline'))) 
}

function isAcePile(element) {
    if (!(element.firstChild)) {
        return element.id.includes('ace');
    } else {
        return element.parentNode.id.includes('ace');
    }
}

function getClickDestination(element) {
   console.log(element);
    if (element.id) {
        return element.id;
    } 
    else {
        return element.parentNode.parentNode.id;
    }
}

function winGame() {
    aces.forEach(arr => {
        
        for(let i = 0; i < 13; i++) {
            arr.push(`fake card ${i +1 }`);
        }
    })
    render();
}

function throwConfetti() {
   console.log('Confetti!');

   var COLORS, Confetti, NUM_CONFETTI, canvas, confetti, context, drawCircle, drawCircle2, drawCircle3, i, range, xpos;

   NUM_CONFETTI = 60;

   COLORS = [[255, 255, 255], [255, 144, 0], [255, 255, 255], [255, 144, 0], [0, 277, 235]];

   PI_2 = 2 * Math.PI;

   canvas = d.getElementById("confetti");

   context = canvas.getContext("2d");

   window.w = 0;

   window.h = 0;

   window.resizeWindow = function() {
      window.w = canvas.width = window.innerWidth;
      return window.h = canvas.height = window.innerHeight;
   };

   window.addEventListener('resize', resizeWindow, false);

   window.onload = function() {
      return setTimeout(resizeWindow, 0);
   };

   range = function(a, b) {
      return (b - a) * Math.random() + a;
   };

   drawCircle = function(x, y, r, style) {
      context.beginPath();
      context.moveTo(x, y);
      context.bezierCurveTo(x - 17, y + 14, x + 13, y + 5, x - 5, y + 22);
      context.lineWidth = 3;
      context.strokeStyle = style;
      return context.stroke();
   };

   drawCircle2 = function(x, y, r, style) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + 10, y + 10);
      context.lineTo(x + 10, y);
      context.closePath();
      context.fillStyle = style;
      return context.fill();
   };

   drawCircle3 = function(x, y, r, style) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + 10, y + 10);
      context.lineTo(x + 10, y);
      context.closePath();
      context.fillStyle = style;
      return context.fill();
   };

   xpos = 0.9;

   d.onmousemove = function(e) {
      return xpos = e.pageX / w;
   };

   window.requestAnimationFrame = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            return window.setTimeout(callback, 100 / 20);
      };
   })();

   Confetti = (function() {
      function Confetti() {
         this.style = COLORS[~~range(0, 5)];
         this.rgb = "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2];
         this.r = ~~range(2, 6);
         this.r2 = 2 * this.r;
         this.replace();
      }

      Confetti.prototype.replace = function() {
         this.opacity = 0;
         this.dop = 0.03 * range(1, 4);
         this.x = range(-this.r2, w - this.r2);
         this.y = range(-20, h - this.r2);
         this.xmax = w - this.r;
         this.ymax = h - this.r;
         this.vx = range(0, 2) + 8 * xpos - 5;
         return this.vy = 0.7 * this.r + range(-1, 1);
      };

      Confetti.prototype.draw = function() {
         var ref;
         this.x += this.vx;
         this.y += this.vy;
         this.opacity += this.dop;
         if (this.opacity > 1) {
           this.opacity = 1;
           this.dop *= -1;
         }
         if (this.opacity < 0 || this.y > this.ymax) {
           this.replace();
         }
         if (!((0 < (ref = this.x) && ref < this.xmax))) {
           this.x = (this.x + this.xmax) % this.xmax;
         }
         drawCircle(~~this.x, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
         drawCircle3(~~this.x * 0.5, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
         return drawCircle2(~~this.x * 1.5, ~~this.y * 1.5, this.r, this.rgb + "," + this.opacity + ")");
      };

      return Confetti;

   })();

   confetti = (function() {
      var j, ref, results;
      results = [];
      for (i = j = 1, ref = NUM_CONFETTI; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
         results.push(new Confetti);
      }
      return results;
   })();

   window.step = function() {
      var c, j, len, results;
      requestAnimationFrame(step);
      context.clearRect(0, 0, w, h);
      results = [];
      for (j = 0, len = confetti.length; j < len; j++) {
         c = confetti[j];
         results.push(c.draw());
      }
      return results;
   };

   step();

   // fix initial bug when firing
   resizeWindow();

   // fade in
   canvas.style.opacity = 0;
   var tick = function() {
      canvas.style.opacity = +canvas.style.opacity + 0.01;
      if ( +canvas.style.opacity < 1 ) {
         ( window.requestAnimationFrame &&
           requestAnimationFrame(tick) ) ||
         setTimeout(tick, 100)
      }
   };
   tick();

}