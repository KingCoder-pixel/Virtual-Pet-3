var dog,dogImg,dogImg1, database;
var feedButton,addFoodButton, food;
var fedTime, gameState;
var changingGameState, readingGameState;
var bedroom, garden, washroom;
function preload()
{
  sadDogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom= loadImage("images/Wash Room.png");
}

function setup() {
  database = firebase.database();

  readState = database.ref("gameState");
  readState.on("value", function(data){
    gameState = data.val();
  })
  
  createCanvas(900,500);
  dog = createSprite(850,250,15,15);
  dog.addImage(sadDogImg);
  dog.scale = 0.25;

  foodS = database.ref('Food');
  foodS.on("value",readStock);
  food = new Food();
  
  fedTime = database.ref('fedTime');
  fedTime.on("value",function(data){
    fedTime = data.val();
  });

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });

  feedButton = createButton("Feed The Dog");
  feedButton.position(685,100);
  feedButton.mousePressed(feedDog);

  addFoodButton = createButton("Add Food");
  addFoodButton.position(795,100);
  addFoodButton.mousePressed(addFood);

}
function draw() {

  currentTime = hour();
  if(currentTime ==(fedTime+1))
  {
    update("Playing");
    foodS.garden();
  }else if(currentTime ==(fedTime+2))
  {
    update("Sleeping");
    foodS.bedroom();
  }else if(currentTime>(fedTime+2) && currentTime<=(fedTime+4))
  {
    update("Bathing");
    foodS.washroom();
  }else{
    update("Hungry");
    food.display();
  }


  background(46,139,87);  
  food.display();
  drawSprites();
  textSize(20);
  fill("white");
  text("Food Remaining: "+foodS,170,100);
  if(fedTime>=12){

        fill("white");
        textSize(15); 
        text("Last Fed : "+ fedTime%12 + " PM", 350,30);
        }

        else if(fedTime==0) {

            fill("white");
            textSize(15); 
             text("Last Fed : 12 AM",350,30);
        }
        else {

            fill("white");
            textSize(15); 
            text("Last Fed : "+ fedTime + " AM", 350,30);
        }
  if(gameState != "Hungry")
  {
    feedButton.hide();
    addFoodButton.hide();
    dog.remove();
  }else{
    feedButton.show();
    addFoodButton.show();
    dog.addImage(sadDogImg)
  }

  
}
function readStock(data){

  foodS = data.val();
  food.updateFoodStock(foodS);
}
function feedDog(){

    dog.addImage(happyDogImg);
    foodS = foodS-2;
    database.ref('/').update({
      Food : foodS
    })
    fedTime = hour(); 
}
function addFood(){

  dog.addImage(sadDogImg);
  foodS = foodS+20;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state)
{
  database.ref("/").update({
    gameState:state
  })
}