const express = require('express')
const app = express()
const alpha = require('alphavantage')({key: 'N9E29TPKEJIADOZM'})

const mysql = require('mysql') // request mysql
const connection = mysql.createConnection({
    host       : 'localhost', // not necessary to be local
    user       : 'root',
    password   : 'alvinbarry',
    database   : 'epic_fa'
});
connection.connect((error) => {console.log(error)}) 

app.set('view engine', 'pug')

app.get('/', (request, response) => {
    response.render('welcome')
})

app.get('/input', (request, response) => {
    response.render('input')
})

app.get('/result', (request, response) => {
    result = request.query
    console.log(result)
    let closing_price = 0
    let ID = result['ID']
    let Date = result['date']
    let Time = result['time']
    let Quantity = result['quantity']
    let Symbol = result["symbol"]
    let Reason = result["reason"]

    if (Quantity >= 0){
        quantity_sign = 1
    }
    else{
        quantity_sign = -1
        Quantity = -Quantity
    }
    alpha.data.daily(Symbol, "json").then(function(data){
        closing_price = data['Time Series (Daily)'][Date]["4. close"];
                
        //Do all the data upload here
        //New User Only


        //All Users
        connection.query('insert into trades (user_id, symbol, quantity, closing_price, date, time, reason) values (${ID}, ${Symbol}, ${Quantity}, ${closing_price}, ${Date}, ${Time}, ${Reason});', 
        function (error){
            if (error){
                response.sendStatus(500)
                return
            }
        });

        response.render('result', {symbol: Symbol, quantity: Quantity, date: Date, quantity_sign: quantity_sign, price: closing_price})
        
    })
})


app.get('/lookup', (request, response) => {
    response.render('lookup')
})

app.get('/history', (request, response) => {
    //right here we need to get all the stuff that's from the database with the corresponding ID, then name them as the following variables:
    connection.query('select trades.user_id user_id, trades.symbol symbol, trades.quantity quantity, trades.trade_date trade_date, trades.trade_time trade_time, trades.reason reason from trades',
                    function (error, results){
                        if (error){
                            response.sendStatus(500)
                            return
                        }
                        // results is a default query return will be array and each element will be a dictionary with key same with the column name
                        for (var i = 0; i < results.length; i++){
                            var data_dict = results[i];
                            var id = data_dict['user_id']
                            var symbol = data_dict['symbol']
                            var date = data_dict['trade_date']
                            var time = data_dict['trade_time']
                            var quantity = data_dict['quantity']
                            var reason = data_dict['reason']
                            if (quantity >= 0){
                                quantity_sign = 1
                            }
                            else{
                                quantity_sign = -1
                                quantity = -quantity
                            }
                            response.render('history', {ID: id, date: date, time: time, quantity_sign: quantity_sign, symbol: symbol, quantity: quantity, reason: reason})
                        }
                    })
})

app.listen(8080, ()=>{
    console.log("Server Listening on port 8080")
})
