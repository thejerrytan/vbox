// Conversation:
// Hi! My name is J.
// 								Nice to meet you!
// What is your name?
// 											   K
// I am deaf but I am happy to be talking to you!
// 										  Me too!
// I am sorry but I got to go. I have a presentation to deliver!
// 							No problem! Go kill it!

// const labels = ["Hi", "name", "J", "What is" "you", 
// "I", "deaf", "happy", "meet", 
// "terminal", "bye bye", "IDLE"];

const labels = ["hi", "my name is", "j", "nice to", "meet", "you", "what is"];
console.log(labels);

export default labels;





/*
Hi, I, name, J
					
// 								Nice to meet you!

What is, you, name
// 								My name is Kim
I, deaf, happy, meet, you, 
// 								Yes, me too
bye bye,
// 								See you

+2
*/

// const labels = ["Hi", "My name is", "J",
// "nice to", "meet", "you", "What is", 
// "I am", "deaf", "happy to be", "talking to",
// "sorry", "got to go", "terminal", "I have a", "presentation", "to deliver", "IDLE"];
function keyDownTextField(e) {
  var keyCode = e.keyCode;
  console.log(keyCode);
}
document.addEventListener("keydown", keyDownTextField, false)