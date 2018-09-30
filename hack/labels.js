// Conversation:
// Hi! My name is J.
// 								Nice to meet you!
// What is your name?
// 											   K
// I am deaf but I am happy to be talking to you!
// 										  Me too!
// I am sorry but I got to go. I have a presentation to deliver!
// 							No problem! Go kill it!

const labels = ["Hi", "name", "J", "you", "what is", 
"I", "deaf", "happy", "meet", 
"terminal", "bye bye", "IDLE"];

// const labels = ["hi", "my name is", "j", "nice to", "meet", "you", "what is"];
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
window.saySentence = function(text){
    var msg = new SpeechSynthesisUtterance(text);
	window.speechSynthesis.speak(msg);
}
window.overrideWord = null;
function keyDownEventTriggered(e) {
  var keyCode = e.keyCode;
  console.log(keyCode);
  switch(keyCode){
  	case 'Q'.charCodeAt(): window.overrideWord = "hi"; break;
  	case 'W'.charCodeAt(): window.overrideWord = "name"; break;
  	case 'E'.charCodeAt(): window.overrideWord = "J"; break;
  	case 'R'.charCodeAt(): window.overrideWord = "what is"; break;
  	case 'T'.charCodeAt(): window.overrideWord = "you"; break;
  	case 'A'.charCodeAt(): window.overrideWord = "name"; break;
  	case 'S'.charCodeAt(): window.overrideWord = "I"; break;
  	case 'D'.charCodeAt(): window.overrideWord = "deaf"; break;
  	case 'F'.charCodeAt(): window.overrideWord = "happy"; break;
  	case 'G'.charCodeAt(): window.overrideWord = "meet"; break;
  	case 'Z'.charCodeAt(): window.overrideWord = "you"; break;
  	case 'X'.charCodeAt(): window.overrideWord = "bye"; break;

  	case '1'.charCodeAt(): window.saySentence("hi, my name is J"); break;
  	case '2'.charCodeAt(): window.saySentence("what is your name"); break;
  	case '3'.charCodeAt(): window.saySentence("I am deaf, happy to meet you"); break;
  	case '4'.charCodeAt(): window.saySentence("bye bye"); break;

  	case 32: window.overrideWord = ""; break; //Space
  }
}
function keyUpEventTriggered(e) {
  var keyCode = e.keyCode;
  console.log(keyCode);
  switch(keyCode){
  	case 'Q'.charCodeAt(): 
  	case 'W'.charCodeAt(): 
  	case 'E'.charCodeAt(): 
  	case 'R'.charCodeAt(): 
  	case 'T'.charCodeAt(): 
  	case 'A'.charCodeAt(): 
  	case 'S'.charCodeAt(): 
  	case 'D'.charCodeAt(): 
  	case 'F'.charCodeAt(): 
  	case 'G'.charCodeAt(): 
  	case 'Z'.charCodeAt(): 
  	case 'X'.charCodeAt(): 
  	case 32: window.overrideWord = null; break; //Space
  }
}
document.addEventListener("keydown", keyDownEventTriggered, false)
document.addEventListener("keyup", keyUpEventTriggered, false)