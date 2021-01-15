"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 14
   Case Problem 3
 
   
   Filename: rb_build.js

*/
var pizzaPrice = {
   size12: 11,
   size14: 13,
   size16: 16,
   thin: 0,
   thick: 0,
   stuffed: 3,
   pan: 2,
   doubleSauce: 1.5,
   doubleCheese: 1.5,
   topping: 1.5
 };
 
 /* Constructor function for the class of cart objects */
 function cart() {
   this.totalCost = 0;
   this.items = [];
 }
 
 function foodItem() {
   this.price;
   this.qty;
 }
 
 foodItem.prototype.calcItemCost = function() {
   return this.price * this.qty;
 };
 
 cart.prototype.calcCartTotal = function() {
   var cartTotal = 0;
   this.items.forEach(function(item) {
     cartTotal += item.price;
   });
   this.totalCost = cartTotal;
   return this.totalCost;
 };
 
 foodItem.prototype.addToCart = function(cart) {
   cart.items.push(this);
 };
 
 foodItem.prototype.removeFromCart = function(cart) {
   for (var i = 0; i < cart.items.length; i++) {
     if (this === cart.items[i]) {
       cart.items.splice(i, 1);
       break;
     }
   }
 };
 
 function pizza() {
   this.size;
   this.crust;
   this.doubleSauce;
   this.doubleCheese;
   this.toppings = [];
 }
 
 function topping() {
   this.name;
   this.side;
 }
 
 
 pizza.prototype = new foodItem();
 topping.prototype = new foodItem();
 
 pizza.prototype.addTopping = function(topping) {
   this.toppings.push(this);
 };
 
 pizza.prototype.calcPizzaPrice = function() {
   if (this.size === "12") {
     this.price = pizzaPrice.size12;
   } else if (this.size === "14") {
     this.price = pizzaPrice.size14;
   } else if (this.size === "16") {
     this.price = pizzaPrice.size16;
   }
 
   if (this.crust === "stuffed") {
     this.price += pizzaPrice.stuffed;
   } else if (this.crust === "pan") {
     this.price += pizzaPrice.pan;
   } else if (this.crust === "thin") {
     this.price += pizzaPrice.thin;
   } else if (this.crust === "thick") {
     this.price += pizzaPrice.thick;
   }
 
   if (this.doubleSauce) {
     this.price += pizzaPrice.doubleSauce;
   }
   if (this.doubleCheese) {
     this.price += pizzaPrice.doubleCheese;
   }
 
   this.price *= this.qty;
 
   for (var i = 0; i < this.toppings.length; i++) {
     this.price += this.toppings[i].qty * pizzaPrice.topping;
   }
 
   return this.price;
 };

window.addEventListener("load", function () {
   // Preview image of the pizza 
   var pizzaPreviewBox = document.getElementById("previewBox");
   // Summary of the pizza order
   var pizzaSummary = document.getElementById("pizzaSummary");
   // Pizza size selection list
   var pizzaSizeBox = document.getElementById("pizzaSize");
   // Pizza crust selection list
   var pizzaCrustBox = document.getElementById("pizzaCrust");
   // Pizza double sauce checkbox
   var pizzaDoubleSauceBox = document.getElementById("doubleSauce");
   // Pizza double cheese checkbox
   var pizzaDoubleCheeseBox = document.getElementById("doubleCheese");
   // Pizza topping option buttons
   var toppingOptions = document.querySelectorAll("input.topping");
   // Pizza quantity selection list
   var pizzaQuantityBox = document.getElementById("pizzaQuantity");
   // Add to cart button
   var addToCartButton = document.getElementById("addToCart");
   // Order table displaying the items in the shopping cart
   var cartTableBody = document.querySelector("table#cartTable tbody");
   // Shopping cart total box
   var cartTotalBox = document.getElementById("cartTotal");

   pizzaSizeBox.onchange = drawPizza;
   pizzaCrustBox.onchange = drawPizza;
   pizzaDoubleSauceBox.onclick = drawPizza;
   pizzaDoubleCheeseBox.onclick = drawPizza;
   pizzaQuantityBox.onchange = drawPizza;
   for (var i = 0; i < toppingOptions.length; i++) {
      toppingOptions[i].onclick = drawPizza;
   }


  // Create a shopping cart object
  var myCart = new cart();
  addToCartButton.onclick = addPizzaToCart;

  // Function to build the pizza
  function buildPizza(newPizza) {
    newPizza.qty = pizzaQuantityBox.selectedValue();
    newPizza.size = pizzaSizeBox.selectedValue();
    newPizza.crust = pizzaCrustBox.selectedValue();
    newPizza.doubleSauce = pizzaDoubleSauceBox.checked;
    newPizza.doubleCheese = pizzaDoubleCheeseBox.checked;

    var checkedToppings = document.querySelectorAll("input.topping:checked");
    for (var i = 0; i < checkedToppings.length; i++) {
      if (checkedToppings[i].value !== "none") {
        var myTopping = new topping();
        myTopping.name = checkedToppings[i].parentNode.firstChild.value;
        myTopping.side = checkedToppings[i].value;

        if (checkedToppings[i].value === "full") {
          foodItem.price = 1;
        } else {
          foodItem.price = 0.5;
        }
        newPizza.addTopping(myTopping);
      }
    }
  }

  // Function to add the built pizza to the shopping cart
  function addPizzaToCart() {
    var myPizza = new pizza();
    buildPizza(myPizza);
    myPizza.addToCart(myCart);

    var newItemRow = document.createElement("tr");
    cartTableBody.appendChild(newItemRow);

    var summaryCell = document.createElement("td");
    summaryCell.textContent = pizzaSummary.textContent;
    newItemRow.appendChild(summaryCell);

    var qtyCell = document.createElement("td");
    qtyCell.textContent = myPizza.qty;
    newItemRow.appendChild(qtyCell);

    var priceCell = document.createElement("td");
    priceCell.textContent = myPizza.calcPizzaPrice().toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
    newItemRow.appendChild(priceCell);

    var removeCell = document.createElement("td");
    var removeButton = document.createElement("input");
    removeButton.value = "X";
    removeButton.type = "button";
    removeCell.appendChild(removeButton);
    newItemRow.appendChild(removeCell);

    cartTotalBox.value = myCart.calcCartTotal().toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });

    console.log(myCart);

    removeButton.onclick = function() {
      myPizza.removeFromCart(myCart);
      cartTableBody.removeChild(newItemRow);
      cartTotalBox.value = myCart.calcCartTotal().toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      });
      console.log(myCart);
    };

    resetDrawPizza();
  }



   /* Function to draw the pizza image on the page */
   function drawPizza() {
      pizzaPreviewBox.removeChildren();
      var pizzaDescription = "";

      pizzaDescription += pizzaSizeBox.selectedValue() + '" pizza ';
      pizzaDescription += pizzaCrustBox.selectedValue() + ", ";
      if (pizzaDoubleSauceBox.checked) {
         var sauceImg = document.createElement("img");
         sauceImg.src = "rb_doublesauce.png";
         pizzaPreviewBox.appendChild(sauceImg);
         pizzaDescription += "double sauce, ";
      }
      if (pizzaDoubleCheeseBox.checked) {
         var cheeseImg = document.createElement("img");
         cheeseImg.src = "rb_doublecheese.png";
         pizzaPreviewBox.appendChild(cheeseImg);
         pizzaDescription += "double cheese, ";
      }

      var checkedToppings = document.querySelectorAll("input.topping:checked");
      for (var i = 0; i < checkedToppings.length; i++) {
         if (checkedToppings[i].value !== "none") {

            pizzaDescription += checkedToppings[i].name + "(" + checkedToppings[i].value + "), ";
            var toppingImage = document.createElement("img");
            toppingImage.src = "rb_" + checkedToppings[i].name + ".png";
            pizzaPreviewBox.appendChild(toppingImage);

            if (checkedToppings[i].value === "left") {
               toppingImage.style.clip = "rect(0px, 150px, 300px, 0px)";
            } else if (checkedToppings[i].value === "right") {
               toppingImage.style.clip = "rect(0px, 300px, 300px, 150px)";
            }

         }
      }

      pizzaSummary.textContent = pizzaDescription;
   }

   // Function to reset the pizza drawing 
   function resetDrawPizza() {
      // Object collection of all topping option buttons with a value of 'none'
      var noTopping = document.querySelectorAll("input.topping[value='none']");

      pizzaSizeBox.selectedIndex = 1;
      pizzaCrustBox.selectedIndex = 0;
      pizzaDoubleSauceBox.checked = false;
      pizzaDoubleCheeseBox.checked = false;

      for (var i = 0; i < noTopping.length; i++) {
         noTopping[i].checked = true;
      }
      pizzaSummary.textContent = '14" pizza, thin';
      pizzaPreviewBox.removeChildren();
      pizzaQuantityBox.selectedIndex = 0;
   }

});



/*-------------------- Custom Methods --------------------*/

/* Method added to any DOM element that removes all child nodes of element */
HTMLElement.prototype.removeChildren = function () {
   while (this.firstChild) {
      this.removeChild(this.firstChild);
   }
};

/* Method added to the select element to return the value of the selected option */
HTMLSelectElement.prototype.selectedValue = function () {
   var sIndex = this.selectedIndex;
   return this.options[sIndex].value;
};

