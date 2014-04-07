/**
 * New node file
 */

var person = Object.create(null);

Object.defineProperty(person, 'name', {value : "Jack", enumerable: true});
//Object.defineProperty(person, '');

for(var p in person) {
    console.log(p + ":" + person[p]);
}

var person = Object.create(null);

Object.defineProperty(person, 'name', {value : "Jane", enumerable: false});
//Object.defineProperty(person, '');

for(var p in person) {
    console.log(p + ":" + person[p]);
}

var man = Object.create(Object.prototype);

for(var p in man) {
    console.log(p);
}

var human = {"hands" : 2, "legs" : 2};
var male = Object.create(human);
male.gender = "male";
Object.defineProperty(male, "gene", {value : "XY", writable : false, enumerable : true});

console.log("all properties of male");
for(var p in male) {
    console.log(p);
}

console.log("all properties of human");
for(var p in human) {
    console.log(p);
}

console.log("all properties of male itself only");
for(var p in male) {
    if(male.hasOwnProperty(p)) {
        console.log(p);
    }
}

male.gene = "MM";
male.hand = 3;
male.leg = "4";

console.log("all properties of male");
for(var p in male) {
    console.log(p + ":" + male[p]);
}

