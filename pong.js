// The logic of pong, resizeable pong, resizeable pong with handicaps, resizeable pong with handicaps and netplay and lobies and who knows what else
// Lets see what I can get done.

//Set up a few global variables to keep track of stuff. Or more than a few....
var heightCanvas = 400; // Height of the canvas in pixels - really could be set to zero, its read in later
var widthCanvas = 400; // Width of the canvas in pixels - really could be set to zero, its read in later
// Between this comment and the 'end' comment all vars should always be 0>=x>=1 since they will later be multiplied by the width or height of the canvas
var xPosBall = 0; // They x-position of the ball as a fraction of the width of the canvas
var yPosBall = 0; // The y-position of the ball as a fraction of the height of the canvas
var yVelocBall = 0; // The y-velocity of the ball as a fraction of the height of the canvas
var xVelocBall = 0; // The x-velocity of the ball as a fraction of the width of the canvas
var yPosPad1 = 0; // A fraction of the height of the canvas that specifies the y coordinate of the first paddle
var xPosPad1 = 0; // A fraction of the width of the canvas that specifies the x coordinate of the first paddle
var yPosPad2 = 0; // A fraction of the height of the canvas that specifies the y coordinate of the second paddle
var xPosPad2 = 0; // A fraction of the width of the canvas that specifies the x coordinate of the second paddle
var padHeight = (1/7); // A fraction of the hight of the canvas which the pads are
var padWidth = (1/100); // A fraction of the width of the canvas which the pads are
var padOneYVeloc = 0; // The y-velocity of pad one as a fraction of the height of the canvas
var padOneXVeloc = 0; // The x-velocity of pad one as a fraction of the width of the canvas --------------------- Currently not in use!
var padTwoYVeloc = 0; // The y-velocity of pad two as a fraction of the height of the canvas
var padTwoXVeloc = 0; // The x-velocity of pad two as a fraction of the width of the canvas --------------------- Currently not in use!
// end

var padOneUp = false; // Is the up key for pad one being pressed?
var padOneDown = false; // Is the down key for pad one being pressed?
var padOneRight = false; // Is the right key for pad one being pressed? --------------------- Currently not in use!
var padOneLeft = false; // Is the left key for pad one being pressed? --------------------- Currently not in use!
var padTwoUp = false; // Is the up key for pad two being pressed?
var padTwoDown = false; // Is the down key for pad two being pressed?
var padTwoRight = false; // Is the right key for pad two being pressed? --------------------- Currently not in use!
var padTwoLeft = false; // Is the left key for pad two being pressed? --------------------- Currently not in use!
var deltaTime = 0; // Change in time from last loop to current loop, so everything moves same speed on any speed computer --------------------- Currently not in use!
var prevTime = 0; // Previous time, holder to calculate the delta time next time around --------------------- Currently not in use!

var scorePlayer1 = 0; // Score of player 1
var scorePlayer2 = 0; // Score of player 2

// The following variables should never be modified once assigned
// I'll figure out how javascript can do that at a later time (No cross browser way! Woooo javascript....)
var canvasCTX = null; // Holds the canvas context for easy reference/modification
var CTX2D = null; // Holds the canvas 2d context for easy rendering

// Below are the defined keyCodes for various controls. These should be treated essentially as constants.
//Player one controls (left side of screen)
var keyUpPlayer1 = 87; // 'w' key
var keyDownPlayer1 = 83; // 's' key
var keyLeftPlayer1 = 65; // 'a' key
var keyRightPlayer1 = 68; // 'd' key
//Player two controls (right side of screen)
var keyUpPlayer2 = 38; // up key
var keyDownPlayer2 = 40; // down key
var keyLeftPlayer2 = 37; // left key
var keyRightPlayer2 = 39; // right key
// End keyCode control defines

// Wait until the page loads to start running stuff
// Just good practice
$(document).ready(function()
{
	delayPong(); // Once the document loads call the function that starts the countdown
});

// Counts down the element with id tmdsp in the DOM with a one second delay between decrements
function countDown()
{
	var timeDisp = document.getElementById('tmdsp'); // Grabs the element from the DOM identified by the id 'tmdsp'. This is where the number that counts down is
	if(timeDisp.innerHTML!=0) //This is to make sure that if the skip button is pressed it never reads 0
		timeDisp.innerHTML = timeDisp.innerHTML - 1; // Subtracts one from that number and puts it back on the webpage
	if(timeDisp.innerHTML != 0) // If the number still is not zero
		setTimeout(function(){countDown()}, 1000); // Set this function to be called again in one second
	else
		cleanup404(); // Remove everything from where the pong canvas will go
}

//This function displays a sort of welcome message and delays a bit before jumping into the acutual game.
function delayPong()
{
	var placement = document.getElementById('pongPlacement'); // This grabs the div where pong will later appear
	var messagePleaseEnjoy = document.createElement('H1'); // Creates a <H1></H1> element
	messagePleaseEnjoy.innerHTML = "Please Enjoy A Game of Pong In"; // Puts the text in the element
	messagePleaseEnjoy.style = "text-align:center"; // Styles it so that the text is centered (css in html style="")
	var timeDisp = document.createElement('H1'); // Creates another <H1></H1> element
	timeDisp.style = "text-align:center"; // Styles it so that the text is centered, same as before
	timeDisp.id = 'tmdsp'; // Assigns it an id so that it can be referenced later
	timeDisp.innerHTML = 5; // Set the ammount of time to delay for in seconds, displayed. Also the content of the last <H1>
	var skipButton = document.createElement('button'); // Creates a <Button></Button> element
	skipButton.setAttribute("type", "button"); // Sets the type attribute to button
	skipButton.setAttribute("onClick", "zeroTime()"); // When the button is clicked it runs the function which sets the ammount of remaining time to zero
	skipButton.innerHTML = "Continue"; // Sets the text in the button to say "continue"
	skipButton.style = "display:block; margin-left: auto; margin-right: auto;"; // Set the style to center the button
	placement.appendChild(messagePleaseEnjoy); // Appends the text message into the DOM (so its displayed)
	placement.appendChild(timeDisp); // Appends the number that will count down into the DOM (so its diplayed)
	placement.appendChild(skipButton); // Appends the continue button into the DOM (so its displayed)
	setTimeout(function(){countDown()}, 1000); // Set the countdown function to be called in one second
}

function zeroTime()
{
	document.getElementById('tmdsp').innerHTML = 0; // This function just zeros the timer.
}

// This function just makes sure that everything from the welcome message is removed so that pong can be put in its place
function cleanup404()
{
	var placement = document.getElementById('pongPlacement'); // Grabs the id of the pongPlacement element in which everything was placed
	while(placement.hasChildNodes()) // Run through this loop until pongPlacement has no child elements
	{
		placement.removeChild(placement.firstChild); // Remove the first child element from within pongPlacement
	}
	setupCanvas(); // Creates a canvas with an id and place it in the DOM
	setupVars(); // Sets up all the initial positions for things and any variables pong may need to start
	mainPong(); // Starts the main pong "loop"
}

// This function simply creates a canvas with an id and then gives it an id and places it in the DOM
function setupCanvas()
{
	canvasCTX = document.createElement('canvas'); // Create a canvas element and put it in the global variable so anything can use it
	canvasCTX.id = 'pongCanvas'; // Assign an id to the canvas, ensures default css applies to it. Keeps it centered and everything
	var placement = document.getElementById('pongPlacement'); // Grabs the div element in which the canvas is to be placed form the DOM
	placement.appendChild(canvasCTX); // Appends the canvas into the div, canvas now appears on the page
}

/////////////////////////////////////////////////////////////////////
//                    Pong code begins below this                  //
/////////////////////////////////////////////////////////////////////

function setupVars()
{
	canvasCTX = document.getElementById('pongCanvas'); // Store the canvas context in a variable so we can just use it at will throughout the code
	widthCanvas = canvasCTX.width; // Grab the width of the canvas, this will be used a lot
	heightCanvas = canvasCTX.height; //Grab the height of the canvas, this will be used a lot
	CTX2D = canvasCTX.getContext("2d"); // Grab the 2d context since that is what we will render into
	setupInitialPositions(); //Setup the intial coords of everything
	prevTime = new Date().getTime(); // returns the number of milliseconds between midnight of January 1, 1970 - will be used later to calculate deltatime
	deltaTime = 0; // So nothing moves through the first run through the loop
}

function setupInitialPositions()
{
	xPosBall = .5; // This and the next line
	yPosBall = .5; // are to start the ball in the middle
	
	yPosPad1 = .5-(1/2)*padHeight; // Top left corner will be at 1/2 of the screen minus half the height of the pad (top left is 0,0)
	xPosPad1 = 0; // Top left corner is at zero, the left edge of the screen
	yPosPad2 = .5-(1/2)*padHeight; // Top left corner will be at 1/2 of the screen minus half the height of the pad (top left is 0,0)
	xPosPad2 = 1-padWidth; // xPos will be on the right side of the screen minus the width of the pad so the pad is on the screen
	
	padOneYVeloc = .00001;
	padTwoYVeloc = .00001;
}

function renderPong()
{
	CTX2D.clearRect(0,0,widthCanvas,heightCanvas);
	// Draw the ball.
	CTX2D.beginPath();
	CTX2D.arc(xPosBall*widthCanvas,yPosBall*heightCanvas,(1/100)*widthCanvas,0,2*Math.PI);
	CTX2D.fillStyle = 'black';
	CTX2D.fill();
	// Draw paddle 1
	CTX2D.beginPath();
	CTX2D.rect(xPosPad1*widthCanvas,yPosPad1*heightCanvas,padWidth*widthCanvas,padHeight*heightCanvas);
	CTX2D.fill();
	//CTX2D.fillStyle = "#f00"; (maybe not needed?)
	
	//FINISH THE RENDERING HERE IT IS NOT DONE STILL NEEDS THE FILL AND FILLSTYLE TYPE THINGS
	// Draw paddle 2
	CTX2D.beginPath();
	CTX2D.rect(xPosPad2*widthCanvas,yPosPad2*heightCanvas,padWidth*widthCanvas,padHeight*heightCanvas);
	CTX2D.fill();
	//FINISH THE RENDERING HERE IT IS NOT DONE STILL NEEDS THE FILL AND FILLSTYLE TYPE THINGS
}

function detectCollision()
{
	// First make sure the paddles are in bounds! This ensures collisions are calculated correctly
	if(yPosPad1 > (1-padHeight))
		yPosPad1 = 1-padHeight;
	else if(yPosPad1 < 0)
		yPosPad1 = 0;
	// XPOS IS CURRENTLY NOT CHECKED, MAKE SURE TO CHECK WHEN IMPLEMENTING
	// Check the second paddle
	if(yPosPad2 > (1-padHeight))
		yPosPad2  = 1-padHeight;
	else if(yPosPad2 < 0)
		yPosPad2 = 0;
	// XPOS IS CURRENTLY NOT CHECKED, MAKE SURE TO CHECK WHEN IMPLEMENTING
	// This next part is not complete, lets get paddles working first!
	// Now we do a looped check where we keep checking if the ball is out of bounds and... hmm need to think about this. 
}

// Detect keydowns and update vars.
$(document).keydown(function(event)
{
	var keyPressed = event.which; // This should always have the keypress, may have to or with event.keyCode but jquery claims you don't - Just a note
	// Check for player 1 controls
	if(keyPressed == keyUpPlayer1)
		padOneUp = true;
	if(keyPressed == keyDownPlayer1)
		padOneDown = true;
	if(keyPressed == keyLeftPlayer1)
		padOneLeft = true;
	if(keyPressed == keyRightPlayer1)
		padOneRight = true;
	// Check for player 2 controls
	if(keyPressed == keyUpPlayer2)
		padTwoUp = true;
	if(keyPressed == keyDownPlayer2)
		padTwoDown = true;
	if(keyPressed == keyLeftPlayer2)
		padTwoLeft = true;
	if(keyPressed == keyRightPlayer2)
		padTwoRight = true;
	// alert(padOneUp); //Demonstrate it workksss
});

// Detect keydowns and update vars.
$(document).keyup(function(event)
{
	var keyReleased = event.which; // This should always have the key that is released, may have to or with event.keyCode but jquery claims you don't - Just a note
	// Check for player 1 controls
	if(keyReleased == keyUpPlayer1)
		padOneUp = false;
	if(keyReleased == keyDownPlayer1)
		padOneDown = false;
	if(keyReleased == keyLeftPlayer1)
		padOneLeft = false;
	if(keyReleased == keyRightPlayer1)
		padOneRight = false;
	// Check for player 2 controls
	if(keyReleased == keyUpPlayer2)
		padTwoUp = false;
	if(keyReleased == keyDownPlayer2)
		padTwoDown = false;
	if(keyReleased == keyLeftPlayer2)
		padTwoLeft = false;
	if(keyReleased == keyRightPlayer2)
		padTwoRight = false;
});

function positionUpdate()
{
	// Update Ball Position
	xPosBall += xVelocBall*widthCanvas*deltaTime;
	yPosBall += yVelocBall*heightCanvas*deltaTime;
	// Update speed of ball. - ???
	// yVelocBall;
	// xVelocBall;
	
	// Update Paddle Position
	// Update first paddle position
	if(padOneUp)
	{
		yPosPad1 -= padOneYVeloc*heightCanvas*deltaTime; // In a canvas (0,0) is top left
	}
	if(padOneDown)
	{
		yPosPad1 += padOneYVeloc*heightCanvas*deltaTime; // Remember top left is (0,0)
	}
	// Following two NOT IN USE at this time
	if(padOneRight)
	{
	}
	if(padOneLeft)
	{
	}
	// Update second player's paddle position
	if(padTwoUp)
	{
		yPosPad2 -= padTwoYVeloc*heightCanvas*deltaTime;
	}
	if(padTwoDown)
	{
		yPosPad2 += padTwoYVeloc*heightCanvas*deltaTime;
	}
	// Folowing two NOT IN USE at this time
	if(padTwoRight)
	{
	}
	if(padTwoLeft)
	{
	}
}

function framePacing()
{
	// Perhaps do the deltaTime calculations here as well, seems like a good place, could help determine how much to sleep as well as how much things should move
	deltaTime = new Date().getTime()-prevTime;
	prevTime += deltaTime;
	setTimeout(function(){mainPong()}, 30); // Need some sort of thing like this otherwise the webpage freezes as javascript running takes prescedence over other things.
}

function mainPong()
{
	//Render everything to the screen
	renderPong();
	// Update positions of things just based off velocity
	positionUpdate();
	// Detect collisions and update positions and velocities based off collisions
	detectCollision();
	// Make sure that timing is correct and that the page remains responsive with 'sleeps'
	framePacing();
}