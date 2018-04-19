var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id:" + connection.threadId);
    displayItems();
});

//running this application will first display all of the items available for sale.
function displayItems() {
    connection.query("SELECT item_id, product_name, price FROM products WHERE stock_quantity >= 1", function (err, response) {
        if (err){
            throw err;
            console.log(err);
        }else{
            console.log(response);
            initialPrompt();
        }  
    });
};

//  The first should ask them the ID of the product they would like to buy.
//  The second message should ask how many units of the product they would like to buy.
function initialPrompt() {
    inquirer.prompt([
        {
            name: "item_id",
            type: "input",
            message: "Please select the ID of the product you would like to purchase.",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                }else {
                    return false;
                }
            }
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "How many units would you like to buy?",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                }else {
                    return false;
                }
            }
        }
        ]).then(function(input) {
        var chosenItem = input.item_id;
        var quantity = input.stock_quantity;
    
        // query db to confirm that the given item ID exists in the desired quantity
        connection.query("SELECT * FROM products WHERE ?",
        {
            item_id: input.item_id
        },
            function(err, data) {
                //console.log(data.length);
               // if (err) throw err;
            
                    //if user selects an invalid item ID, the data array will be empty 
                    //if (chosenItem  0){
                    //console.log("------DATA.LENGTH-----");
                    //console.log(data.length);
                    //console.log("ERROR! Invalid Item ID. Please select a valid Item ID from the list below:")
                    //displayItems();
                    console.log("----" + data[0].stock_quantity);
                    console.log("----" + input.stock_quantity);

                    if (input.stock_quantity < parseInt(input.stock_quantity)){
                        console.log("We're placing your order now!");

                    //update db inventory 
                    connection.query(
                        "UPDATE products SET ? WHERE ?"
                        [
                         {
                            stock_quantity: input.stock_quantity
                         },
                         {
                            item_id: chosenItem
                         }
                        ], 
                    function(err, data){
                        if (err) throw err;

                        console.log("SUCCESS! Your order has been placed! Your total is $" + data[0].price * quantity);
                        //end db connection
                        connection.end();
                    })

                    } else {
                        console.log("ERROR! Insufficient stock!");
                        console.log("Please modify your order by selecting from the options below:");
                        displayItems();
                    };
                
            });
            
    });

};

//initialPrompt();