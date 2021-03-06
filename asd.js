    
    //main
	const canvas = document.querySelector('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = 1000;
	canvas.height = 500;
	const h = canvas.height;
	const w = canvas.width;
    topCanvas = canvas.offsetTop;
        
        
    //magicnumber
    var rdnum = Math.floor((Math.random() * w/2) + 1);
    var rdnum2 = Math.floor((Math.random() * h/2) + 1);

    //ball
    const ballsize = 16; 
    const ballColor = "white";
    let ballSpeedX = 5 * (Math.random()<0.5?1:-1);
    let ballSpeedY = 5 * (Math.random()<0.5?1:-1);    
    let ballx = w/4+rdnum;
    let bally = h/4+rdnum2;
        
    //paddel
    const paddelH=100;
    const paddelW=20;
    const paddelSpeed = 6;
        
    //player
    let playerY = h/2-paddelH/2;
    const playerX = w/20;
    
    //ai
    let aiY = h/2-paddelH/2;
    const aiX = w-w/20-paddelW;
        
    //score
    let playerScore = 0;
    let aiScore = 0;
    const endScore=10;
    const gameScoreColor = "yellow";
    const gameScoreFont = "50px Consolas";
    const gameScoreFont2 = "30px Consolas";
    const gameScoreFont3 = "20px Consolas";
    const gameScoreFont4 = "17px Consolas";
        
    //pause / unpause
    let lastballSpeedX=ballSpeedX;
    let lastballSpeedY=ballSpeedY;
    let paused=0;
        
    //table
    const tableBGColor = "black";
    const tableLineColor = "white";
    const tableLineSpaces = 30;
    const lineW = 2;
    const lineH = 16;
        
    //sounds
    var bgmusic = document.createElement('audio');
        bgmusic.src = 'sounds/bgmusic.mp3'
        bgmusic.play();
        //audio.pause();
        bgmusic.volume = 0.6;
        
    var hit = document.createElement('audio');
        hit.src = 'sounds/hit.mp3'
        //hit.play();
        //audio.pause();
        hit.volume = 0.5;   
        //hit.play();
        
    var badsfx = document.createElement('audio');
        badsfx.src = 'sounds/badsfx.flac'
        //hit.play();
        //audio.pause();
        badsfx.volume = 0.3;   
        //hit.play();
        
    //keys
    let keys;
        
    function restartplay(object){
        object.pause();
        object.currentTime=0;
        object.play();
    }
        
	function table(){
		ctx.fillStyle = tableBGColor;
		ctx.fillRect(0,0,w,h);
	
        ctx.fillStyle = tableLineColor;
		
        for(let linePos = 20; linePos<h; linePos+=tableLineSpaces)
         ctx.fillRect(w/2-lineW/2,linePos,lineW,lineH);	
        
        if(ballSpeedX == 0 && ballSpeedY == 0 || paused==1 )
            bgmusic.pause();
        else if (bgmusic.paused)
            bgmusic.play();
	}

    
    function player(){
        ctx.fillStyle = "blue"; ctx.fillRect(playerX,playerY, paddelW, paddelH);
        if (keys && keys[87]) {playerY -= paddelSpeed; }
        if (keys && keys[68]) {playerY += paddelSpeed; }
       
        if(playerY<=0)
           playerY=0;
        if(playerY>=h-paddelH)
           playerY=h-paddelH;
    }
    
    function ai(){
        ctx.fillStyle = "red"; ctx.fillRect(aiX,aiY,paddelW,paddelH);
        if (keys && keys[79]) {aiY -= paddelSpeed; }
        if (keys && keys[75]) {aiY += paddelSpeed; }
    
        if(aiY<=0)
           aiY=0;
        if(aiY>=h-paddelH)
           aiY=h-paddelH;
    }
      
    function centerX(obiekt){
        if(obiekt=="player")  
            return playerX + paddelW/2;
        if(obiekt=="ai")
            return aiX + paddelW/2;
        if(obiekt=="ball")
            return ballx + ballsize/2; 
    }   

    function centerY(obiekt){
        if(obiekt=="player")  
            return playerY + paddelH/2;
        if(obiekt=="ai")
            return aiY + paddelH/2;
        if(obiekt=="ball")
            return bally + ballsize/2; 
    }
        
    function ballCollide(){
        //var dx=(playerX+paddelW/2)-(ballx+ballsize/2);
        //var dy=(playerY+paddelH/2)-(bally+ballsize/2);
        //var width=(paddelW+ballsize)/2;
        //var height=(paddelH+ballsize)/2;
        //var crossWidth=width*dy;
        //var crossHeight=height*dx;
        //var collision='none';
        //
        //if(Math.abs(dx)<=width && Math.abs(dy)<=height){
        //    if(crossWidth>crossHeight){
        //        collision=(crossWidth>(-crossHeight))?ballSpeedY*=-1:ballSpeedX*=-1;
        //    }else{
        //        collision=(crossWidth>-(crossHeight))?ballSpeedX*=-1:ballSpeedY*=-1;
        //    }
        //}
        
        if(ballx>=w-ballsize-1){
            ballx=w-ballsize-1;
            ballSpeedX*=-1;
            playerScore+=1;
            restartplay(badsfx);
        }
        
        else if(ballx<=0){
            ballx=0;
            ballSpeedX*=-1; 
            aiScore+=1;
            restartplay(badsfx);  
        }
        
        else if(bally>=h-ballsize-1){
            bally=h-ballsize-1;
            ballSpeedY*=-1;
            restartplay(hit);
        }
        
        else if(bally<=0){
            bally=0;
            ballSpeedY*=-1;
            restartplay(hit);
        }
        
        if(ballx+ballsize>playerX && ballx < playerX + paddelW)
            if(bally+ballsize>playerY && bally < playerY + paddelH){
                if(ballx<playerX+paddelW/2)
                    ballx=playerX-ballsize;
                else if(ballx>playerX+paddelW/2)
                    ballx=playerX+paddelW;
                ballSpeedX*=-1;  
                restartplay(hit);
            }
        
        if(ballx+ballsize>aiX && ballx < aiX + paddelW)
            if(bally+ballsize>aiY && bally < aiY + paddelH){
                 if(ballx<aiX+paddelW/2)
                    ballx=aiX-ballsize;
                else if(ballx>aiX+paddelW/2)
                    ballx=aiX+paddelW;               
                ballSpeedX*=-1;
                restartplay(hit);
            }        
    }
        
    function ball(){   
        ctx.fillStyle = ballColor;
        ctx.fillRect(ballx, bally, ballsize, ballsize)  ; 
        
        ballCollide(); 
        
        ballx += ballSpeedX;
        bally += ballSpeedY;
        
        if (keys && keys[53]) {slowerBall();keys[53]=false;}
        if (keys && keys[54]) {fasterBall();keys[54]=false;}
        
    }
        

    function pause(){

        if(paused == 0){
            lastballSpeedX=ballSpeedX;
            lastballSpeedY=ballSpeedY;
            ballSpeedX=0;
            ballSpeedY=0;
        }
        paused = 1;
    }
    
    function unpause(){
        if(paused == 1){
        ballSpeedX=lastballSpeedX;
        ballSpeedY=lastballSpeedY;
        }
        paused = 0;
    }

                
    //function playerPosEvent(e){
      // playerY = e.clientY - topCanvas - paddelH/2;
      // if(playerY<=0)
        //   playerY=0;
       //if(playerY>=h-paddelH)
         //  playerY=h-paddelH;
  // }
    //canvas.addEventListener("mousemove",playerPosEvent);
        
        //szybciej
    function fasterBall(){
        if(ballSpeedX>=0 && ballSpeedX<10)ballSpeedX+=1; 
        if(ballSpeedY>=0 && ballSpeedY<10)ballSpeedY+=1;

        if(ballSpeedX<=0 && ballSpeedX>-10)ballSpeedX-=1; 
        if(ballSpeedY<=0 && ballSpeedY>-10)ballSpeedY-=1;
        console.log(ballSpeedX);
    }
        
    //wolniej
    function slowerBall(){
        if(ballSpeedX>=1 && ballSpeedX<=10)ballSpeedX-=1; 
        if(ballSpeedY>=1 && ballSpeedY<=10)ballSpeedY-=1;

        if(ballSpeedX<=-1 && ballSpeedX>=-10)ballSpeedX+=1; 
        if(ballSpeedY<=-1 && ballSpeedY>=-10)ballSpeedY+=1;
        console.log(ballSpeedX);
        }

    window.addEventListener('keydown', function (e) {
        keys = (keys || []);
        keys[e.keyCode] = true;
    })
    window.addEventListener('keyup', function (e) {
        keys[e.keyCode] = false; 
    })
        
    function gameScore(playerScore,aiScore){
        ctx.font =gameScoreFont;
        ctx.fillStyle = gameScoreColor;
        if(playerScore == endScore || aiScore == endScore){
            var textScore = "koniec gry dostales w pizde";
            var textWidth = ctx.measureText(textScore).width;
            ctx.fillText(textScore, w/2 - textWidth/2  , h/2);
            textScore = "kliknij F5";
            ctx.font = gameScoreFont2;
            textWidth = ctx.measureText(textScore).width;
            ctx.fillText(textScore,w/2-textWidth/2,h-h/4)
            pause();}
        else{
            var textScore = playerScore + " : " + aiScore;
            var textWidth = ctx.measureText(textScore).width;
            ctx.fillText(textScore, w/2 - textWidth/2  , h/9); 
        }
    }

    function tip(){

        ctx.font =gameScoreFont4;
        ctx.fillStyle = "DarkGray";
        var textScore = "Ctrl keys:player->w/d;k/o speed->5/6 | Current ballspeed: "+Math.abs(ballSpeedX);
        ctx.fillText(textScore,10,18)
        //pause();
    }
        
    function game(){
 	table()
    tip()
    ball()
    ai()
    player()
    gameScore(playerScore,aiScore)
    }   
        
    setInterval(game,1000/60);