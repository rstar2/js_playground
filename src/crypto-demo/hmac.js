// 3. HMAC (Hash-based message authentication code) - hash + shared_key
// For verifying that the message is sent from someone trusted

// Example is also JWT

const {createHmac} = require('crypto');


// USAGE: 

const message = 'HI';

// so party A sends the message with the hmac to party B
const key = 'shared-key-keep-safe-in-both-parties-A-and-B';
const hmac = createHmac('sha256', key)
    .update(message).digest('hex');
// const event = {message, hmac};    


// so party C sends the message with the hmac to party B
const hmac2 = createHmac('sha256', 'key-malicious-party-C')
    .update(message).digest('hex'); 
//const event = {message, hmac2};    



// now party B receives it the message together with its hmac.
// Note the message is "public", what party B only needs is to verify that the message is
// from the trusted party A , and not from someone else pretending

const hmacCheck = createHmac('sha256', key)
    .update(message).digest('hex');

// so it is from party A - will be ok as keys are same/shared
console.log(`Is valid message from party A : ${hmac === hmacCheck}`);

// if it is from someone else - hmacs will be different as keys are different
console.log(`Is valid message from party C : ${hmac2 === hmacCheck}`);