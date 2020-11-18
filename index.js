// include file stystem module
const fs = require('fs'); // fs => file system module . This will return an object that is stored in fs variable

// include the http module
const http = require('http');
const url = require('url'); // for analysis of url
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplates');
///////////////////////////////
//FILE MANAGEMENT 

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8'); // reads the file and stores it in the variable
// console.log(textIn);

// const textOut = `This is what we know about avacado: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('file written success');

// async way using non blocking codes fs.readLine
// const text = fs.readFile('./txt/start.txt', 'utf-8', (err, data) =>{
//     console.log(data);
// });
// console.log('Reading ...');

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) =>{ 
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) =>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) =>{
//             console.log(data3);

//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',(err) =>{
//                 console.log("Your data is written");
//             }); 
//         });
//     });
// });
// console.log('Reading ...');


///////////////////////////////
//CREATING SERVER
//  const replaceTemplate = (temp,product) =>{
//     let output = temp.replace(/{%Product_Name%}/g, product.productName);
//     output = output.replace(/{%Image%}/g, product.image);
//     output = output.replace(/{%Price%}/g, product.price);
//     output = output.replace(/{%From%}/g, product.from);
//     output = output.replace(/{%Quantity%}/g, product.quantity);
//     output = output.replace(/{%Nutrients%}/g, product.nutrients);
//     output = output.replace(/{%ID%}/g, product.id);
//     output = output.replace(/{%Description%}/g, product.description);

//     // to add not organic class
//     if(!product.organic) output = output.replace(/{%Not_organic%}/g, 'not-organic');
//     return output;
// }


// getting the data syncronus way
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// using slugify module 
const slugs = dataObj.map(el => slugify(el.productName, {
    lower: true
}));
console.log(slugs);

//Getting the templates
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const server = http.createServer((request, response) => {
    // console.log(request.url);
    //const pathName = request.url;

    //Parssing or extracting values from urls
    const {
        query,
        pathname
    } = url.parse(request.url, true); // destructuring
    //Overview page
    if (pathname === '/' || pathname === '/overview') {
        response.writeHead(200, {
            'Content-type': 'text/html'
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%Product_Cards%}', cardsHtml);
        response.end(output);

        //Prdouct page    
    } else if (pathname === '/product') {
        response.writeHead(200, {
            'Content-type': 'text/html'
        });

        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);

        response.end(output);

        //API    
    } else if (pathname === '/api') {
        response.writeHead(200, {
            'Content-type': 'application/json'
        });
        response.end(data);

        //Not found
    } else {
        response.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello world'
        });
        response.end('<h1>Page not found!!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to results on port 8000');
});