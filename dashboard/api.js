// function getData() {
//     const response = await fetch('https://api.etherscan.io/api?module=account&action=txlistinternal&address=0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3&startblock=0&endblock=2702578&page=1&offset=10&sort=asc&apikey=YourApiKeyToken')
//     const data = await response.json()
//     console.log(data);
//   }
//   getData()

// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest()
let list_obj = [] ;
let txt = "";

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://api.etherscan.io/api?module=account&action=txlistinternal&address=0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3&startblock=0&endblock=2702578&page=1&offset=10&sort=asc&apikey=YourApiKeyToken', true)


request.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);

 list_obj = data.result
 let length = list_obj.length;
//  console.log(list_obj[0])
for (var i = 0; i < 10 ; i++) 
{ console.log(list_obj[i]); }

}

// Send request
request.send()