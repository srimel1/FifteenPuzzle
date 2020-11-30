/***
 * board variables
 * @type {number}
 */
let moves = 0; //number of moves

// The available div elements
// sixteen is empty for the moves
const squares = [
    "one", "two", "three", "four",
    "five", "six", "seven", "eight",
    "nine", "ten", "eleven", "twelve",
    "thirteen", "fourteen", "fifteen", ""
];

// start time
const start = new Date();

// map the numbers to their respective digits
const squares_num = {
    "one": 1, "two": 2, "three": 3, "four": 4,
    "five": 5, "six": 6, "seven": 7, "eight": 8,
    "nine": 9, "ten": 10, "eleven": 11, "twelve": 12,
    "thirteen": 13, "fourteen": 14, "fifteen": 15, "sixteen": 16
};

// copy squares into an array
let shuffled = squares.slice();

// stores chosen the background 
let chosen_background;


//maps the movements.
//[top, right, bottom, left]
const movement = [
    [0, 1, 1, 0], //0: one
    [0, 1, 1, 1], //1: two
    [0, 1, 1, 1], //2: three
    [0, 0, 1, 1], //3: four
    [1, 1, 1, 0], //4: five
    [1, 1, 1, 1], //5: six
    [1, 1, 1, 1], //6: seven
    [1, 0, 1, 1], //7: eight
    [1, 1, 1, 0], //8: nine
    [1, 1, 1, 1], //9: ten
    [1, 1, 1, 1], //10: eleven
    [1, 0, 1, 1], //11: twelve
    [1, 1, 0, 0], //12: thirteen
    [1, 1, 0, 1], //13: fourteen
    [1, 1, 0, 1], //14: fifteen
    [1, 0, 0, 1]  //15: sixteen
];

// The available backgrounds
const background = ["castle", "castle_2", "castle_3", "castle_4"];






/***
 * directionally aware hover effects
 */
let el = document.getElementById('tile') //store element in el

/* Get the height and width of the element */
const height = el.clientHeight
const width = el.clientWidth

/*
  * Add a listener for mousemove event
  * Which will trigger function 'handleMove'
  * On mousemove
  */
el.addEventListener('mousemove', handleMove)

/* Define function a */
function handleMove(e) {
    /*
      * Get position of mouse cursor
      * With respect to the element
      * On mouseover
      */
    /* Store the x position */
    const xVal = e.layerX
    /* Store the y position */
    const yVal = e.layerY

    /*
      * Calculate rotation valuee along the Y-axis
      * Here the multiplier 20 is to
      * Control the rotation
      * You can change the value and see the results
      */
    const yRotation = 20 * ((xVal - width / 2) / width)

    /* Calculate the rotation along the X-axis */
    const xRotation = -20 * ((yVal - height / 2) / height)

    /* Generate string for CSS transform property */
    const string = 'perspective(121px) scale(1.1) rotateX(' + xRotation + 'deg) rotateY(' + yRotation + 'deg)'

    /* Apply the calculated transformation */
    el.style.transform = string
}

/* Add listener for mouseout event, remove the rotation */
el.addEventListener('mouseout', function () {
    el.style.transform = 'perspective(121px) scale(1) rotateX(0) rotateY(0)'
})

/* Add listener for mousedown event, to simulate click */
el.addEventListener('mousedown', function () {
    el.style.transform = 'perspective(121px) scale(0.9) rotateX(0) rotateY(0)'
})

/* Add listener for mouseup, simulate release of mouse click */
el.addEventListener('mouseup', function () {
    el.style.transform = 'perspective(121px) scale(1.1) rotateX(0) rotateY(0)'
})
/* end directionally aware hover effect*/



/* board functions */

/**
 * Starts the game, displays random background, until the user decides the choose one.
 * each square has the class tile, and their respective id and the random background
 */
function initializeGame() {
    var background_id = Math.floor((Math.random() * 4));
    chosen_background = background[background_id];

    document.getElementById(background[background_id]).selected = true; //mark background as selected

    for (let i = 0; i < squares.length - 1; i++) {
        document.getElementById(squares[i]).className = "tile " + background[background_id];
    }
}


/**
 * if the user selects the background, the div elements are populated with backround image
 */
function changeBackground() {
    var class_name = document.getElementById("castles").value;

    if (background.indexOf(class_name) < 0) {
        return;
    }

    chosen_background = class_name;

    document.getElementById("main").innerHTML = "";

    for (var i = 0; i < squares.length; i++) {
        if (squares[i] == "") {
            document.getElementById("main").innerHTML += '<div id="sixteen" class="tile"></div>';
        } else {
            var id_name = squares[i];
            document.getElementById("main").innerHTML += '<div id="' + squares[i] + '" class="tile' + " " + chosen_background + '">' + squares_num[id_name] + '</div>';
        }
    }
}


/***
 * shuffles the board using randomly generated numbers
 */
function shuffleBoard() {
    shuffled = squares.slice(); // Reinitialize array
    var sixteen = 15;

    // loop through
    for (let i = 0; i < 500; i++) {

        let movement_id = Math.floor((Math.random() * 4));

        while (movement[sixteen][movement_id] != 1) {
            movement_id = Math.floor((Math.random() * 4));
        }

        // The index id where the blank space will go to
        var move_to;

        switch (movement_id) {
            case 0:
                move_to = sixteen - 4; // subtract 4 to go up
                break;
            case 1:
                move_to = sixteen + 1; // plus 1 to go right
                break;
            case 2:
                move_to = sixteen + 4; // plus 4 to gow down
                break;
            case 3:
                move_to = sixteen - 1;  // minus 1 to go left
                break;

        }

        //swap the empty square (id=sixteen)
        const temp = shuffled[sixteen];
        shuffled[sixteen] = shuffled[move_to];
        shuffled[move_to] = temp;

        sixteen = move_to;
    }
    displayBoard(); //display the board after move
}

/***
 * displays the board
 */
function displayBoard() {
    document.getElementById("main").innerHTML = "";

    for (let i = 0; i < shuffled.length; i++) {
        if (shuffled[i] == "") {
            document.getElementById("main").innerHTML += '<div id="sixteen" class="tile"></div>';
        } else {
            var id_name = shuffled[i];
            document.getElementById("main").innerHTML += '<div id="' + shuffled[i] + '" class="tile' + " " + chosen_background + '">' + squares_num[id_name] + '</div>';
        }
    }

    let clickable_id;

    if (movement[shuffled.indexOf("")][0] == 1) {
        clickable_id = shuffled.indexOf("") - 4;
        document.getElementById(shuffled[clickable_id]).className += " clickable";
        document.getElementById(shuffled[clickable_id]).setAttribute("onclick", "swapPieces(" + clickable_id + ", " + shuffled.indexOf("") + ")");
    }

    if (movement[shuffled.indexOf("")][1] == 1) {
        clickable_id = shuffled.indexOf("") + 1;
        document.getElementById(shuffled[clickable_id]).className += " clickable";
        document.getElementById(shuffled[clickable_id]).setAttribute("onclick", "swapPieces(" + clickable_id + ", " + shuffled.indexOf("") + ")");
    }

    if (movement[shuffled.indexOf("")][2] == 1) {
        clickable_id = shuffled.indexOf("") + 4;
        document.getElementById(shuffled[clickable_id]).className += " clickable";
        document.getElementById(shuffled[clickable_id]).setAttribute("onclick", "swapPieces(" + clickable_id + ", " + shuffled.indexOf("") + ")");
    }

    if (movement[shuffled.indexOf("")][3] == 1) {
        clickable_id = shuffled.indexOf("") - 1;
        document.getElementById(shuffled[clickable_id]).className += " clickable";
        document.getElementById(shuffled[clickable_id]).setAttribute("onclick", "swapPieces(" + clickable_id + ", " + shuffled.indexOf("") + ")");
    }
}


/***
 * swaps the pieces
 * @param clickable_id
 * @param empty_id
 */
function swapPieces(clickable_id, empty_id) {
    animateMovement(clickable_id, empty_id);

    setTimeout(function () {
        var temp = shuffled[empty_id];
        shuffled[empty_id] = shuffled[clickable_id];
        shuffled[clickable_id] = temp;

        moves++;

        displayBoard();
        checkForWin(); //TODO there needs to be a win scenario
    }, 600);
}


function animateMovement(clickable_id, empty_id) {
    if (clickable_id - 4 == empty_id) {
        console.log(shuffled[clickable_id]);
        document.getElementById(shuffled[clickable_id]).className += " animate-up";
    } else if (clickable_id + 1 == empty_id) {
        document.getElementById(shuffled[clickable_id]).className += " animate-right";
    } else if (clickable_id + 4 == empty_id) {
        document.getElementById(shuffled[clickable_id]).className += " animate-down";
    } else if (clickable_id - 1 == empty_id) {
        document.getElementById(shuffled[clickable_id]).className += " animate-left";
    }
}

/**
 * check to see if user won...
 */
//TODO needs a win sequence
function checkForWin() {
    if (squares.toString() == shuffled.toString()) {
    //TODO
    }
}

/***
 * find the high score and user
 */
function saveScore(){
    //TODO
}

/***
 * find high score
 */
function getHighScore(){
    //TODO
}

/***
 * display the leaderboard
 */
function displayLeaderBoard(){
    //TODO
}
