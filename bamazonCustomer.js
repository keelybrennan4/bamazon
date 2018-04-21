var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

//connect to bamzaon database 
function dbConnect (){
    connection.connect(function (err, res) {
        if (err) throw err;
        console.log("Connected as id:" + connection.threadId);
        console.log("Welcome! Check out our selection for sale.")
        displayItems();
    })
}

//display items for sale 
function displayItems() {
    connection.query("SELECT * FROM products", function (err, res){
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("\nItem ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Price: $" + res[i].price);  
        }
        initialPrompt();
    })
}

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
            console.log("You have selected \n Item ID: " + input.item_id + "\n Quantity: " + input.stock_quantity);
            
            var chosenItem = input.item_id;
            var chosenQuantity = input.stock_quantity;

            // query bamazon database to confirm that the given item ID exists in the desired quantity
            var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?"
            
            connection.query(query, { item_id: input.item_id },function (err, res){
                    //if (err) throw err;
                    if (res.length == 0){
                        console.log("ERROR! Invalid Item ID. Please select a valid Item ID from the list below:");
                        displayItems();

                    }else {
                        if (chosenQuantity < res[0].stock_quantity);
                        console.log("We're placing your order now!");
                        console.log(chosenItem);

                //update bamazon database inventory 
                        
                //connection.query(
                    //                         
                    "UPDATE products SET ? WHERE ?",


                        //console.log(res[0].stock_quantity);
                        console.log(res[0].item_id);
                        console.log(res[0].product_name);
                        console.log(res[0].price);

                        var price = res[0].price;
                        console.log(price);
                        console.log(chosenQuantity);
                        console.log("Your total is $" + price*chosenQuantity);
                    }
            })
        })

}

//                    //update db inventory 
//                    // connection.query("SELECT * FROM products WHERE ?",
//                     connection.query(
//                         "UPDATE products SET ? WHERE ?",
//                         [
//                          {
//                             stock_quantity: input.stock_quantity
//                          },
//                          {
//                             item_id: chosenItem
//                          }
//                         ], 
//                     function(err, data){
//                         if (err) throw err;
//                         console.log(data[0].price * quantity);

//                         console.log("SUCCESS! Your order has been placed! Your total is $" + (input.stock_quantity * price[0]));
//                         //end db connection
//                         connection.end();
//                     })

//                     } else {
//                         console.log("ERROR! Insufficient stock!");
//                         console.log("Please modify your order by selecting from the options below:");
//                         displayItems();
//                     };
                
//             });
            
//     });

// };


// function continueShopping() {
//     inquirer.prompt({
//         name: "answer",
//         type: "input",
//         message: "\n Do you need anything else (y/n)?"
//     }).then(function(answer) {
//         var answer = answer.answer.toLowerCase();
//         if (answer == 'y') {
//             console.log("\n");
//             displayItems();
//         } else {
//             console.log("\nThank you again for dropping by.");
//             connection.end();
//         }
//     })  
// }

dbConnect();