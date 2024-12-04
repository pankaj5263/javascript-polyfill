// curry function soution

function curry(fn) {
    return function curried(...args) {
      if (args.length >= fn.length) {
        return fn(...args)
      } 
    return (...nextargs) => curried(...args, ...nextargs);
    }
  }

function sum(a, b) {
    return a + b;
  }
  
const curriedSum = curry(sum);


// Polyfill function soution of is Array;
Array.myIsArray = function(args){
    return Object.prototype.toString.call(args) === '[object Array]';
}

// polyfill -  map function;
Array.prototype.myMap = function(callback){
  let temp = [];

  for(let i=0;i<this.length;i++){
    temp.push(callback(this[i], i, this));
  }

  return temp;
}

// polyfill - filter function;

Array.prototype.myFIlter = function(callback){
 let temp = [];

 for(let i=0;i<this.length;i++){
   if(callback(this[i], i, this)){
     temp.push(this[i]);
   }
 }
 return temp;
}

// polyfill - reduce function;

Array.prototype.myReduce = function(callback, initialValue){
    let accumulator = initialValue;
    for(let i=0;i<this.length;i++){
      accumulator = accumulator?callback(accumulator, this[i], i, this): this[i];
    }

    return accumulator;
}


// polyfill - Call method
Function.prototype.myCall = function(context,...args){
    if(typeof this !== 'function'){
     throw new TypeError('myCall() called on a non-function');
    }
    context.fn = this;
    return context.fn(...args);
}

let obj = {name: 'John'};
function showName(){
    console.log(this.name);
    return this.name;
}

// polyfill - Apply method

Function.prototype.myApply = function(context,args){
    if(typeof this !== 'function'){
     throw new TypeError('myApply() called on a non-function');
    }
    
    if(!Array.isArray(args)){
      throw new TypeError('myApply() expects an array as the second argument');
    }

    context.fn = this;
    return context.fn(...args);
}
// polyfill - Bind method
Function.prototype.myBind = function(context,...args){
    if(typeof this !== 'function'){
        throw new TypeError('myApply() called on a non-function');
       }
       
       if(!Array.isArray(args)){
         throw new TypeError('myApply() expects an array as the second argument');
       }
   
       context.fn = this;
       return () => context.fn(...args);
}
