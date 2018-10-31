let audio = document.createElement('audio'),
    programIcon,
    userIcon,
    turn = true,//true = user's turn, false = comp turn
    gridState = ['fill','0','0','0','0','p','0','0','0','0'],//u=user, p=program
    uCurPosition,
    pCurPosition = 5,
    winners = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]],
    programCurPosWin = winners,
    userCurPosWin = winners,
    noOfMoves=1;

window.onload = function(){
  typewriter('WELCOME TO THE GRID','#span1','#p1', function(){
    $('#choose-player').css('display','flex');
  });
  $('#endOfLine, #draw').hide();
};
//windowload and associated functions
function typewriter(str1,target,remove,func){
  let str2='',
      i=0,
      x = setInterval(function(){
        i <str1.length ? (
          $(target).text(str2+=str1.charAt(i)),
          $('.cursor').toggle(),
          i++
        ) : (
          i ==str1.length+5 ? (
            clearInterval(x),
            $(remove).remove(),
            setTimeout(func, 1300) //1300
          ) : (
            $('.cursor').toggle(),
            i++
          )
        );
      },250);//x setInterval 300
  $('.icon').on('click', iconClick);
}//welcome
function iconClick(){
  playRinzler();
  $('#contain').show();
  $('#welcome-player').remove();
  this.id == 'x' ? (
    userIcon = 'ion-ios-close-empty',
    programIcon = 'ion-ios-circle-outline'
  ) : (
    userIcon = 'ion-ios-circle-outline',
    programIcon = 'ion-ios-close-empty'
  )
  $('#xORo').addClass(userIcon);
  gridIsLoaded();
}
function playRinzler(){
  audio.setAttribute('src', 'https://s0.vocaroo.com/media/download_temp/Vocaroo_s0LG0nMQ2hdR.mp3');
  audio.play();
  audio.loop = true;
}

function gridIsLoaded(){
  $('#grid').html(`
    <div id=_1></div>
    <div id=_2></div>
    <div id=_3></div>
    <div id=_4></div>
    <div id=_5></div>
    <div id=_6></div>
    <div id=_7></div>
    <div id=_8></div>
    <div id=_9></div>
  `);
  
  $('.sound').on('click', soundClick);
  $('#_5').addClass(programIcon);//computer first move
  $('#grid div').on('click',userTurn);
  $('#resetDiv').on('click',function(){window.location.reload(true);});
  $('#resetDiv, #soundDiv').hover(resetSoundHover);
  programCurPosWin = winners;
  userCurPosWin = winners;
  uCurPosition = null;
  pCurPosition = 5;
  turn=true;
  gridState = ['fill','0','0','0','0','p','0','0','0','0'];
  noOfMoves=1; 
  
}
//functions for when grid is loaded
function resetSoundHover(){
  $('.' + this.id.substring(0,5)).toggleClass('sound_reset_hover');
  $($(this).children()[1]).toggleClass('TriR_hover');
}
function soundClick(){
  let state = $('.sound').text().substring(7);
  state ==='ON' ? (
    $('.sound').text('SOUND: OFF'),
    audio.pause()
  ) : (
    $('.sound').text('SOUND: ON'),
    audio.play()
  );
  $(this).toggleClass('sound_reset_hover');
  $($(this.parentNode.children)[1]).toggleClass('TriR_hover');
}
function userTurn(){
  if (this.classList.length===0 && turn) {
    $(this).addClass(userIcon);
    turn = false;
    uCurPosition = parseInt(this.id.substring(1));
      //console.log(uCurPosition);
    gridState[uCurPosition] = 'u';
    noOfMoves++;
    //enable program to make next move
    programTurn();
  }
}
function programTurn(){
  //filter user possible winners 
  userCurPosWin = userCurPosWin.filter(cur=> cur.indexOf(pCurPosition)===-1).map(function(cur){
    return cur.filter(a=>a!==uCurPosition);
  }).sort((a,b)=>a.length-b.length);
  
  //filter program possible winners 
  //from each possible program winner, remove positions which have already been occupied by the program
  //sort to identify winners requiring least number of moves
  programCurPosWin = programCurPosWin.filter(cur => cur.indexOf(uCurPosition)===-1).map(function(cur){
    return cur.filter(a=>a!==pCurPosition);
  }).sort((a,b)=>a.length-b.length);
    //console.log(curPossibleWinners);
  
  //assign value to pCurPosition with if/else
  if (gridState.indexOf('0')===gridState.lastIndexOf('0')){
    pCurPosition = gridState.indexOf('0');
  }
  else if (programCurPosWin[0].length===1){
    pCurPosition = programCurPosWin[0][0];
  }
  else {
    //the conditional below checks to see if the user needs to be blocked
    userCurPosWin[0].length===1 ? pCurPosition=userCurPosWin[0][0] : pCurPosition = programCurPosWin[0][0];
  }
  
  //update other variables
  gridState[pCurPosition]='p';
      //console.log(gridState);
  //make move on board
  $('#_'+pCurPosition).addClass(programIcon);
  noOfMoves++;
    //console.log(programCurPosWin);
  //enable user to make next move
  turn = true;
  
  //check program win
  for (var i=0;i<programCurPosWin.length;i++){
    if(programCurPosWin[i].length ===1){
      $('#grid .'+userIcon).css('opacity','0.5');
      setTimeout(function(){
        $('#contain').hide();
        $('#endOfLine').html(`<p><span id=endSpan></span><span class=cursor>_</span></p>`).show();
        typewriter('END OF THE LINE', '#endSpan','#endOfLine p', function(){
          $('#endOfLine').hide();
          $('#contain').show();
        });
      },500);
      setTimeout(function(){
        $('#resetDiv, #soundDiv').hover(resetSoundHover);
        gridIsLoaded();
      },1000);
    }//if
  }//for loop
  //check draw
  if (noOfMoves===9){
    setTimeout(function(){
        $('#contain').hide();
        $('#draw').html(`<p><span id=drawSpan></span><span class=cursor>_</span></p>`).show();
        typewriter('DRAW', '#drawSpan','#draw p', function(){
          $('#draw').hide();
          $('#contain').show();
        });
      },500);
      setTimeout(function(){
        $('#resetDiv, #soundDiv').hover(resetSoundHover);
        gridIsLoaded();
      },1000);
  }
  
}