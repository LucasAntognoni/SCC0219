var cart = 0;
var current_user;
var shoppingCart = [];
var cart_total_price=0.0;

function addItemStorage(titulo, preco){
  localStorage.cart += titulo + ";" + preco + ";";
  if (localStorage.total) {
    localStorage.total = Number(localStorage.total) + 1;
  } else {
    localStorage.total = 1;
  }
}

function clearCart(){
  localStorage.total = 0;
  localStorage.cart = "";
}


function displayShoppingCart(){
  $(".qtdcart").text(localStorage.total + " itens");
  var orderedProductsTblBody=document.getElementById("orderedProductsTblBody");
  //ensure we delete all previously added rows from ordered products table
  while(orderedProductsTblBody.rows.length>0) {
    orderedProductsTblBody.deleteRow(0);
  }
  var res = localStorage.cart.split(";");
  if (res[0] != ""){
    for(i = 0; i < (res.length/2 + 2); i=i+2){
      //add new row
      var row=orderedProductsTblBody.insertRow();
      //create two cells for product properties
      var cellName = row.insertCell(0);
      var cellPrice = row.insertCell(1);
      cellPrice.align="right";
      //fill cells with values from current product object of our array
      cellName.innerHTML = res[i];
      cellPrice.innerHTML = res[i+1];
      cart_total_price += parseFloat(res[i+1]);
    }
    //fill total cost of our shopping cart
    document.getElementById("cart_total").innerHTML= cart_total_price.toFixed(2);
  }else{
    var row=orderedProductsTblBody.insertRow();
    //create three cells for product properties
    var cellName = row.insertCell(0);
    var cellPrice = row.insertCell(1);
    cellPrice.align="right";
    //fill cells with values from current product object of our array
    cellName.innerHTML = "No product";
    cellPrice.innerHTML = "---------" ;
    document.getElementById("cart_total").innerHTML= 0.00;
  }
}

function AddtoCart(name,price){
  cart++;
  $(".qtdcart").text(cart + " itens");
  //Below we create JavaScript Object that will hold three properties you have mentioned:    Name,Description and Price
  var singleProduct = {};
  //Fill the product object with data
  addItemStorage(name, price);
  singleProduct.Name=name;
  singleProduct.Price=price;
  //Add newly created product to our shopping cart
  shoppingCart.push(singleProduct);
  //call display function to show on screen
}
