const PADDLE_WIDTH = 10;
const DOT_RADIUS = 10;
const WIN = 3; // maximum score
const DIFFICULTY = 5; // set game difficulty, from 1 to 10

var canvas;
var canvasContext;
var dotX;
var dotY;
var paddle_height = 150 - (10 * DIFFICULTY);
var maxSpeed = 5 + DIFFICULTY;
var paddleUserY;
var paddleCompY;
var score1 = 0;
var score2 = 0;
var winFlag = false;
var interval;


function mousePosition(event) // function to get mouse position relative to canvas
{
	var rectangle = canvas.getBoundingClientRect();
	var page = document.documentElement;
	var mouseX = event.clientX - rectangle.left - page.scrollLeft;
	var mouseY = event.clientY - rectangle.top - page.scrollTop;
	return {x: mouseX, y: mouseY};
}

window.onload = function()
{
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext("2d");
	canvas.width = window.innerWidth - 20; // align canvas to window size
	canvas.height = window.innerHeight - 20; // align canvas to window size
	dotX = canvas.width / 2;
	dotY = canvas.height / 2;
	var random = Math.random();
	speedY = maxSpeed * Math.sin(random);
	speedX = maxSpeed * Math.cos(random);
	var fps = 60;
	interval = setInterval(display, 1000 / fps); // updates canvas
	paddleUserY = canvas.height / 2;
	paddleCompY = canvas.height / 2;
	setElements();
	
	canvas.addEventListener("mousemove", function(event) // set vertical position of paddle to cursor's vertical position
	{
		var mousePos = mousePosition(event);
		paddleUserY = mousePos.y - (paddle_height / 2);
	});
}

function display() // displays everything on screen
{
	setElements();
	typeText(28, "Calibri", "center", "white", score1, canvas.width / 4, canvas.width / 4);
	typeText(28, "Calibri", "center", "white", score2, 3 * (canvas.width / 4), canvas.width / 4);
	if (winFlag) // if the game has reached the maximum score
	{
		var finish;
		if (score1 >= WIN)
		{
			finish = confirm("You won! Click ok to continue");
		}
		else if (score2 >= WIN)
		{
			finish = confirm("The computer won! Click ok to continue");
		}
		if (finish) // if user clicks ok
		{
			score1 = 0;
			score2 = 0;
			winFlag = false;
		}
		else
		{
			clearInterval(interval); // interrupt refreshing screen
		}
	}
	else
	{
		movingDot();
	}
	
}

function resetGame() // check if game is finished and resets elements
{
	if (score1 >= WIN || score2 >= WIN)
	{
		winFlag = true;
	}
	speedX = -speedX;
	dotX = canvas.width / 2;
	dotY = canvas.height / 2;
	paddleCompY = canvas.width / 2;
}

function comp() // computer gameplay
{
	var centre = paddleCompY + (paddle_height / 2);
	if(centre < dotY - ((paddle_height / 2) * (0.9 - (DIFFICULTY / 40))))
	{
		paddleCompY += (0.7 + (DIFFICULTY / 100)) * maxSpeed;
	}
	else if (centre > dotY + ((paddle_height / 2) * (0.9 - (DIFFICULTY / 40))))
	{
		paddleCompY -= (0.7 + (DIFFICULTY / 100)) * maxSpeed;
	}
}

function setElements() //draws paddles and centre line
{
	drawRectangle(0, 0, canvas.width, canvas.height, "black");
	drawRectangle(0, paddleUserY, PADDLE_WIDTH, paddle_height, "white");
	drawRectangle(canvas.width - PADDLE_WIDTH, paddleCompY, PADDLE_WIDTH, paddle_height, "white");
	for (var x = 0; x < canvas.height; x+=50)
	{
		drawRectangle(canvas.width / 2 - 1, x, 2, 20, "gray");
	}
}

function movingDot() // draw dot and make it move
{
	comp();
	dotX -= speedX;
	dotY -= speedY;
	if (dotX <= PADDLE_WIDTH + DOT_RADIUS)
	{
		if (dotY > paddleUserY && dotY < paddleUserY + paddle_height)
		{
			var paddlePos = dotY - (paddleUserY + (paddle_height / 2));
			speedY = -maxSpeed * Math.sin(paddlePos * (1 / ((2 * paddle_height) / 5)));
			speedX = -maxSpeed * Math.cos(paddlePos * (1 / ((2 * paddle_height) / 5)));
		}
		else
		{
			score2++;
			resetGame();
		}
	}
	if (dotX >= canvas.width - PADDLE_WIDTH - DOT_RADIUS)
	{
		if (dotY > paddleCompY && dotY < paddleCompY + paddle_height)
		{
			var paddlePos = dotY - (paddleCompY + (paddle_height / 2));
			speedY = -maxSpeed * Math.sin(paddlePos * (1 / ((2 * paddle_height) / 5)));
			speedX = maxSpeed * Math.cos(paddlePos * (1 / ((2 * paddle_height) / 5)));
		}
		else
		{
			score1++;
			resetGame();
		}
	}
	if (dotY <= DOT_RADIUS || dotY >= canvas.height - DOT_RADIUS)
	{
		speedY = -speedY;
	}
	drawCircle(dotX, dotY, DOT_RADIUS, "yellow");
}

function drawRectangle(initX, initY, width, height, colour) // helper function for rectangles
{
	canvasContext.fillStyle = colour;
	canvasContext.fillRect(initX, initY, width, height);
}

function drawCircle(posX, posY, rad, colour) // helper function for dot
{
	canvasContext.fillStyle = colour;
	canvasContext.beginPath();
	canvasContext.arc(posX, posY, rad, 0, Math.PI * 2, true);
	canvasContext.fill();
}

function typeText(fontSize, font, align, colour, text, posX, posY) // helper function for text
{
	if (fontSize != null && font != null)
	{
		canvasContext.font = fontSize + "px " + font;
	}
	if (align != null)
	{
		canvasContext.textAlign = align;
	}
	if (colour != null)
	{
		canvasContext.fillStyle = colour;
	}
	canvasContext.fillText(text, posX, posY);
}