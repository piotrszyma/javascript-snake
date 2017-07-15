'use strict';

//Mobile check

window.isMobile = function() {
	var check = false;
  	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  	return check;
};

var keyboard;

if(!window.isMobile()) {
	keyboard = document.getElementById("keys");
	keyboard.innerHTML = "";
}

//The Game

var		PANE_HEIGHT = 20,
		PANE_WIDTH = 30,
		SNAKE_SPEED = 220,
		INIT_X = 4,
		INIT_Y = 4,
		scoreHTML = document.getElementById("score");

const	DIRECTIONS = {
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
		}

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

		//CHECK IF SNAKE ATE HIMSELF
		if(this.gamePane[this.position.x][this.position.y] > -1) {
			//END GAME - snake ate himself
			alert("Snake ate himself.\nYou lost\nYour score: " + (this.size - 1) * 100);
			this.resetGame();
			return;
		}

		//CHECK IF STEPPED ON FOOD
		else if(this.gamePane[this.position.x][this.position.y] == -2) {
			this.size += 1;
			removeClass("food", this.tableCells[this.position.x][this.position.y]);
			addClass("eaten", this.tableCells[this.position.x][this.position.y]);
			scoreHTML.innerHTML = (this.size - 1) * 100;
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

	resetGame() {
		this.paneContainer.innerHTML = "";
		scoreHTML.innerHTML = "0";
		s = new Snake(INIT_X, INIT_Y);
	}

}

function handleClick(e) {
	e = e || window.event;

	if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			s.changeDirection(KEYS[e.keyCode]);
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



var s = new Snake(INIT_X, INIT_Y);
document.onkeydown = handleClick;