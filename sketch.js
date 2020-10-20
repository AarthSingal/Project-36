var database ,dog,dogImage,happyDogImage;
var food;
var feedDogButton,addFoodButton;
var foodobject;
var Feedtime;
var Lastfeed;
var inputTextBox,inputButton , nameShow;
var changeGameState , readGameState , gameState;
var bedroomImage,gardenImage,washroomImage;
var currentTime;



function preload(){
  dogImage = loadImage("dogImg.png");
  happyDogImage = loadImage("dogImg1.png");

  bedroomImage = loadImage("BedRoom.png");
  gardenImage = loadImage("Garden.png");
  washroomImage = loadImage("Wash Room.png");

	
}

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();
  //console.log(database);
   food = database.ref('Food');
  food.on("value", readFood);
  
  foodobject=new Food()
  dog = createSprite(550,250,10,10);
  dog.addImage(dogImage);
  dog.scale=0.2;
 
  
  feedDogButton = createButton("FEED DOG");
  feedDogButton.position(500,15);
  feedDogButton.mousePressed(FeedDog);

  addFoodButton = createButton("ADD FOOD");
  addFoodButton.position(400,15);
  addFoodButton.mousePressed(AddFood);

  inputTextBox = createInput("Enter Pet Name");
  inputTextBox.position(800,200);


  inputButton = createButton("Play");
  inputButton.position(850,300);

  nameShow = createElement('h3');

  readGameState = database.ref('GameState');
  readGameState.on("value",function(data){
    gameState = data.val();
  })
} 

function draw(){
 background(46,139,87);

 foodobject.display();
 
 drawSprites();

 Lastfeed = database.ref('FeedTime');
 Lastfeed.on("value",function(data){
  Lastfeed = data.val()
 })
 
 fill(255,255,254);
 textSize(15);
  if(Lastfeed ===12){
      text("Last Fed : "+Lastfeed+" PM",200,30);
  }else if(Lastfeed>12){
    text("Last Fed : "+Lastfeed%12+" PM",200,30);
  } else if(Lastfeed === 0){
      text("Last Fed : 12 AM",200,30);
  }else{
    text("Last Fed : "+Lastfeed+" AM",200,30);
  }

  inputButton.mousePressed(function(){
    inputTextBox.hide();
    inputButton.hide();

    var petName = inputTextBox.value();

    nameShow.html(petName);
    nameShow.position(dog.x-50,dog.y-150);

  })



  drawSprites();

  currentTime = hour();
  if(currentTime === (Lastfeed+1)){
    updateGameState("garden");
    foodobject.garden();
    addFoodButton.hide();
    feedDogButton.hide();
    nameShow.hide();
    dog.visible = false;
  }else if(currentTime === (Lastfeed+2)){
    updateGameState("sleeping");
    foodobject.bedroom();
    addFoodButton.hide();
    feedDogButton.hide();
    nameShow.hide();
    dog.visible = false;
  }else if(currentTime > ( Lastfeed+2)&& currentTime < (Lastfeed+4)){
    updateGameState("bathing");
    foodobject.washroom();
    addFoodButton.hide();
    feedDogButton.hide();
    nameShow.hide();
    dog.visible = false;
  }else{
    updateGameState("hungary");
    foodobject.display();
    addFoodButton.show();
    feedDogButton.show();
    nameShow.show();
    dog.visible = true;
  }
}
function readFood(data){
  food = data.val();
  foodobject.updateFoodStock(food);
}

function writeFood(nazo){
  if(nazo>0){
    nazo=nazo-1
  }
  else{
    nazo=0
  }
  database.ref('/').set({
    Food: nazo
  })

}
function AddFood(){
food++
database.ref('/').update({
  Food:food
}

)
}
function FeedDog(){

dog.addImage(happyDogImage);
dog.x = 200;
dog.y = 200;
nameShow.position(dog.x-50,dog.y-150);
foodobject.updateFoodStock(foodobject.getFoodStock()-1)
 database.ref('/').update({
   Food:foodobject.getFoodStock(),
   FeedTime:hour ()
 })
}
function updateGameState(state){
  database.ref('/').update({
    GameState : state
  })
}