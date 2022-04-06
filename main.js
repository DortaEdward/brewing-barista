// brewing-barista
const ingredients = [
  'coffee',
  'milk',
  'water',
  'espresso',
  'syrup',
];

const recipes = [
  {
    name:'Latte',
    ingredients: [
      'espresso',
      'milk'
    ]
  },
  {
    name:'Coffee',
    ingredients: [
      'coffee'
    ]
  },
  {
    name:'Americano',
    ingredients: [
      'espresso',
      'water'
    ]
  }
]

// Ingredient Class
class Ingredient{
  constructor(config){
    this.element =  config.element;
    this.name = config.name;
  }
}

// Game Class
class Game{
  constructor(config){
    this.element = document.querySelector('.game-container');
    this.active = config.active;
    this.ingredientList = config.ingredientList;
    this.recipes = config.recipes;
    this.ingredients = [];
    this.activeIngredient = 0;
    this.activeRecipeIngredients = [];
    this.correctSound = new Audio('bell.mp3');
  }
  init(){
    this.createIngredients();
    this.createOrderBoard();
    this.ingredientElements = document.querySelector('.ingredient-cube');
    this.ingredients[this.activeIngredient % this.ingredientList.length].element.classList.add('active');
    this.populateOrderBoard();
    this.gameLoop();
  }
  createIngredients(){
    this.ingredientContainer = document.querySelector('.ingredient-container');
    this.ingredientList.forEach((ingredient) => {
      const ingredientElement = document.createElement('div');
      ingredientElement.innerText = `${ingredient}`
      ingredientElement.classList.add(`${ingredient}`,'ingredient-cube');
      const ingredientObject = new Ingredient({
        element:ingredientElement,
        name:ingredient
      });
      this.ingredients.push(ingredientObject);
      this.ingredientContainer.appendChild(ingredientElement);
    });
  };

  createOrderBoard(){
    const orderBoardContainer = document.querySelector('.order-board-container');
    this.orderBoard = document.createElement('div');
    this.orderBoard.classList.add('order-board')
    this.orderBoard.style.width = '300px';
    this.orderBoard.style.height = '200px';
    this.orderBoard.style.background = 'blue';
    this.orderBoard.innerHTML = '<h1>Order Board</h1>'
    orderBoardContainer.appendChild(this.orderBoard);
  }

  populateOrderBoard(){
    this.activeRecipe = this.recipes[Math.floor(Math.random() * this.recipes.length)];
    this.activeRecipeName = document.createElement('div');
    this.activeRecipeDiv = document.createElement('div');
    this.activeRecipeName.classList.add('active-recipe-div-name')
    this.activeRecipeName.innerHTML = `<h2>${this.activeRecipe.name}</h2>`;
    this.activeRecipeDiv.classList.add('active-recipe-div');
    this.activeRecipe.ingredients.forEach(ingredient => {
      this.activeRecipeIngredients.push(ingredient);
      const ingredientP  = document.createElement('p');
      ingredientP.classList.add('order-board-ingredient');
      ingredientP.innerText = `${ingredient}`;
      this.activeRecipeDiv.appendChild(ingredientP);
    })
    this.orderBoard.append(this.activeRecipeName,this.activeRecipeDiv);
  }

  clearBoard(){
    this.orderBoard.innerHTML = '';
  }

  update(){
    this.element.addEventListener('keydown', e => {
      if(e.key == 'd'){
        this.ingredients[this.activeIngredient % this.ingredientList.length].element.classList.remove('active');
        this.activeIngredient += 1 % this.ingredientList.length;
        if(this.activeIngredient > 4){
          this.activeIngredient = 0;
        }
        this.ingredients[this.activeIngredient % this.ingredientList.length].element.classList.add('active');
      } else if(e.key == 'a'){
        this.ingredients[this.activeIngredient % this.ingredientList.length].element.classList.remove('active');
        this.activeIngredient -= 1;
        if(this.activeIngredient < 0){
          this.activeIngredient = this.ingredientList.length - 1;
        }
        this.ingredients[this.activeIngredient % this.ingredientList.length].element.classList.add('active');
      } else if (e.code == 'Space'){
        if(this.ingredientList[this.activeIngredient] == this.activeRecipeIngredients[0]){
          this.activeRecipeIngredients.shift();
          this.activeRecipeDiv.childNodes[0].remove();
          if(this.activeRecipeIngredients.length <= 0){
            this.correctSound.play();
            setTimeout(() => {
              this.clearBoard();
              this.populateOrderBoard();
            }, 3000);
          }
        }
      }
    })
  }

  gameLoop(){
    requestAnimationFrame(() => {
      this.update()
    })
  }
}

function displayStart(){
  const startMenu = document.createElement('div');
  startMenu.classList.add('start-menu');
  startMenu.innerHTML = '<p>Press Enter to Start</p>';
  const gameContainer = document.querySelector('.game-container');
  gameContainer.appendChild(startMenu);
}


window.onload = () => {
  // display start menu
  displayStart();
  document.addEventListener('keydown', e => {
    if(e.code === 'Enter'){
      const startMenu = document.querySelector(".start-menu");
      startMenu.remove();
      const game = new Game({
        active:0,
        ingredientList: ingredients,
        recipes: recipes
      });
      game.init();
    }
  });
};


