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

Object.prototype.myBind = function (context, ...args) {
  if (typeof this !== 'function') {
      throw new Error("This is not a function");
  }
  context = Object(context); // Ensure context is an object
  let fun = Symbol(); // Unique property name to avoid collisions
  context[fun] = this; // Assign the function to the context

  return function (...newArgs) {
      // Call the function with both initial and new arguments
      return context[fun](...args, ...newArgs);
  };
};

function show() {
  console.log(this.name);
}

const bindFunction = show.myBind({ name: "pankaj" });
bindFunction();


// polyfill - once Function called

function once(fn, context){
   let ran;
   return function(){
      if(fn){
        ran=fn.apply(context || this, arguments);
        fn = null;
      }
      return ran;
   }
}
const hello = () => console.log("hello once polyfill");
const test = once(hello);

// polifill for Promises

function MyPromisePolyfill(executer){
  let onResolve, onReject;

  const resolve = (value) =>{
    onResolve(value);
  }

  const reject = (value) =>{
    onReject(value);
  }

  this.then = function(callback){
    onResolve = callback;
    return this;
  }

  this.catch = function(callback){
    onReject = callback;
    return this;
  }

executer(resolve, reject);
}


const promise = new MyPromisePolyfill((resolve, reject)=>{
  setTimeout(()=>reject(2), 4000);
});

promise.then((value) => console.log(value)).catch((value) => console.error(value));



function MyPromisePolyfill(executor) {
  let state = 'pending';
  let value;
  let handlers = [];
  let catchers = [];

  const resolve = (result) => {
    if (state !== 'pending') return;
    state = 'fulfilled';
    value = result;

    handlers.forEach((handler) => handler(value));
  };

  const reject = (error) => {
    if (state !== 'pending') return;
    state = 'rejected';
    value = error;

    catchers.forEach((catcher) => catcher(value));
  };

  this.then = function (callback) {
    return new MyPromisePolyfill((resolve, reject) => {
      handlers.push((result) => {
        try {
          const nextValue = callback(result);
          resolve(nextValue);
        } catch (err) {
          reject(err);
        }
      });

      if (state === 'fulfilled') {
        handlers.forEach((handler) => handler(value));
      }
    });
  };

  this.catch = function (callback) {
    return new MyPromisePolyfill((resolve, reject) => {
      catchers.push((error) => {
        try {
          const nextValue = callback(error);
          resolve(nextValue);
        } catch (err) {
          reject(err);
        }
      });

      if (state === 'rejected') {
        catchers.forEach((catcher) => catcher(value));
      }
    });
  };

  try {
    executor(resolve, reject);
  } catch (err) {
    reject(err);
  }
}
