// The logic of pong, resizeable pong, resizeable pong with handicaps, resizeable pong with handicaps and netplay and lobies and who knows what else
// Lets see what I can get done.

//Set up a few global variables to keep track of stuff. Or more than a few....
var heightCanvas = 400; // Height of the canvas in pixels
var widthCanvas = 400; // Width of the canvas in pixels
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

// The following variables should never be modified once assigned
// I'll figure out how javascript can do that at a later time (No cross browser way! Woooo javascript....)
var canvasCTX = null; // Holds the canvas context for easy reference/modification
var CTX2D = null; // Holds the canvas 2d context for easy rendering

// Below are the defined keyCodes for various controls. These should be treated essentially as constants.
//Player one controls (left side of screen)
var keyUpPlayer1 = 0; // Placeholders for now.
var keyDownPlayer1 = 0;
var keyLeftPlayer1 = 0;
var keyRightPlayer1 = 0;
//Player two controls (right side of screen)
var keyUpPlayer2 = 0;
var keyDownPlayer2 = 0;
var keyLeftPlayer2 = 0;
var keyRightPlayer2 = 0;
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
	placement.appendChild(messagePleaseEnjoy); // Appends the text message into the DOM (so its displayed)
	placement.appendChild(timeDisp); // Appends the number that will count down into the DOM (so its diplayed)
	setTimeout(function(){countDown()}, 1000); // Set the countdown function to be called in one second
}

// This function just makes sure that everything from the welcome message is removed so that pong can be put in its place
function cleanup404()
{
	var placement = document.getElementById('pongPlacement');
//	var things = document.createElement('h1');
//	things.innerHTML = 'singing';
//	placement.appendChild(things);
	while(placement.hasChildNodes())
	{
		placement.removeChild(placement.firstChild);
	}
	setupCanvas();
	setupVars();
	mainPong();
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
	canvasCTX = document.getElementById('pongCanvas');
	widthCanvas = canvasCTX.width;
	heightCanvas = canvasCTX.height;
	CTX2D = canvasCTX.getContext("2d");
	setupInitialPositions();
	// prevTime = the time here so that the first delta time calculation is correct. We will leave delta time as zero at first so that
	// nothing moves for the first run through the loop. It should not matter unless the client is experiencing absurd ammounts of lag.
}

function setupInitialPositions()
{
	xPosBall = .5; // This and the next line
	yPosBall = .5; // are to start the ball in the middle
	
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
	//FINISH THE RENDERING HERE IT IS NOT DONE STILL NEEDS THE FILL AND FILLSTYLE TYPE THINGS
	// Draw paddle 2
	CTX2D.beginPath();
	CTX2D.rect(xPosPad2*widthCanvas,yPosPad2*heightCanvas,padWidth*widthCanvas,padHeight*heightCanvas);
	//FINISH THE RENDERING HERE IT IS NOT DONE STILL NEEDS THE FILL AND FILLSTYLE TYPE THINGS
}

function detectCollision()
{
	
}

// Detect keydowns and update vars.
$(document).keydown(function(event)
{
	//var keyPressed = event.which(); // This should always have the keypress, may have to or with event.keyCode but jquery claims you don't. Just a note.
	//if(keyPressed == )
});

// Detect keydowns and update vars.
$(document).keyup(function(event)
{
	
});

function positionUpdate()
{
	// Update Ball Position
	xPosBall += xVelocBall*widthCanvas;
	yPosBall += yVelocBall*heighCanvas;
	// Update speed of ball.
	// yVelocBall;
	// xVelocBall;
	
	// Update Paddle Position
	/*
	if(padOneUp && (true))
	{
		yPosPad1 -= padOneVeloc*heightCanvas; // In a canvas (0,0) is top left
	}
	if(padOneDown && (yPosPad1 < ()))
	{
		yPosPad1 += padOneVeloc*heightCanvas; // Remember top left is (0,0)
	}
	if(padTwoUp && (true))
	{
		yPosPad2 -= padTwoVeloc*heightCanvas;
	}
	if(padTwoDown && (yPosPad2 < ()))
	{
		yPosPad2 += padTwoVeloc*heightCanvas;
	}*/
	// Detect collisions and update ball position appropriately.
	detectCollision();
	// Update paddle position based on user input.
}

function framePacing()
{
	// Perhaps do the deltaTime calculations here as well, seems like a good place, could help determine how much to sleep as well as how much things should move
	setTimeout(function(){mainPong()}, 20); // Need some sort of thing like this otherwise the webpage freezes as javascript running takes prescedence over other things.
}

function mainPong()
{
	renderPong();
	positionUpdate();
	framePacing();
}