// The logic of pong, resizeable pong, resizeable pong with handicaps, resizeable pong with handicaps and netplay and lobies and who knows what else
// Lets see what I can get done.

//Set up a few global variables to keep track of stuff. Or more than a few....
var heightCanvas = 400; // Height of the canvas in pixels - really could be set to zero, its read in later
var widthCanvas = 400; // Width of the canvas in pixels - really could be set to zero, its read in later
// Between this comment and the 'end' comment all vars should always be 0>=x>=1 since they will later be multiplied by the width or height of the canvas
var xPosBall = 0; // They x-position of the ball as a fraction of the width of the canvas
//var lastXPosBall = 0; // Stores the last x pos for detecting collisions
var yPosBall = 0; // The y-position of the ball as a fraction of the height of the canvas
//var lastYPosBall = 0; // Stores the last y pos for detecting collisions
var yVelocBall = 0; // The y-velocity of the ball as a fraction of the height of the canvas
var yVelocBallBase = 0; // The base y velocity that the ball can return to when reset
var maxYVelocBall = 0; // The highest xVelocity before no more speed is added per hit
var xVelocBall = 0; // The x-velocity of the ball as a fraction of the width of the canvas
var xVelocBallBase = 0; // The base x velocity that the ball can return to when reset
var maxXVelocBall = 0; // The highest xVelocity before no more speed is added per hit
var xVelocModifier = 0; // How much speed is added per hit on paddle
var yPosPad1 = 0; // A fraction of the height of the canvas that specifies the y coordinate of the first paddle
var xPosPad1 = 0; // A fraction of the width of the canvas that specifies the x coordinate of the first paddle
var yPosPad2 = 0; // A fraction of the height of the canvas that specifies the y coordinate of the second paddle
var xPosPad2 = 0; // A fraction of the width of the canvas that specifies the x coordinate of the second paddle
var padHeight = (1/7); // A fraction of the hight of the canvas which the pads are
var padWidth = (1/100); // A fraction of the width of the canvas which the pads are
var ballRadius = 0; // Fraction which signifies the radius of the ball
var widthCenterLine = 0; // Width of centerline
var padOneYVeloc = 0.0; // The y-velocity of pad one as a fraction of the height of the canvas
var padOneXVeloc = 0.0; // The x-velocity of pad one as a fraction of the width of the canvas --------------------- Currently not in use!
var padTwoYVeloc = 0; // The y-velocity of pad two as a fraction of the height of the canvas
var padTwoXVeloc = 0; // The x-velocity of pad two as a fraction of the width of the canvas --------------------- Currently not in use!
// end

var menuUp = true; // Is the menu up? Start with the menu displayed

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
var menuDiv = null; // Hold the div that holds the menu, probably null or meaningless unless the menu is up

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

// Randomization of AI vars
var isRandInProgress = false; // This is a flag so that the randomization function is not called too often and does not result in the ai appearing to spaz out
var aiRandOffset = 0; // Variable to hold current offset generated by function
var aiRandRefreshTime = 0; // Varible to hold the number of ms between when the ai refreshes its random offset from the center of the paddle

// Variables that define type of game being played
var winPoints = 0; // The number of points you play up to
var gameVsAi = false; // A flag that determines whether the game is against AI or not
var gameOnline = false; // A flag that determines whether the game is against a player online, currently not implemented
var gameLocal = false; // A flag that determines whether the game is against a player locally
var playerOnePoints = 0; // Number of points player one currently has
var playerTwoPoints = 0; // Number of points player two currently has
var aiDifficulty = 1; // AI difficulty, set to easy in case no one presses a button in menu
var justReset = true; // This is used to keep the ball from moving until a player moves a paddle. Moves the ball once it becomes false
var gamePaused = false; // This will just be used to pause the game, nothing implemented to notify of this at the moment!!!!!
var displayWin = false; // This is set so that the menu can be invoked to display a win
var lastScored = 0; // 0 is for start the ball in a random direction (start of game), 1 is for player 1, 2 is for player 2.

// Online Play vars
var firebaseRef = new Firebase('https://flickering-fire-7063.firebaseio.com/'); // Firebase root reference
var isHost = false; // Set to true if you are the "master" processing data for a given game over firebase
var cancelOnlineWait = false; // This var is used to cancel waiting for another player
var gameID = null; // This var holds the reference to our game
var isFirebaseUpdating = false; // This var can be set to false to stop the farebase updating async

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
	messagePleaseEnjoy.setAttribute("style","text-align:center"); // Styles it so that the text is centered (css in html style="")
	var timeDisp = document.createElement('H1'); // Creates another <H1></H1> element
	timeDisp.setAttribute("style","text-align:center"); // Styles it so that the text is centered, same as before
	timeDisp.id = 'tmdsp'; // Assigns it an id so that it can be referenced later
	timeDisp.innerHTML = 5; // Set the ammount of time to delay for in seconds, displayed. Also the content of the last <H1>
	var skipButton = document.createElement('button'); // Creates a <Button></Button> element
	skipButton.setAttribute("type", "button"); // Sets the type attribute to button
	skipButton.setAttribute("onClick", "zeroTime()"); // When the button is clicked it runs the function which sets the ammount of remaining time to zero
	skipButton.innerHTML = "Continue"; // Sets the text in the button to say "continue"
	skipButton.setAttribute("style", "display:block; margin-left: auto; margin-right: auto;"); // Set the style to center the button
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
	canvasCTX.width = $("#pongCanvas").width(); // Actually scale the canvas to the proper size. Otherwise canvas is low res and css just stretches it
	canvasCTX.height = $("#pongCanvas").height(); // Makes sure canvas actually scales and is not stretched
	widthCanvas = canvasCTX.width; // Grab the width of the canvas, this will be used a lot
	heightCanvas = canvasCTX.height; //Grab the height of the canvas, this will be used a lot
	CTX2D = canvasCTX.getContext("2d"); // Grab the 2d context since that is what we will render into
	setupInitialPositions(); //Setup the intial coords of everything
	prevTime = new Date().getTime(); // returns the number of milliseconds between midnight of January 1, 1970 - will be used later to calculate deltatime
	deltaTime = 0; // So nothing moves through the first run through the loop
}

function setupInitialPositions()
{
	//SIZES
	padHeight = (1/7);
	padWidth = (1/100);
	
	ballRadius = (1/130);
	
	widthCenterLine = (1/200);
	
	//POSITIONS
	xPosBall = .5 - ballRadius*.5; // This and the next line
	yPosBall = .5 + ballRadius*.5; // are to start the ball in the middle
	
	yPosPad1 = .5-(1/2)*padHeight; // Top left corner will be at 1/2 of the screen minus half the height of the pad (top left is 0,0)
	xPosPad1 = 0; // Top left corner is at zero, the left edge of the screen
	yPosPad2 = .5-(1/2)*padHeight; // Top left corner will be at 1/2 of the screen minus half the height of the pad (top left is 0,0)
	xPosPad2 = 1-padWidth; // xPos will be on the right side of the screen minus the width of the pad so the pad is on the screen
	
	//VELOCITIES
	padOneYVeloc = .000002;
	padOneXVeloc = .0000007;
	
	padTwoYVeloc = .000002;
	padTwoXVeloc = .0000007;
	
	yVelocBall = .0000005; // This will be set elsewhere
	xVelocBall = .0000005; // This will be set elsewhere
}

// Detect keydowns and update vars.
$(document).keydown(function(event)
{
	var keyPressed = event.which; // This should always have the keypress, may have to or with event.keyCode but jquery claims you don't - Just a note
	// Check for player 1 controls
	if((!gameOnline)||(isHost))
	{
		if(keyPressed == keyUpPlayer1)
		{
			padOneUp = true;
		}
		if(keyPressed == keyDownPlayer1)
		{
			padOneDown = true;
		}
		if(keyPressed == keyLeftPlayer1)
		{
			padOneLeft = true;
		}
		if(keyPressed == keyRightPlayer1)
		{
			padOneRight = true;
		}
		// For pausing using 'p'
		if(keyPressed == 80)
		{
			if(gameOnline)
				firebaseRef.child(gameID).child('gameStatus').update({gamePaused: !gamePaused});
			gamePaused = !gamePaused;
		}
		//Update all the positions
		if(gameOnline)
		{
			firebaseRef.child(gameID).child('hostControls').update(
			{
			padHostUp: padOneUp,
			padHostDown: padOneDown,
			padHostLeft: padOneLeft,
			padHostRight: padOneRight
			});
		}

	}
	// Check for player 2 controls
	if((!gameOnline)||(!isHost))
	{
		if(keyPressed == keyUpPlayer2)
		{
			padTwoUp = true;
		}
		if(keyPressed == keyDownPlayer2)
		{
			padTwoDown = true;
		}
		if(keyPressed == keyLeftPlayer2)
		{
			padTwoLeft = true;
		}
		if(keyPressed == keyRightPlayer2)
		{
			padTwoRight = true;
		}
		//Update all the positions
		if(gameOnline)
		{
			firebaseRef.child(gameID).child('clientControls').update(
			{
			padClientUp: padTwoUp,
			padClientDown: padTwoDown,
			padClientLeft: padTwoLeft,
			padClientRight: padTwoRight
			});
		}
	}
	// Bring up the menu (esc)
	if(keyPressed == 27) // MAKE SURE THAT IN ONLINE PLAY MENUUP LEAVES THE GAME PROPERLY OR SOMETHING, cleanup needs to be implemented anyways, current system baaad
	{
		if(gameOnline)
				firebaseRef.child(gameID).child('gameStatus').update({menuUp: true});
		menuUp = true;
	}
});

// Detect keydowns and update vars.
$(document).keyup(function(event)
{
	var keyReleased = event.which; // This should always have the key that is released, may have to or with event.keyCode but jquery claims you don't - Just a note
	// Check for player 1 controls
	if((!gameOnline)||(isHost))
	{
		if(keyReleased == keyUpPlayer1)
		{
			padOneUp = false;
		}
		if(keyReleased == keyDownPlayer1)
		{
			padOneDown = false;
		}
		if(keyReleased == keyLeftPlayer1)
		{
			padOneLeft = false;
		}
		if(keyReleased == keyRightPlayer1)
		{
			padOneRight = false;
		}
		// Update the status in firebase
		if(gameOnline)
		{
			firebaseRef.child(gameID).child('hostControls').update(
			{
			padHostUp: padOneUp,
			padHostDown: padOneDown,
			padHostLeft: padOneLeft,
			padHostRight: padOneRight,
			});
		}
	}
	// Check for player 2 controls
	if((!gameOnline)||(!isHost))
	{
		if(keyReleased == keyUpPlayer2)
		{
			padTwoUp = false;
		}
		if(keyReleased == keyDownPlayer2)
		{
			padTwoDown = false;
		}
		if(keyReleased == keyLeftPlayer2)
		{
			padTwoLeft = false;
		}
		if(keyReleased == keyRightPlayer2)
		{
			padTwoRight = false;
		}
		// Update the status in firebase
		if(gameOnline)
		{
			firebaseRef.child(gameID).child('clientControls').update(
			{
			padClientUp: padTwoUp,
			padClientDown: padTwoDown,
			padClientLeft: padTwoLeft,
			padClientRight: padTwoRight,
			});
		}
	}
});

function loadMenuBackground()
{
	//Load in the background and everything
	menuDiv = document.createElement("div");
	menuDiv.id = "menuDiv"
	var styleString = "position:absolute; width:" + widthCanvas + "px; height:" + heightCanvas + "px; background-color:black; opacity:1.0; left:0; right:0; z-index:1; margin-left:auto; margin-right:auto; border:1px solid #FFFFFF;"
	menuDiv.setAttribute("style",styleString);
	document.getElementById('pongPlacement').appendChild(menuDiv);
	$("#menuDiv").hide().fadeIn(); // Looks nice fading in.
}

function loadMainMenu()
{
	// Here we start loading the menu elements since the menu itself is loaded
	// First the title text and a bar under it
	var titleText = document.createElement("div");
	var tempHolder = document.createElement("H1");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "PONG - Main Menu";
	titleText.appendChild(tempHolder);
	tempHolder = document.createElement("hr");
	tempHolder.setAttribute("style", "border-color:blue; width:" + widthCanvas*(2/3) + "px;");
	titleText.appendChild(tempHolder);
	menuDiv.appendChild(titleText);
	// Now the single player clickable div
	var singlePlayerButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Player vs AI";
	tempHolder.id = "singlePlayerButtonText"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	singlePlayerButton.appendChild(tempHolder);
	menuDiv.appendChild(singlePlayerButton);
	// Now the two player local clickable div
	var playerVsPlayerLocalButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Player vs Player Local";
	tempHolder.id = "playerVsPlayerLocalButtonText"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	playerVsPlayerLocalButton.appendChild(tempHolder);
	menuDiv.appendChild(playerVsPlayerLocalButton);
	// Now the two player online clickable div
	var playerVsPlayerOnlineButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Player vs Player Online";
	tempHolder.id = "playerVsPlayerOnlineButtonText"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	playerVsPlayerOnlineButton.appendChild(tempHolder);
	menuDiv.appendChild(playerVsPlayerOnlineButton);
	// Now the clickable settings button which taked you to the settings menu
	var settingsButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Settings";
	tempHolder.id = "settingsButtonText"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	settingsButton.appendChild(tempHolder);
	menuDiv.appendChild(settingsButton);
	// Here we setup a hover handling thing to make the menu seem interactive
	$(".menuOption").hover(function()
	{
		// Mouse enter animation
		$(this).stop().fadeOut(100,function(){
		$(this).css("color", "red");
		$(this).fadeIn(100);});
	},function()
	{
		$(this).stop().fadeIn(100);
		$(this).css("color", "blue");		
	});
	// Now we set up separate handlers for each menu option
	// Single player button
	$("#singlePlayerButtonText").click(function()
	{
		emptyMenu();
		loadSinglePlayerMenu();
	});
	// Player vs Player Local button
	$("#playerVsPlayerLocalButtonText").click(function()
	{
		emptyMenu();
		loadPlayerVsPlayerLocalMenu();
	});
	// Player vs Player Online button
	$("#playerVsPlayerOnlineButtonText").click(function()
	{
		emptyMenu();
		loadPlayerVsPlayerOnlineMenu();
	});
	// Settings button
	$("#settingsButtonText").click(function()
	{
		emptyMenu();
		loadSettingsMenu();
	});
	// Then we sit and wait for menuUp to be false
	waitForMenuDown();
}

// Code realating to single player menu
function loadSinglePlayerMenu()
{
	// Setup title
	var titleText = document.createElement("div");
	var tempHolder = document.createElement("H1");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "PONG - Player vs AI Setup";
	titleText.appendChild(tempHolder);
	tempHolder = document.createElement("hr");
	tempHolder.setAttribute("style", "border-color:blue; width:" + widthCanvas*(2/3) + "px;");
	titleText.appendChild(tempHolder);
	menuDiv.appendChild(titleText);
	// Enter number of points
	var tempHolder2 = document.createElement("H2");
	tempHolder2.setAttribute("style", "color:blue; text-align:center");
	tempHolder = document.createTextNode("Play Until (1-30): ")
	tempHolder2.appendChild(tempHolder);
	tempHolder = document.createElement("input");
	tempHolder.setAttribute("type", "number");
	tempHolder.setAttribute("id", "pointsInput");
	tempHolder.setAttribute("min", "1");
	tempHolder.setAttribute("max", "30");
	tempHolder.setAttribute("value", 10);
	tempHolder2.appendChild(tempHolder);
	menuDiv.appendChild(tempHolder2);
	// Enter difficulty
	var tempHolder2 = document.createElement("H2");
	tempHolder2.setAttribute("style", "color:blue; text-align:center");
	tempHolder = document.createTextNode("Difficulty: ")
	tempHolder2.appendChild(tempHolder);
	tempHolder = document.createElement("button");
	tempHolder.setAttribute("type","button");
	tempHolder.innerHTML = "Easy"; // Text in button
	tempHolder.onclick = function(){aiDifficulty = 1;}; // Set the difficulty to 1
	tempHolder2.appendChild(tempHolder);
	tempHolder = document.createElement("button");
	tempHolder.setAttribute("type","button");
	tempHolder.innerHTML = "Medium"; // Text in button
	tempHolder.onclick = function(){aiDifficulty = 2;}; // Set the difficulty to 2
	tempHolder2.appendChild(tempHolder);
	tempHolder = document.createElement("button");
	tempHolder.setAttribute("type","button");
	tempHolder.innerHTML = "Hard"; // Text in button
	tempHolder.onclick = function(){aiDifficulty = 3;}; // Set the difficulty to 3
	tempHolder2.appendChild(tempHolder);
	tempHolder = document.createElement("button");
	tempHolder.setAttribute("type","button");
	tempHolder.innerHTML = "Brian"; // Text in button
	tempHolder.onclick = function(){aiDifficulty = 4;}; // Set the difficulty to 4
	tempHolder2.appendChild(tempHolder);
	menuDiv.appendChild(tempHolder2);
	// Start game
	var startGameButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Start Game";
	tempHolder.id = "startGameButton"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	startGameButton.appendChild(tempHolder);
	menuDiv.appendChild(startGameButton);
	// Main menu
	var mainMenuButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Main Menu";
	tempHolder.id = "mainMenuButton"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	mainMenuButton.appendChild(tempHolder);
	menuDiv.appendChild(mainMenuButton);
	// Button hover handlers
	$(".menuOption").hover(function()
	{
		// Mouse enter animation
		$(this).stop().fadeOut(100,function(){
		$(this).css("color", "red");
		$(this).fadeIn(100);});
	},function()
	{
		$(this).stop().fadeIn(100);
		$(this).css("color", "blue");		
	});
	// Button click handlers
	// Main menu button
	$("#mainMenuButton").click(function()
	{
		emptyMenu();
		loadMainMenu();
	});
	// Start game button
	$("#startGameButton").click(function()
	{
		// SETUP THE GAME FIRST!!!!
		playerOnePoints = 0; // Zero the points
		playerTwoPoints = 0;
		// Reset the ball
		xPosBall = .5 - ballRadius*.5; // This and the next line
		yPosBall = .5 + ballRadius*.5; // are to start the ball in the middle
		// Reset the paddle positions
		yPosPad1 = .5-(1/2)*padHeight; // Top left corner will be at 1/2 of the screen minus half the height of the pad (top left is 0,0)
		xPosPad1 = 0; // Top left corner is at zero, the left edge of the screen
		yPosPad2 = .5-(1/2)*padHeight; // Top left corner will be at 1/2 of the screen minus half the height of the pad (top left is 0,0)
		xPosPad2 = 1-padWidth; // xPos will be on the right side of the screen minus the width of the pad so the pad is on the screen
		//VELOCITIES
		// AI difficulty is set as soon as a button is pressed, don't have to handle that!
		// Set the velocities somewhat different for each difficulty, easy and medium have the same.
		if(aiDifficulty == 1)
		{
			// Easy
			padOneYVeloc = .000002;
			padOneXVeloc = .0000007;
			
			padTwoYVeloc = .0000007;
			padTwoXVeloc = .00000035;
			
			yVelocBallBase = .0000005; // Y velocity will chosen based off this at the start of a point
			xVelocBallBase = .0000004; // X velocity will chosen based off this at the start of a point
			
			maxXVelocBall = .000002; // Maximum x velocity
			maxYVelocBall = .0000025; // Maximum y velocity
			
			xVelocModifier = .15; // Fraction of original speed to add per hit
			
			aiRandRefreshTime = 1000; // Set the randomization refresh time
		}
		if(aiDifficulty == 2)
		{
			// Medium
			padOneYVeloc = .000002;
			padOneXVeloc = .0000007;
			
			padTwoYVeloc = .0000008;
			padTwoXVeloc = .00000035;
			
			yVelocBallBase = .0000005; // Y velocity will chosen based off this at the start of a point
			xVelocBallBase = .0000004; // X velocity will chosen based off this at the start of a point
			
			maxXVelocBall = .000002; // Maximum x velocity
			maxYVelocBall = .0000025; // Maximum y velocity
			
			xVelocModifier = .15; // Fraction of original speed to add per hit
			
			aiRandRefreshTime = 500; // Set the randomization refresh time
		}
		if(aiDifficulty == 3)
		{
			// Hard
			padOneYVeloc = .000002;
			padOneXVeloc = .0000007;
			
			padTwoYVeloc = .0000013;
			padTwoXVeloc = .0000007;
			
			yVelocBallBase = .0000005; // Y velocity will chosen based off this at the start of a point
			xVelocBallBase = .0000004; // X velocity will chosen based off this at the start of a point
			
			maxXVelocBall = .0000025; // Maximum x velocity
			maxYVelocBall = .000003; // Maximum y velocity
			
			xVelocModifier = .25; // Fraction of original speed to add per hit
			
			aiRandRefreshTime = 250; // Set the randomization refresh time
		}
		if(aiDifficulty == 4)
		{
			// Brian Mode
			padOneYVeloc = .000002;
			padOneXVeloc = .0000007;
			
			padTwoYVeloc = .000004;
			padTwoXVeloc = .0000007;
			
			yVelocBallBase = .000001; // Y velocity will chosen based off this at the start of a point
			xVelocBallBase = .0000008; // X velocity will chosen based off this at the start of a point
			
			maxXVelocBall = .000004; // Maximum x velocity
			maxYVelocBall = .000005; // Maximum y velocity
			
			xVelocModifier = .25; // Fraction of original speed to add per hit
			
			aiRandOffset = 0; // Set the initial randomization to zero, only needed in this special super difficult mode, others will set a new one anyways
			aiRandRefreshTime = 0; // Set the randomization refresh time to zero which disable randomization.
		}
		// Set game mode
		gameLocal = false; // Make sure the three states are set up correctly
		gameVsAi = true;
		gameOnline = false;
		// Other state vars
		lastScored = 0; // To start the ball in a random direction
		justReset = true; // To make sure the ball doesn't move until someone moves a paddle
		var tempPoints = parseInt(document.getElementById("pointsInput").value, 10); // Store value to process with limits
		if(tempPoints > 30)
			tempPoints = 30;
		if(tempPoints < 1)
			tempPoints = 1;
		winPoints = tempPoints; // Set up the number of points that wins a game
		menuUp = false; // And get rid of the menu so we can play!
	});
}

// Code realating to player vs player menu (local)
function loadPlayerVsPlayerLocalMenu()
{
	// Setup title
	var titleText = document.createElement("div");
	var tempHolder = document.createElement("H1");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "PONG - Player vs Player Local Setup";
	titleText.appendChild(tempHolder);
	tempHolder = document.createElement("hr");
	tempHolder.setAttribute("style", "border-color:blue; width:" + widthCanvas*(2/3) + "px;");
	titleText.appendChild(tempHolder);
	menuDiv.appendChild(titleText);
	// Enter number of points
	var tempHolder2 = document.createElement("H2");
	tempHolder2.setAttribute("style", "color:blue; text-align:center");
	tempHolder = document.createTextNode("Play Until (1-30): ")
	tempHolder2.appendChild(tempHolder);
	tempHolder = document.createElement("input");
	tempHolder.setAttribute("type", "number");
	tempHolder.setAttribute("id", "pointsInput");
	tempHolder.setAttribute("min", "1");
	tempHolder.setAttribute("max", "30");
	tempHolder.setAttribute("value", 10);
	tempHolder2.appendChild(tempHolder);
	menuDiv.appendChild(tempHolder2);
	// Start game
	var startGameButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Start Game";
	tempHolder.id = "startGameButton"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	startGameButton.appendChild(tempHolder);
	menuDiv.appendChild(startGameButton);
	// Main menu
	var mainMenuButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Main Menu";
	tempHolder.id = "mainMenuButton"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	mainMenuButton.appendChild(tempHolder);
	menuDiv.appendChild(mainMenuButton);
	// Button hover handlers
	$(".menuOption").hover(function()
	{
		// Mouse enter animation
		$(this).stop().fadeOut(100,function(){
		$(this).css("color", "red");
		$(this).fadeIn(100);});
	},function()
	{
		$(this).stop().fadeIn(100);
		$(this).css("color", "blue");		
	});
	// Button click handlers
	// Main menu button
	$("#mainMenuButton").click(function()
	{
		emptyMenu();
		loadMainMenu();
	});
	// Start game button
	$("#startGameButton").click(function()
	{
		// SETUP THE GAME FIRST!!!!
		playerOnePoints = 0; // Zero the points
		playerTwoPoints = 0;
		// Reset the ball
		xPosBall = .5 - ballRadius*.5; // This and the next line
		yPosBall = .5 + ballRadius*.5; // are to start the ball in the middle
		// Reset the paddle positions
		yPosPad1 = .5-(1/2)*padHeight; // Top left corner will be at 1/2 of the screen minus half the height of the pad (top left is 0,0)
		xPosPad1 = 0; // Top left corner is at zero, the left edge of the screen
		yPosPad2 = .5-(1/2)*padHeight; // Top left corner will be at 1/2 of the screen minus half the height of the pad (top left is 0,0)
		xPosPad2 = 1-padWidth; // xPos will be on the right side of the screen minus the width of the pad so the pad is on the screen
		//VELOCITIES
		padOneYVeloc = .000002;
		padOneXVeloc = .0000007;
		
		padTwoYVeloc = .000002;
		padTwoXVeloc = .0000007;
		
		yVelocBallBase = .0000005; // Y velocity will chosen based off this at the start of a point
		xVelocBallBase = .0000004; // X velocity will chosen based off this at the start of a point
		
		maxXVelocBall = .000002; // Maximum x velocity
		maxYVelocBall = .0000025; // Maximum y velocity
		
		xVelocModifier = .2; // Fraction of original speed to add per hit
		// Set game mode
		gameLocal = true; // Make sure the three states are set up correctly
		gameVsAi = false;
		gameOnline = false;
		// Other state vars
		lastScored = 0; // To start the ball in a random direction
		justReset = true; // To make sure the ball doesn't move until someone moves a paddle
		var tempPoints = parseInt(document.getElementById("pointsInput").value, 10); // Store value to process with limits
		if(tempPoints > 30)
			tempPoints = 30;
		if(tempPoints < 1)
			tempPoints = 1;
		winPoints = tempPoints; // Set up the number of points that wins a game
		menuUp = false; // And get rid of the menu so we can play!
	});
}

// ONLINE MENU NOT FULLY IMPLEMENTED!!!!!!
function loadPlayerVsPlayerOnlineMenu()
{
	// Setup title
	var titleText = document.createElement("div");
	var tempHolder = document.createElement("H1");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "PONG - Player vs Player Online Setup";
	titleText.appendChild(tempHolder);
	tempHolder = document.createElement("hr");
	tempHolder.setAttribute("style", "border-color:blue; width:" + widthCanvas*(2/3) + "px;");
	titleText.appendChild(tempHolder);
	menuDiv.appendChild(titleText);
	// Enter name of game
	var tempHolder2 = document.createElement("H2");
	tempHolder2.setAttribute("style", "color:blue; text-align:center");
	tempHolder = document.createTextNode("Enter game ID: ")
	tempHolder2.appendChild(tempHolder);
	tempHolder = document.createElement("input");
	tempHolder.setAttribute("id", "gameIDInput");
	tempHolder.setAttribute("value", "");
	tempHolder2.appendChild(tempHolder);
	menuDiv.appendChild(tempHolder2);
	// Enter number of points
	var tempHolder2 = document.createElement("H2");
	tempHolder2.setAttribute("style", "color:blue; text-align:center");
	tempHolder = document.createTextNode("Play Until (1-30): ")
	tempHolder2.appendChild(tempHolder);
	tempHolder = document.createElement("input");
	tempHolder.setAttribute("type", "number");
	tempHolder.setAttribute("id", "pointsInput");
	tempHolder.setAttribute("min", "1");
	tempHolder.setAttribute("max", "30");
	tempHolder.setAttribute("value", 10);
	tempHolder2.appendChild(tempHolder);
	menuDiv.appendChild(tempHolder2);
	// Join Game
	var joinGameButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Join Game";
	tempHolder.id = "joinGameButton"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	joinGameButton.appendChild(tempHolder);
	menuDiv.appendChild(joinGameButton);
	// Make game
	var makeGameButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Make Game";
	tempHolder.id = "makeGameButton"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	makeGameButton.appendChild(tempHolder);
	menuDiv.appendChild(makeGameButton);
	// Main menu
	var mainMenuButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Main Menu";
	tempHolder.id = "mainMenuButton"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	mainMenuButton.appendChild(tempHolder);
	menuDiv.appendChild(mainMenuButton);
	// Button hover handlers
	$(".menuOption").hover(function()
	{
		// Mouse enter animation
		$(this).stop().fadeOut(100,function(){
		$(this).css("color", "red");
		$(this).fadeIn(100);});
	},function()
	{
		$(this).stop().fadeIn(100);
		$(this).css("color", "blue");		
	});
	// Button click handlers
	// Main menu button
	$("#mainMenuButton").click(function()
	{
		emptyMenu();
		loadMainMenu();
	});
	// Join Game Button
	$("#joinGameButton").click(function()
	{
		// SETUP THE GAME FIRST!!!!
		playerOnePoints = 0; // Zero the points
		playerTwoPoints = 0;
		// Reset the ball
		xPosBall = .5 - ballRadius*.5; // This and the next line
		yPosBall = .5 + ballRadius*.5; // are to start the ball in the middle
		// Reset the paddle positions
		yPosPad1 = .5-(1/2)*padHeight; // Top left corner will be at 1/2 of the screen minus half the height of the pad (top left is 0,0)
		xPosPad1 = 0; // Top left corner is at zero, the left edge of the screen
		yPosPad2 = .5-(1/2)*padHeight; // Top left corner will be at 1/2 of the screen minus half the height of the pad (top left is 0,0)
		xPosPad2 = 1-padWidth; // xPos will be on the right side of the screen minus the width of the pad so the pad is on the screen
		//VELOCITIES
		padOneYVeloc = .000002;
		padOneXVeloc = .0000007;
		
		padTwoYVeloc = .000002;
		padTwoXVeloc = .0000007;
		
		yVelocBallBase = .0000005; // Y velocity will chosen based off this at the start of a point
		xVelocBallBase = .0000004; // X velocity will chosen based off this at the start of a point
		
		maxXVelocBall = .000002; // Maximum x velocity
		maxYVelocBall = .0000025; // Maximum y velocity
		
		xVelocModifier = .2; // Fraction of original speed to add per hit
		// Set game mode
		gameLocal = false; // Make sure the three states are set up correctly
		gameVsAi = false;
		gameOnline = true;
		// Other state vars
		lastScored = 0; // To start the ball in a random direction
		justReset = true; // To make sure the ball doesn't move until someone moves a paddle
		// Get game ID
		gameID = document.getElementById("gameIDInput").value;
		if(gameID == "")
		{
			alert("Please enter a game ID");
		}
		else
		{
			firebaseRef.child(gameID).once('value', function(snap)
			{
				if (snap.val() === null)
				{
					alert("No game with that ID exists!");
				}
				else
				{
					if(!(snap.child('misc').child('clientJoined').val()==true))
					{
						// Set that a client has joined
						firebaseRef.child(gameID).child('misc').update(
						{
						clientJoined: true
						});
						isHost = false; // unfortunate heh...
						// Now we grab the winpoints
						winPoints = snap.child('misc').child('winPoints');
						// And then get rid of the menu and get on with the game!
						menuUp = false;
					}
					else
					{
						alert("Someone has already joined that game!");
					}
				}
			});
		}
	});
	// Make game button
	$("#makeGameButton").click(function()
	{
		// SETUP THE GAME FIRST!!!!
		playerOnePoints = 0; // Zero the points
		playerTwoPoints = 0;
		// Reset the ball
		xPosBall = .5 - ballRadius*.5; // This and the next line
		yPosBall = .5 + ballRadius*.5; // are to start the ball in the middle
		// Reset the paddle positions
		yPosPad1 = .5-(1/2)*padHeight; // Top left corner will be at 1/2 of the screen minus half the height of the pad (top left is 0,0)
		xPosPad1 = 0; // Top left corner is at zero, the left edge of the screen
		yPosPad2 = .5-(1/2)*padHeight; // Top left corner will be at 1/2 of the screen minus half the height of the pad (top left is 0,0)
		xPosPad2 = 1-padWidth; // xPos will be on the right side of the screen minus the width of the pad so the pad is on the screen
		//VELOCITIES
		padOneYVeloc = .000002;
		padOneXVeloc = .0000007;
		
		padTwoYVeloc = .000002;
		padTwoXVeloc = .0000007;
		
		yVelocBallBase = .0000005; // Y velocity will chosen based off this at the start of a point
		xVelocBallBase = .0000004; // X velocity will chosen based off this at the start of a point
		
		maxXVelocBall = .000002; // Maximum x velocity
		maxYVelocBall = .0000025; // Maximum y velocity
		
		xVelocModifier = .2; // Fraction of original speed to add per hit
		// Set game mode
		gameLocal = false; // Make sure the three states are set up correctly
		gameVsAi = false;
		gameOnline = true;
		// Other state vars
		lastScored = 0; // To start the ball in a random direction
		justReset = true; // To make sure the ball doesn't move until someone moves a paddle
		var tempPoints = parseInt(document.getElementById("pointsInput").value, 10); // Store value to process with limits
		if(tempPoints > 30)
			tempPoints = 30;
		if(tempPoints < 1)
			tempPoints = 1;
		winPoints = tempPoints; // Set up the number of points that wins a game
		gameID = document.getElementById("gameIDInput").value;
		// Now setup the game in firebase
		cancelOnlineWait = false; // Make sure that the waiting screen isn't insta canceled
		if(gameID == "")
		{
			alert("Please enter a game ID");
		}
		else
		{
			firebaseRef.child(gameID).once('value', function(snapshot)
			{
				if (snapshot.val() === null)
				{
					isHost = true; // Tell it like it is
					// Now we finally put all the vars into firebase
					firebaseRef.child(gameID).child('ballVeloc').set(
					{
					xVelocBall: xVelocBall,
					yVelocBall: yVelocBall
					});
					firebaseRef.child(gameID).child('hostPadLoc').set(
					{
					xPosPadHost: xPosPad1,
					yPosPadHost: yPosPad1
					});
					firebaseRef.child(gameID).child('clientPadLoc').set(
					{
					xPosPadClient: xPosPad2,
					yPosPadClient: yPosPad2
					});
					firebaseRef.child(gameID).child('ballLoc').set(
					{
					xPosBall: xPosBall,
					yPosBall: yPosBall
					});
					firebaseRef.child(gameID).child('hostControls').set(
					{
					padHostUp: false,
					padHostDown: false,
					padHostLeft: false,
					padhostRight: false
					});
					firebaseRef.child(gameID).child('clientControls').set(
					{
					padClientUp: false,
					padClientDown: false,
					padClientLeft: false,
					padClientRight: false
					});
					firebaseRef.child(gameID).child('gameStatus').set(
					{
					lastScored: lastScored,
					displayWin: displayWin,
					menuUp: false,// HAS TO BE FALSE OR CLIENT INSTA GOES TO MENU ON CONNECT!!!!
					gamePaused: gamePaused,
					justReset: justReset,
					hostPoints: playerOnePoints,
					clientPoints: playerTwoPoints
					});
					firebaseRef.child(gameID).child('misc').set(
					{
					winPoints: winPoints,
					clientJoined: false
					}
					);
					// Done putting everything into firebase
					emptyMenu();
					// Setup title
					var titleText = document.createElement("div");
					var tempHolder = document.createElement("H1");
					tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
					tempHolder.innerHTML = "Waiting for player";
					titleText.appendChild(tempHolder);
					tempHolder = document.createElement("hr");
					tempHolder.setAttribute("style", "border-color:blue; width:" + widthCanvas*(2/3) + "px;");
					titleText.appendChild(tempHolder);
					menuDiv.appendChild(titleText);
					// Cancel
					var mainMenuButton = document.createElement("div");
					tempHolder = document.createElement("H2");
					tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
					tempHolder.innerHTML = "Cancel";
					tempHolder.id = "cancelButton"; // So that hover and click events can later be processed.
					tempHolder.className = "menuOption";
					mainMenuButton.appendChild(tempHolder);
					menuDiv.appendChild(mainMenuButton);
					// Button hover handlers
					$(".menuOption").hover(function()
					{
						// Mouse enter animation
						$(this).stop().fadeOut(100,function(){
						$(this).css("color", "red");
						$(this).fadeIn(100);});
					},function()
					{
						$(this).stop().fadeIn(100);
						$(this).css("color", "blue");		
					});
					// Button click handlers
					// Cancel button
					$("#cancelButton").click(function()
					{
						cancelOnlineWait = true;
						emptyMenu();
						loadPlayerVsPlayerOnlineMenu();
					});
					waitForJoin(); // This function will set menuUp to false and start the game when someone joins.
				}
				else
				{
					alert("A game with that ID already exists!");
				}
			});
		}
	});
}

function waitForJoin()
{
	if(!cancelOnlineWait)
	{
		firebaseRef.child(gameID).once('value', function(snap)
		{
			if(snap.child('misc').child('clientJoined').val() == true) // If someone joined get rid of the menu and get to the game!
			{
				menuUp = false;
			}
			else // Otherwise sit around and run this fucntion until someone joins or its canceled
			{
				setTimeout(function(){waitForJoin()}, 50);
			}	
		});
	}
	else
	{
		isHost = false; // Well damn son, it was good while it lasted
	}
}

// Code related to settings menu
function loadSettingsMenu()
{
	// Setup title
	var titleText = document.createElement("div");
	var tempHolder = document.createElement("H1");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "PONG - Settings";
	titleText.appendChild(tempHolder);
	tempHolder = document.createElement("hr");
	tempHolder.setAttribute("style", "border-color:blue; width:" + widthCanvas*(2/3) + "px;");
	titleText.appendChild(tempHolder);
	menuDiv.appendChild(titleText);
	// Input resolution
	var tempHolder2 = document.createElement("H2");
	tempHolder2.setAttribute("style", "color:blue; text-align:center");
	tempHolder = document.createTextNode("Width: ")
	tempHolder2.appendChild(tempHolder);
	tempHolder = document.createElement("input");
	tempHolder.setAttribute("type", "number");
	tempHolder.setAttribute("id", "widthInput");
	tempHolder.setAttribute("min", "400");
	tempHolder.setAttribute("max", "2000");
	tempHolder.setAttribute("value", widthCanvas);
	tempHolder2.appendChild(tempHolder);
	tempHolder = document.createTextNode("  Height: ")
	tempHolder2.appendChild(tempHolder);
	tempHolder = document.createElement("input");
	tempHolder.setAttribute("type", "number");
	tempHolder.setAttribute("id", "heightInput");
	tempHolder.setAttribute("min", "400");
	tempHolder.setAttribute("max", "2000");
	tempHolder.setAttribute("value", heightCanvas);
	tempHolder2.appendChild(tempHolder);
	menuDiv.appendChild(tempHolder2);
	// Apply
	var applyButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Apply";
	tempHolder.id = "applyButton"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	applyButton.appendChild(tempHolder);
	menuDiv.appendChild(applyButton);
	// Main menu
	var mainMenuButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Main Menu";
	tempHolder.id = "mainMenuButton"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	mainMenuButton.appendChild(tempHolder);
	menuDiv.appendChild(mainMenuButton);
	// Button hover handlers
	$(".menuOption").hover(function()
	{
		// Mouse enter animation
		$(this).stop().fadeOut(100,function(){
		$(this).css("color", "red");
		$(this).fadeIn(100);});
	},function()
	{
		$(this).stop().fadeIn(100);
		$(this).css("color", "blue");		
	});
	// Button click handlers
	// Main menu button
	$("#mainMenuButton").click(function()
	{
		emptyMenu();
		loadMainMenu();
	});
	// Apply button
	$("#applyButton").click(function()
	{
		// Set everything here and then reload menu entirely
		var inputHeight = parseInt(document.getElementById('heightInput').value, 10);
		if((inputHeight >= 400)&&(inputHeight <= 2000))
		{
			heightCanvas = inputHeight;
			$("#pongCanvas").attr("height", inputHeight);
			$("#pongCanvas").css("height", inputHeight);
		}
		var inputWidth = parseInt(document.getElementById('widthInput').value, 10);
		if((inputWidth >= 400)&&(inputWidth <= 2000))
		{
			widthCanvas = inputWidth;
			$("#pongCanvas").attr("width", inputWidth);
			$("#pongCanvas").css("width", inputWidth);
		}
		// Now reload the menu entirely!
		unloadMenu();
		loadMenuBackground();
		loadMainMenu();
	});
}

function waitForMenuDown()
{
	if(menuUp == true)
		setTimeout(function(){waitForMenuDown()}, 100);
	else
	{
		// Nice little fade out touch
		$("#menuDiv").fadeOut(400, function()
		{
			unloadMenu();
			mainPong();
		});
	}
}

function emptyMenu()
{
	$("#menuDiv").empty();
}

function unloadMenu()
{
	$("#menuDiv").remove();
}

function renderPong()
{
	//Clear the background
	CTX2D.clearRect(0,0,widthCanvas,heightCanvas);
	
	//Make background white so it is different from page background
	CTX2D.beginPath();
	CTX2D.rect(0,0,widthCanvas,heightCanvas);
	CTX2D.fillStyle = 'blue';
	CTX2D.fill();

	// Draw the scores on the screen	
	CTX2D.beginPath();
	CTX2D.fillStyle = 'white';
	CTX2D.font = "100px Arial";
	CTX2D.fillText(playerOnePoints,(widthCanvas/2)-120,100);
	CTX2D.fillText(playerTwoPoints,(widthCanvas/2)+10,100);
	
	// Draw the ball.
	CTX2D.beginPath();
	CTX2D.arc(xPosBall*widthCanvas,yPosBall*heightCanvas,ballRadius*widthCanvas,0,2*Math.PI);
	CTX2D.fillStyle = 'black';
	CTX2D.fill();
	
	// Draw paddle 1
	CTX2D.beginPath();
	CTX2D.rect(xPosPad1*widthCanvas,yPosPad1*heightCanvas,padWidth*widthCanvas,padHeight*heightCanvas);
	CTX2D.fill();
	
	// Draw paddle 2
	CTX2D.beginPath(); // This seems to be not necessary, yay optimization later?
	CTX2D.rect(xPosPad2*widthCanvas,yPosPad2*heightCanvas,padWidth*widthCanvas,padHeight*heightCanvas);
	CTX2D.fill();
	
	// Centerline drawn through a rect
	CTX2D.beginPath();
	CTX2D.rect((.5-widthCenterLine)*widthCanvas,0,.5*widthCenterLine*widthCanvas,heightCanvas);
	CTX2D.fill();
}

function detectCollision()
{
	// First make sure the paddles are in bounds! This ensures collisions are calculated correctly
	if(yPosPad1 > (1-padHeight))
		yPosPad1 = 1-padHeight;
	else if(yPosPad1 < 0)
		yPosPad1 = 0;
	// XPOS Check
	if(xPosPad1 < 0)
		xPosPad1 = 0;
	else if(xPosPad1 > .25)
		xPosPad1 = .25;
	// Check the second paddle
	if(yPosPad2 > (1-padHeight))
		yPosPad2  = 1-padHeight;
	else if(yPosPad2 < 0)
		yPosPad2 = 0;
	// XPOS Check
	if(xPosPad2 > (1-padWidth))
	{
		xPosPad2 = 1-padWidth;
	}
	else if(xPosPad2 < (1-.25-padWidth))
	{
		xPosPad2 = 1-.25-padWidth;
	}
	// Now we do a loop that the ball can only exit if it is within the y confines
	// We want it to run at least once to check for a paddle collision
	do
	{
		if(yPosBall < (0+ballRadius))
		{
			//lastYPosBall = yPosBall; // Perhaps dont set this, setting it enables the ball to sort of bounce around the paddle, not setting it makes this less likely except with lots of lag
			//Last ball position needs to be set in a more complicated way to be bulletproof (currently lag can lag a ball through a paddle)
			yPosBall = 2*ballRadius - yPosBall; // Don't question, this took a while to figure out.
			yVelocBall = -yVelocBall; // Simple
		}
		if(yPosBall > (1-ballRadius))
		{
			//lastYPosBall = yPosBall;
			//Last ball position needs to be set in a more complicated way to be bulletproof
			yPosBall = 2 - yPosBall - 2*ballRadius; // Also don't question, took me a while to figure
			yVelocBall = -yVelocBall; // Simple
		}
		//Below is nice code that is not effected by lag but I abandoned because it doesn't seem to work, I'll revisit it
		/*
		// Now we check to see if paddle collision occured
		var slopeBall = (yVelocBall)/(xVelocBall);//(lastYPosBall-yPosBall)/(lastXPosBall - xPosBall);
		var padOneLowerBound = yPosPad1+padHeight+ballRadius; // Lower as in lower on the screen but actually higher value
		var padTwoLowerBound = yPosPad2+padHeight+ballRadius;
		var padOneUpperBound = yPosPad1-ballRadius;
		var padTwoUpperBound = yPosPad2-ballRadius;
		var ballYPad1 = lastYPosBall + slopeBall*(xPosPad1+padWidth); // padwidth is added so the ycoord of the inside facing wall is taken
		var ballYPad2 = lastYPosBall + slopeBall*xPosPad2;
		// Condition for coliding with pad 1
		if((ballYPad1<padOneLowerBound)&&(ballYPad1>padOneUpperBound))
		{
			// Now check if the paddle is between the new and old xcoords of the ball
			if(xVelocBall < 0) // If the velocity is not negative this paddle will not be reflecting it anyways
			{
				if(((lastXPosBall-ballRadius) >= (xPosPad1+padWidth))&&((xPosBall-ballRadius) < (xPosPad1+padWidth)))
				{
					// Do whatever if collision is detected
					xPosBall = 2*xPosPad1 + 2*padWidth - xPosBall + 2*ballRadius; // Do not question took a while to calculate
					xVelocBall = -xVelocBall;
				}
			}
		}
		// Condition for coliding with pad 2
		if((ballYPad2<padTwoLowerBound)&&(ballYPad2>padTwoUpperBound))
		{
			// Now check if the paddle is between the new and old xcoords of the ball
			if(xVelocBall > 0) // If the velocity is not positive this paddle will not be reflecting it anyways
			{
				if(((lastXPosBall+ballRadius) <= xPosPad2)&&((xPosBall+ballRadius) > xPosPad2))
				{
					// Do whatever if collision is detected
					xPosBall = 2*xPosPad2 - xPosBall - 2*ballRadius; // Don't question, took a while to calculate....
					xVelocBall = -xVelocBall;
				}
			}
		}*/
		
		//Problem with below is odd behaviour when you hit with the very edge. Looks odd sometimes
		
		// The following means the ball is coliding in the x domain with paddle1
		if(((xPosBall-ballRadius)<(xPosPad1+padWidth))&&((xPosBall+ballRadius)>xPosPad1))
		{
			// Now make sure that the ball is in the appropriate y domain
			if((yPosBall>(yPosPad1-ballRadius))&&(yPosBall<(yPosPad1+padHeight+ballRadius)))
			{
				if(xVelocBall < 0)
				{
					// Paddle velocity modifiers
					var midPad = yPosPad1+(.5*padHeight);
					if(midPad > yPosBall)
					{
						//Case if ball hits upper half of paddle
						yVelocBall = yVelocBall - ((midPad-yPosBall)/padHeight)*yVelocBallBase*2.5; // The number at the end (1.2) is a scaling factor to make deflections in the y direction more or less pronounced
					}
					else if(midPad < yPosBall)
					{
						//Case if ball hits lower half of paddle
						yVelocBall = yVelocBall + ((yPosBall-midPad)/padHeight)*yVelocBallBase*2.5;
					}
					// To keep the ball in the y veloc limits
					var negate = 1;
					if(yVelocBall < 0)
						negate = -1;
					if(Math.abs(yVelocBall) > maxYVelocBall)
						yVelocBall = maxYVelocBall*negate;
					// If the ball hits the center of the paddle the y velocity is not modified hence why that case is excluded
					// xVelocity reflection
					xVelocBall = -xVelocBall - (xVelocModifier*xVelocBallBase*-1);
					if(Math.abs(xVelocBall) > maxXVelocBall)
						xVelocBall = maxXVelocBall;
					// Now reflect the ball
					xPosBall = 2*xPosPad1 + 2*padWidth - xPosBall + 2*ballRadius; // Do not question took a while to calculate, technicly wrong due to new y veloc modifiers...
					if(padOneRight&&(padOneXVeloc > xVelocBall))
						xVelocBall = padOneXVeloc;
				}
				else if(xVelocBall > 0)
				{
					// Need to calculate it out
				}
			}
		}
		// The following means the ball is coliding in the x domain with paddle2
		if(((xPosBall+ballRadius)>xPosPad2)&&((xPosBall-ballRadius)<(xPosPad2+padWidth)))
		{
			// Now make sure that the ball is in the appropriate y domain
			if((yPosBall>(yPosPad2-ballRadius))&&(yPosBall<(yPosPad2+padHeight+ballRadius)))
			{
				if(xVelocBall > 0)
				{
					// Paddle velocity modifiers
					var midPad = yPosPad2+(.5*padHeight);
					if(midPad > yPosBall)
					{
						//Case if ball hits upper half of paddle
						yVelocBall = yVelocBall - ((midPad-yPosBall)/padHeight)*yVelocBallBase*2.5; // The number at the end (1.2) is a scaling factor to make deflections in the y direction more or less pronounced
					}
					else if(midPad < yPosBall)
					{
						//Case if ball hits lower half of paddle
						yVelocBall = yVelocBall + ((yPosBall-midPad)/padHeight)*yVelocBallBase*2.5;
					}
					// To keep the ball in the y veloc limits
					var negate = 1;
					if(yVelocBall < 0)
						negate = -1;
					if(Math.abs(yVelocBall) > maxYVelocBall)
						yVelocBall = maxYVelocBall*negate;
					// If the ball hits the center of the paddle the y velocity is not modified hence why that case is excluded
					// xVelocity reflection
					xVelocBall = -xVelocBall - (xVelocModifier*xVelocBallBase);
					if(Math.abs(xVelocBall) > maxXVelocBall)
						xVelocBall = maxXVelocBall*-1;
					// Now reflect the ball
					xPosBall = 2*xPosPad2 - xPosBall - 2*ballRadius; // Don't question, took a while to calculate....
					if(padTwoLeft&&(padTwoXVeloc > Math.abs(xVelocBall)))
						xVelocBall = -padTwoXVeloc;
				}
				else if(xVelocBall < 0)
				{
					// Need to calculate it out
				}
			}
		}
	}
	while((yPosBall < (0+ballRadius))||(yPosBall > (1-ballRadius)));
}

function aiRandRefresh()
{
	if(Math.random() > 0.5)
		aiRandOffset = -Math.random()*padHeight*.5; // This will make the variation too large but thats okay, will make it not miss for hard
	else
		aiRandOffset = Math.random()*padHeight*.5;
	isRandInProgress = false;
}

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
	if(gameVsAi)
	{
		if((!isRandInProgress)&&(aiRandRefreshTime!=0))
		{
			isRandInProgress = true;
			setTimeout(function(){aiRandRefresh();}, aiRandRefreshTime);
		}
		// Don't bother with moving the AI paddle unless the ball is headed to the right
		if(xVelocBall > 0)
		{
			if(yPosBall > ((yPosPad2+(padHeight/2))+aiRandOffset))
			{
				yPosPad2 += padTwoYVeloc*heightCanvas*deltaTime;
				if(yPosBall < ((yPosPad2+(padHeight/2))+aiRandOffset))
					yPosPad2 = yPosBall-(padHeight/2)-aiRandOffset;
			}
			else if(yPosBall < ((yPosPad2+(padHeight/2))+aiRandOffset))
			{
				yPosPad2 -= padTwoYVeloc*heightCanvas*deltaTime;
				if(yPosBall > ((yPosPad2+(padHeight/2))+aiRandOffset))
					yPosPad2 = yPosBall-(padHeight/2)-aiRandOffset;
			}
		}
	}
	if(padOneUp)
	{
		yPosPad1 -= padOneYVeloc*heightCanvas*deltaTime; // In a canvas (0,0) is top left
	}
	if(padOneDown)
	{
		yPosPad1 += padOneYVeloc*heightCanvas*deltaTime; // Remember top left is (0,0)
	}
	// Update xpos
	if(padOneRight)
	{
		xPosPad1 += padOneXVeloc*widthCanvas*deltaTime; // To the right is positive
	}
	if(padOneLeft)
	{
		xPosPad1 -= padOneXVeloc*widthCanvas*deltaTime; // To the left if negative
	}
	// Update second player's paddle position
	if(gameLocal||gameOnline)
	{
		if(padTwoUp)
		{
			yPosPad2 -= padTwoYVeloc*heightCanvas*deltaTime;
		}
		if(padTwoDown)
		{
			yPosPad2 += padTwoYVeloc*heightCanvas*deltaTime;
		}
		// Update xpos
		if(padTwoRight)
		{
			xPosPad2 += padTwoXVeloc*widthCanvas*deltaTime;
		}
		if(padTwoLeft)
		{
			xPosPad2 -= padTwoXVeloc*widthCanvas*deltaTime;
		}
	}
}

function detectPoint()
{
	if(xPosBall > 1)
	{
		// Give the player a point
		playerOnePoints++;
		// Set the player who last scored
		lastScored = 1;
		// Reset the ball
		xPosBall = .5 - ballRadius*.5; // This and the next line
		yPosBall = .5 + ballRadius*.5; // are to start the ball in the middle
		// Reset ball velocity
		
		// Set reset var to true
		justReset = true;
	}
	else if(xPosBall < 0)
	{
		// Give the player a point
		playerTwoPoints++;
		// Set the player who last scored
		lastScored = 2;
		// Reset the ball
		xPosBall = .5 - ballRadius*.5; // This and the next line
		yPosBall = .5 + ballRadius*.5; // are to start the ball in the middle
		// Reset ball velocity
		
		// Set reset var to true
		justReset = true;
	}
	if((playerOnePoints == winPoints)||(playerTwoPoints == winPoints))
	{
		displayWin = true;
		menuUp = true;
	}
	// Now upload everything to firebase so that the client can be notified and recieve it.
	if(gameOnline)
	{
		firebaseRef.child(gameID).child('ballLoc').update(
		{
		xPosBall: xPosBall,
		yPosBall: yPosBall
		});
		firebaseRef.child(gameID).child('ballVeloc').update(
		{
		xVelocBall: xVelocBall,
		yVelocBall: yVelocBall
		});
		firebaseRef.child(gameID).child('gameStatus').update(
		{
		lastScored: lastScored,
		displayWin: displayWin,
		menuUp: menuUp,
		justReset: justReset,
		hostPoints: playerOnePoints,
		clientPoints: playerTwoPoints
		});
	}
}

function loadWinMenu()
{
	var winText;
	if(playerOnePoints == winPoints)
		winText = "Player 1 Wins!";
	else
	{
		if(gameVsAi)
			winText = "AI Wins!";
		else
			winText = "Player 2 Wins!";
	}
	// Resets should happen when you start a game from the menu so you can skip it here
	loadMenuBackground();
	// Setup title
	var titleText = document.createElement("div");
	var tempHolder = document.createElement("H1");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = winText;
	titleText.appendChild(tempHolder);
	tempHolder = document.createElement("hr");
	tempHolder.setAttribute("style", "border-color:blue; width:" + widthCanvas*(2/3) + "px;");
	titleText.appendChild(tempHolder);
	menuDiv.appendChild(titleText);
	// Main menu
	var mainMenuButton = document.createElement("div");
	tempHolder = document.createElement("H2");
	tempHolder.setAttribute("style", "font-family:\"Georgia Bold\"; text-align:center; color:blue;");
	tempHolder.innerHTML = "Main Menu";
	tempHolder.id = "mainMenuButton"; // So that hover and click events can later be processed.
	tempHolder.className = "menuOption";
	mainMenuButton.appendChild(tempHolder);
	menuDiv.appendChild(mainMenuButton);
	// Button hover handlers
	$(".menuOption").hover(function()
	{
		// Mouse enter animation
		$(this).stop().fadeOut(100,function(){
		$(this).css("color", "red");
		$(this).fadeIn(100);});
	},function()
	{
		$(this).stop().fadeIn(100);
		$(this).css("color", "blue");		
	});
	// Button click handlers
	// Main menu button
	$("#mainMenuButton").click(function()
	{
		emptyMenu();
		loadMainMenu();
	});
}

function waitUntilPlayerAction()
{
	if((padOneUp||padOneDown||padOneRight||padOneLeft||padTwoUp||padTwoDown||padTwoLeft||padTwoRight)&&(justReset))
	{
		justReset = false;
		// Now depending on the state setup the initial ball y and x velocities
		// Yvelocity can be made random out here, doesn't depend on anything.
		var negate;
		if(Math.random() > 0.5)
		{
			negate = -1;
		}
		else
		{
			negate = 1;
		}
		yVelocBall = (yVelocBallBase*Math.random() + ((yVelocBallBase*Math.random())/5))*negate;
		
		if(lastScored == 1)
		{
			// Shoot it in the direction of player 2 (+x)
			negate = 1;
		}
		else if(lastScored == 2)
		{
			// Shoot it in the direction of player 1 (-x)
			negate = -1;
		}
		else
		{
			// Random case
			if(Math.random() > 0.5)
			{
				negate = -1;
			}
			else
			{
				negate = 1;
			}
		}
		//Now that negate is set just assign an x velocity!
		var subOrAdd;
		if(Math.random() > 0.5)
		{
			subOrAdd = 1;
		}
		else
		{
			subOrAdd = -1;
		}
		xVelocBall = (xVelocBallBase + subOrAdd*((xVelocBallBase*Math.random())/5))*negate;
	}
}

function framePacing()
{
	// Perhaps do the deltaTime calculations here as well, seems like a good place, could help determine how much to sleep as well as how much things should move
	deltaTime = new Date().getTime()-prevTime;
	prevTime += deltaTime;
	setTimeout(function(){mainPong()}, 5); // Need some sort of thing like this otherwise the webpage freezes as javascript running takes prescedence over other things.
}

function firebaseHostIO()
{
	if(isFireBaseUpdating)
	{
		firebaseRef.child(gameID).child('ballVeloc').update(
		{
		xVelocBall: xVelocBall,
		yVelocBall: yVelocBall
		});
		firebaseRef.child(gameID).child('hostPadLoc').update(
		{
		xPosPadHost: xPosPad1,
		yPosPadHost: yPosPad1
		});
		firebaseRef.child(gameID).child('ballLoc').update(
		{
		xPosBall: xPosBall,
		yPosBall: yPosBall
		});
		setTimeout(function(){firebaseHostIO()}, 50); // Tune the interval
	}
	// Otherwise this function stops running
}

function firebaseClientIO()
{
	if(isFireBaseUpdating)
	{
		// Update everything that needs to be updated periodically
		firebaseRef.child(gameID).child('clientPadLoc').update(
		{
		xPosPadClient: xPosPad2,
		yPosPadClient: yPosPad2
		});
		setTimeout(function(){firebaseClientIO()}, 50); // Tune the interval
	}
	// Otherwise this function stops running
}

function mainPong()
{
	if(menuUp == true) // Run the code which pulls up the menu and then just sit around until the menu goes away and menuUp is set false.
	{
		isFireBaseUpdating = false; // To make the async updates stop (see firebaseHostIO() and firebaseClientIO())
		if(!displayWin) // Since the program will call mainpoing again and come here if menuUp is set we need it to not trigger the main menu
		{
			loadMenuBackground();
			loadMainMenu();
		}
		else
		{
			loadWinMenu(); // Loads the screen which says who won
			displayWin = false; // Set it to false so next time it will trigger the main menu loading if menuUp is set
		}
	}
	else // Go to the actual game loop
	{
		// Start online updating so pauses don't effect
		if(gameOnline&&!isFireBaseUpdating) // Extra code to keep both sides in sync in online play
		{
			if(isHost)
			{
				// To activate the firebase periodic updating
				isFireBaseUpdating = true;
				firebaseHostIO();
				// Now for the callbacks
				// Callback for client anti lag pad position
				firebaseRef.child(gameID).child('clientPadLoc').on('value', function(snap)
				{
					xPosPad2 = snap.child('xPosPadClient').val();
					yPosPad2 = snap.child('yPosPadClient').val();
				});
				// Callbacks for cliet pad controls
				firebaseRef.child(gameID).child('clientControls').child('padClientUp').on('value', function(snap)
				{
					padTwoUp = snap.val();
				});
				firebaseRef.child(gameID).child('clientControls').child('padClientDown').on('value', function(snap)
				{
					padTwoDown = snap.val();
				});
				firebaseRef.child(gameID).child('clientControls').child('padClientLeft').on('value', function(snap)
				{
					padTwoLeft = snap.val();
				});
				firebaseRef.child(gameID).child('clientControls').child('padClientRight').on('value', function(snap)
				{
					padTwoRight = snap.val();
				});
			}
			else
			{
				// To activate the firebase periodic updating
				isFireBaseUpdating = true;
				firebaseClientIO();
				// Now for the callbacks
				// Callback for ball velocity antilag
				firebaseRef.child(gameID).child('ballVeloc').on('value', function(snap)
				{
					xVelocBall = snap.child('xVelocBall');
					yVelocBall = snap.child('yVelocBall');
				});
				// Callback for host pad antilag
				firebaseRef.child(gameID).child('hostPadLoc').on('value', function(snap)
				{
					xPosPad1 = snap.child('xPosPadHost').val();
					yPosPad1 = snap.child('yPosPadHost').val();
				});
				// Callback for ball position antilag
				firebaseRef.child(gameID).child('ballLoc').on('value', function(snap)
				{
					xPosBall = snap.child('xPosBall').val();
					yPosBall = snap.child('yPosBall').val();
				});
				// Callbacks for host pad controls
				firebaseRef.child(gameID).child('hostControls').child('padHostUp').on('value', function(snap)
				{
					padOneUp = snap.val();
				});
				firebaseRef.child(gameID).child('hostControls').child('padHostDown').on('value', function(snap)
				{
					padOneDown = snap.val();
				});
				firebaseRef.child(gameID).child('hostControls').child('padHostLeft').on('value', function(snap)
				{
					padOneLeft = snap.val();
				});
				firebaseRef.child(gameID).child('hostControls').child('padHostRight').on('value', function(snap)
				{
					padOneRight = snap.val();
				});
				//Callback for game status stuff
				firebaseRef.child(gameID).child('gameStatus').on('value', function(snap)
				{
					lastScored = snap.child('lastScored').val();
					displayWin = snap.child('displayWin').val();
					menuUp = snap.child('menuUp').val();
					gamePaused = snap.child('gamePaused').val();
					justReset = snap.child('justReset').val();
					hostPoints = snap.child('hostPoints').val();
					clientPoints = snap.child('clientPoints').val();
				});
			}
		}
		// Render everything to the screen, this can happen every cycle
		renderPong();
		if(justReset || gamePaused) // The paused is just thrown in since it works
		{
			waitUntilPlayerAction();
		}
		else
		{
			// Update positions of things just based off velocity
			positionUpdate();
			// Detect collisions and update positions and velocities based off collisions
			detectCollision();
			if(gameOnline) // Extra code to keep both sides in sync in online play
			{
				if(isHost)
				{
					// Update score if the ball is off on one side and then reset everything, so on so forth
					detectPoint();
				}
			}
			else
			{
				// We only want the host to process in online mode, this code here runs normally in offline mode
				// Update score if the ball is off on one side and then reset everything, so on so forth
				detectPoint();
			}
		}
		// Make sure that timing is correct and that the page remains responsive with 'sleeps' can run every cycle
		framePacing();
	}
}