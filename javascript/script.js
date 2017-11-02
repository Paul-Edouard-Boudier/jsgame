$(document).ready(function() {
  // /!\ Variables to test  /!\
  var image = "images/goku.jpg"

  //     /!\    Functions     /!\

  function getRandNumber(min = 1, max){
    return Math.floor((Math.random() * max) + min);
  }

  function parse(name) {
    return JSON.parse(localStorage.getItem(name));
  }


  function checkPos(maxX, maxY, object1, object2){
    var flag = false;
    var it = 0
    while (!flag) {
      it ++;
      var x = getRandNumber(1, maxX);
      var y = getRandNumber(1, maxY);
      console.log(x);
      console.log(y);
      console.log("iteration = " + it);
      console.log("-------------");
      if (x != parse(object1).x && y !== parse(object1).y) {
        if (x !== parse(object2).x && y !== parse(object2).y) {
          flag = true;
          return {
            "x": x,
            "y": y
          };
        }
      }
    }
  }


  function init(){
    if (localStorage.getItem("gameState") == null ) {
      localStorage.setItem("gameState", "optionScreen");
      displayScreen(localStorage.getItem("gameState"));
    }
    else {
      if (localStorage.getItem("gameState") == "playScreen") {
        generateGame();
      }
      displayScreen(localStorage.getItem("gameState"));
    }
  }

  function displayScreen(gameState){
    $.each($("section[data-state!='" + gameState + "']"), function(key, value){
      // select all element that have NOT the data-state = gameState
      $(this).addClass("hidden");
    });
    $.each($("section[data-state='" + gameState + "']"), function(key, value){
      // select all element that have the data-state = gameState and remove the hidden class
      $(this).removeClass("hidden");
    });
  }

  function generateGame(){
    var baseX = parse("gameAxes").x; //Parse the string that was in local storage to have a json object and then acces to x and y
    var baseY = parse("gameAxes").y;
    var playScreen = $("section[data-state='playScreen']"); //playScreen[0]: select the first element of the object playScreen
    var html = "<div style='width:"+ (baseX * 30) + "px' class='gameContainer'>";
    for (var y = 1; y <= baseY; y++) {
      for (var x = 1; x <= baseX; x++) {
        html += "<div data-x='"+ x +"' data-y='"+ y + "' class='gameDiv'></div>"; // a cell of the game
      };
    };
    html += "</div>"
    $(playScreen).html(html);
    insertObjects();
  }

  function insertObjects(){
    var maxX = parse("gameAxes").x;
    var maxY = parse("gameAxes").y;
    if (localStorage.getItem("playerPos") == null) {
      var pos = {
        "x": 1,
        "y": 1
      };
      localStorage.setItem("playerPos", JSON.stringify(pos));
    };
    if (localStorage.getItem("goalPos") == null) {
      var pos = {
        "x":  parse("gameAxes").x,
        "y":  parse("gameAxes").y
      };
      localStorage.setItem("goalPos", JSON.stringify(pos));
    };
    if (localStorage.getItem("ennemyPos") == null) {
      var pos = checkPos(maxX, maxY, "playerPos", "goalPos");
      localStorage.setItem("ennemyPos", JSON.stringify(pos));
    };
    if (localStorage.getItem("krilinPos") == null) {
      var pos = checkPos(maxX, maxY, "ennemyPos", "playerPos")
      localStorage.setItem("krilinPos", JSON.stringify(pos))
    };
    var playerPos = parse("playerPos");
    var goalPos = parse("goalPos");
    var ennemyPos = parse("ennemyPos");
    var krilinPos = parse("krilinPos");
    // debugger;
    $(".gameDiv[data-x='" + playerPos.x + "'][data-y='" + playerPos.y + "']").html("<img class='image' src='"+ image + "'>");
    $(".gameDiv[data-x='" + goalPos.x + "'][data-y='" + goalPos.y + "']").html("<img class='image' src='images/dragonball.jpg'>");
    $(".gameDiv[data-x='" + ennemyPos.x + "'][data-y='" + ennemyPos.y + "']").html("<img class='image' src='images/freezer.jpg'>");
    $(".gameDiv[data-x='" + krilinPos.x + "'][data-y='" + krilinPos.y + "']").html("<img class='image' src='images/krilin.jpg'>");
    // debugger;
    $("body").on("keydown", function(e){
      if (e.keyCode == 38) { // Up key
        movePlayer("up");
      }
      else if (e.keyCode == 39) { // Right key
        movePlayer("right");
      }
      else if (e.keyCode == 40) { // Down key
        movePlayer("down");
      }
      else if (e.keyCode == 37) { // Left key
        movePlayer("left");
      }
      // debugger;
    });
  }



  function checkVictory(){
    // debugger;
    // can't use the variable, localStorage isn't working, currentPlayerPos isn't working
    if (parse("playerPos").x == parse("goalPos").x && parse("playerPos").y == parse("goalPos").y) {
      // debugger;
      displayScreen("victory") // to add
      localStorage.setItem("gameState", "victory");
    }
  }


  function checkDefeat(){
    if (parse("playerPos").x == parse("ennemyPos").x && parse("playerPos").y == parse("ennemyPos").y) {
      displayScreen("defeat");
      localStorage.setItem("gameState", "defeat");
    }
    if (parse("ennemyPos").x == parse("goalPos").x && parse("ennemyPos").y == parse("goalPos").y) {
      displayScreen("defeat");
      localStorage.setItem("gameState", "defeat");
    }
    // debugger;
  }


  function checkKillKrilin(){
    var krilinPos = parse("krilinPos");
    var playerPos = parse("playerPos");
    if (parse("krilinPos").x == parse("ennemyPos").x && parse("krilinPos").y == parse("ennemyPos").y) {
      $(".gameDiv[data-x='" + krilinPos.x + "'][data-y='" + krilinPos.y + "']").html("");
      $(".gameDiv[data-x='" + playerPos.x + "'][data-y='" + playerPos.y + "']").html("");
      image = "images/gokuss.jpg";
      $(".gameDiv[data-x='" + playerPos.x + "'][data-y='" + playerPos.y + "']").html("<img class='image' src='"+ image + ">");
      // debugger;
    }
  }

  function moveUp(itemPos, actualPos, image, gameSize) {
    if ((actualPos.y - 1) > 0) {
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("");
      actualPos.y -= 1;
      localStorage.setItem(itemPos, JSON.stringify(actualPos));
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("<img class='image' src='"+ image + "'>");
    }
    else {
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("");
      actualPos.y = gameSize.y;
      localStorage.setItem(itemPos, JSON.stringify(actualPos));
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("<img class='image' src='"+ image + "'>");
    }
  }


  function moveRight(itemPos, actualPos, image, gameSize) {
    if ((actualPos.x + 1) <= gameSize.x) {
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("");
      actualPos.x += 1;
      localStorage.setItem(itemPos, JSON.stringify(actualPos));
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("<img class='image' src='"+ image + "'>");
    }
    else {
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("");
      actualPos.x = 1;
      localStorage.setItem(itemPos, JSON.stringify(actualPos));
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("<img class='image' src='"+ image + "'>");
    }
  }


  function moveDown(itemPos, actualPos, image, gameSize) {
    if ((actualPos.y + 1) <= gameSize.y) {
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("");
      actualPos.y += 1;
      localStorage.setItem(itemPos, JSON.stringify(actualPos));
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("<img class='image' src='"+ image + "'>");
    }
    else {
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("");
      actualPos.y = 1;
      localStorage.setItem(itemPos, JSON.stringify(actualPos));
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("<img class='image' src='"+ image + "'>");
    }
  }


  function moveLeft(itemPos, actualPos, image, gameSize) {
    if ((actualPos.x - 1) > 0) {
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("");
      actualPos.x -= 1;
      localStorage.setItem(itemPos, JSON.stringify(actualPos));
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("<img class='image' src='"+ image + "'>");
      checkVictory();
      checkDefeat();
    }
    else {
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("");
      actualPos.x = gameSize.x;
      localStorage.setItem(itemPos, JSON.stringify(actualPos));
      $(".gameDiv[data-x='" + actualPos.x + "'][data-y='" + actualPos.y + "']").html("<img class='image' src='"+ image + "'>");
      checkVictory();
      checkDefeat();
    }
  }

  function moveEnnemy() {
    var currentPos = parse("ennemyPos");
    var gameSize = parse("gameAxes");
    var image = "images/freezer.jpg"
    if (getRandNumber(1, 2) == 1) {
      // Move on Y axis
      if (getRandNumber(1, 2) == 1) {
        // Move upward
        moveUp("ennemyPos", currentPos, image, gameSize)
      }
      else {
        // Move downward
        moveDown("ennemyPos", currentPos, image, gameSize)
      }
    }
    else {
      // Move on X axis
      if (getRandNumber(1, 2) == 1) {
        // Move Rightward
        moveRight("ennemyPos", currentPos, image, gameSize)
      }
      else {
        // Move leftward
        moveLeft("ennemyPos", currentPos, image, gameSize)
      }
    }
    checkDefeat();
    checkKillKrilin();
  }

  function moveKrilin() {
    var currentPos = parse("krilinPos");
    var gameSize = parse("gameAxes");
    var image = "images/krilin.jpg"
    if (getRandNumber(1, 2) == 1) {
      // Move on Y axis
      if (getRandNumber(1, 2) == 1) {
        // Move upward
        moveUp("krilinPos", currentPos, image, gameSize)
      }
      else {
        // Move downward
        moveDown("krilinPos", currentPos, image, gameSize)
      }
    }
    else {
      // Move on X axis
      if (getRandNumber(1, 2) == 1) {
        // Move Rightward
        moveRight("krilinPos", currentPos, image, gameSize)
      }
      else {
        // Move leftward
        moveLeft("krilinPos", currentPos, image, gameSize)
      }
    }
    checkDefeat();
    checkKillKrilin();

  }


  function movePlayer(direction){
    var currentPlayerPos = parse("playerPos");
    var gameSize = parse("gameAxes");
    if (direction == "up") {
      moveUp("playerPos", currentPlayerPos, image, gameSize);
      checkVictory();
      checkDefeat();
    }
    else if (direction == "right") {
      moveRight("playerPos", currentPlayerPos, image, gameSize);
      checkVictory();
      checkDefeat();
    }
    else if (direction == "down") {
      moveDown("playerPos", currentPlayerPos, image, gameSize);
      checkVictory();
      checkDefeat();
    }
    else if (direction == "left") {
      moveLeft("playerPos", currentPlayerPos, image, gameSize);
      checkVictory();
      checkDefeat();
    }
    if (getRandNumber(1, 2) == 1) {
      checkDefeat();
      moveEnnemy();
      checkDefeat();
    }
    // if (getRandNumber(1, 3) == 1) {
    //   moveKrilin()
    // }
  }


//     /!\    Listeners     /!\

  $("button[data-action='reset']").on("click", function(){
    localStorage.clear();
    location.reload();
  });

  $("button[data-action='startGame']").on("click", function(){
    var baseX = $("input[name='x']").val();
    var baseY = $("input[name='y']").val();
    if (baseX == "" || baseY == "") {
      alert("Value error, X or Y")
    }
    else {
      var axes = {
        "x": baseX,
        "y": baseY
      };
      localStorage.setItem("gameAxes", JSON.stringify(axes)); // we stringify the object caus local storage can only have strings
      localStorage.setItem("gameState", "playScreen"); // change state of the game from optionScreen to gameScreen => switch from menu selector to the game
      generateGame();
      displayScreen(localStorage.getItem("gameState"));
      // debugger;
    }
    // debugger;
  });

  init();
});
