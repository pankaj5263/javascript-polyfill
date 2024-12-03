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

console.log(curriedSum(1)(2));


// polyfill function soution of is Array;
Array.myIsArray = function(args){
    return Object.prototype.toString.call(args) === '[object Array]';
}

console.log("test", Array.myIsArray("123"));