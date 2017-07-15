'use strict';

const	PANE_HEIGHT = 20,
		PANE_WIDTH = 30,
		SNAKE_SPEED = 120,
		DIRECTIONS = {
			UP: 0,
			RIGHT: 1,
			DOWN: 2,
			LEFT: 3
		},
		KEYS = {
			37: DIRECTIONS.LEFT,
			38: DIRECTIONS.UP,
			39: DIRECTIONS.RIGHT,
			40: DIRECTIONS.DOWN
		},
		OUT = {
			1: 20,

		}

var scoreHTML = document.getElementById("score");


class Snake {
	constructor(initX, initY) {
		this.gamePane = Array(PANE_WIDTH);
		for(var x = 0; x < PANE_WIDTH; x++) {
			this.gamePane[x] = Array(PANE_HEIGHT);
			for(var y = 0; y < PANE_HEIGHT; y++) {
				this.gamePane[x][y] = -1;
			}
		}

		this.size = 1;
		this.position = {x: initX, y: initY};
		this.lastPosition = {x: initX, y: initY}
		this.speedAccelerate = 0;
		this.generatePane();
		this.initSnake();
		this.generateFood();		
		this.makeMove(); 
	}

	initSnake() {
		this.direction = DIRECTIONS.UP;		
		this.nextDirection = DIRECTIONS.UP;
	}
	
	changeDirection(newDirection) {

		if(newDirection === this.direction) {
			return;
		}

		switch(newDirection) {
			case(DIRECTIONS.UP):
				if(this.direction == DIRECTIONS.DOWN) {
					return;
				}
				break;
			case(DIRECTIONS.DOWN):
				if(this.direction == DIRECTIONS.UP) {
					return; 				
				} 
				break;
			case(DIRECTIONS.LEFT):
				if(this.direction == DIRECTIONS.RIGHT) {
					return;
				}
				break;
			case(DIRECTIONS.RIGHT):
				if(this.direction == DIRECTIONS.LEFT) {
					return;
				}
				break;
			default:
				console.log("unhandled turn");
				return;					
		}
		this.nextDirection = newDirection;
	}

	makeMove() {
		this.direction = this.nextDirection;
		switch(this.direction) {
			case(DIRECTIONS.UP):
				this.lastPosition.y = this.position.y;
				this.position.y -= 1;
				break;
			case(DIRECTIONS.RIGHT):
				this.lastPosition.x = this.position.x;			
				this.position.x += 1;
				break;
			case(DIRECTIONS.DOWN):
				this.lastPosition.y = this.position.y;			
				this.position.y += 1;
				break;
			case(DIRECTIONS.LEFT):
				this.lastPosition.x = this.position.x;					
				this.position.x -= 1;
				break;
			default:
				console.log("Unknown turn");
		}


		//TODO: implement border and check it here

		if(this.position.x >= PANE_WIDTH) {
			this.position.x = 0;
		} else if(this.position.x < 0) {
			this.position.x = PANE_WIDTH - 1;			
		} else if(this.position.y >= PANE_HEIGHT) {
			this.position.y = 0;
		} else if(this.position.y < 0) { 
			this.position.y = PANE_HEIGHT - 1;
		}

		// //CHECK IF LEFT PANE
		// if(this.position.x >= PANE_WIDTH || this.position.x < 0 || this.position.y >= PANE_HEIGHT || this.position.y < 0) {
			
		// 	//END GAME - snake left gamepane
		// 	alert("Snake left the pane. You lost.");
		// 	return;
		// }

		//CHECK IF SNAKE ATE HIMSELF
		if(this.gamePane[this.position.x][this.position.y] > -1) {
			//END GAME - snake ate himself
			alert("Snake ate himself. You lost");
			return;
		}

		//CHECK IF STEPPED ON FOOD
		else if(this.gamePane[this.position.x][this.position.y] == -2) {
			this.size += 1;
			removeClass("food", this.tableCells[this.position.x][this.position.y]);
			addClass("eaten", this.tableCells[this.position.x][this.position.y]);
			scoreHTML.innerHTML = this.size * 100;
			if(this.size % 10 == 0 && SNAKE_SPEED - this.speedAccelerate > 20) {
				this.speedAccelerate -= 10;
			}
			this.generateFood();
		}
		this.gamePane[this.position.x][this.position.y] = this.size;
		addClass('snake', this.tableCells[this.position.x][this.position.y]);

		//COLOR BRICK

		this.refreshPane();
		window.setTimeout(() => this.makeMove(), SNAKE_SPEED + this.speedAccelerate);
	}

	refreshPane() {
		
		for(var x = 0; x < PANE_WIDTH; x++) 
		{ 	
			for(var y = 0; y < PANE_HEIGHT; y++) 
				{ 		
					if(this.gamePane[x][y] > -1 ) {
						this.gamePane[x][y] -= 1;
						if(this.gamePane[x][y] < 0) {
							this.tableCells[x][y].className = "";
						}
					}
				}
		}
	}

	generatePane() {
		this.paneContainer = document.getElementById("container");


		var paneHTML = '<table  border="0" cellspacing="0" cellpadding="0">';

		for(var row = 0; row < PANE_HEIGHT; row++) {
			paneHTML += '<tr>';
			for(var col = 0; col < PANE_WIDTH; col++) {
				paneHTML += '<td id="' + col + '-' + row + '"></td>';
			}
			paneHTML += '</tr>';
		}

		paneHTML += '</table>';

		this.paneContainer.innerHTML = paneHTML;

		this.tableCells = Array(PANE_WIDTH)
		for(var x = 0; x < PANE_WIDTH; x++) {
			this.tableCells[x] = Array(PANE_HEIGHT);
			for(var y = 0; y < PANE_HEIGHT; y++) {
				this.tableCells[x][y] = document.getElementById(x + '-' + y);
			}
		}
	}

	generateFood() {
		while(1) {
			var randomX = Math.floor(Math.random() * PANE_WIDTH);
			var randomY = Math.floor(Math.random() * PANE_HEIGHT);
			if(this.gamePane[randomX][randomY] == -1) {
				addClass('food', this.tableCells[randomX][randomY]);
				this.gamePane[randomX][randomY] = -2;
				return;
			}
		}

	}

	endGame() {
		this.paneContainer.innerHTML = "";
		scoreHTML.innerHTML = "0";
		
	}

}

var snakeGame = new Snake(4, 4);
document.onkeydown = handleClick;

function resetGame() {
	snakeGame.endGame();
	snakeGame = new Snake(4, 4);
}

function handleClick(e) {
	e = e || window.event;

	if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			snakeGame.changeDirection(KEYS[e.keyCode]);
	}
	if(e.keyCode == 82) {
		resetGame();
	}
}

function addClass(classname, element) {
    var cn = element.className;
    //test for existance
    if( cn.indexOf( classname ) != -1 ) {
        return;
    }
    //add a space if the element already has class
    if( cn != '' ) {
        classname = ' '+classname;
    }
    element.className = cn+classname;
}

function removeClass(classname, element ) {
    var cn = element.className;
    var rxp = new RegExp( "\\s?\\b"+classname+"\\b", "g" );
    cn = cn.replace( rxp, '' );
    element.className = cn;
}