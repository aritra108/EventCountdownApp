// DOM elements 
const inputForm = document.querySelector('#input-form');
const nameInput = document.querySelector('#name-input');
const dateInput = document.querySelector('#date-input');
const urlInput = document.querySelector("#url-input");
const eventHeading = document.querySelector('#event-heading');
const countdownContainer = document.querySelector('#countdown-container');
const body = document.querySelector('body');
const toggle = document.querySelector('#toggle');
const eventContainer = document.querySelector('#event-container');
const inputContainer = document.querySelector('#input-container');

// Global Variables 
let days, hours, mins, secs;
let interval;

// Events 
document.addEventListener('DOMContentLoaded', display); // When the window is loaded 
inputForm.addEventListener('submit', submitForm); // When the form is submitted 
toggle.addEventListener('click', toggleScreen); // when the toggle button is clicked 

// Functions 
function submitForm (e) {

    // Close the previous interval (if any)
    clearInterval(interval);

    // Add the input values to the local storage 
    Storage.addValue(nameInput.value, dateInput.value, urlInput.value);

    // Add the input values to the DOM 
    addAttributes(nameInput.value, urlInput.value, dateInput.value);

    // Toggle to event page 
    UI.toggle('event');
}

function toggleScreen (e) {
    // Move onto the input page 
    UI.toggle('input');
}

function display (e) {

    const event = Storage.getValue();

    if ( event !== null ) { // If there is a running event, 

        // Add all attributes to the DOM 
        addAttributes(event[0].name, event[0].url, event[0].date);

        // Display the event page 
        UI.toggle('event');

    } 
    else {
        // Display the input page 
        UI.toggle('input');
    }

}

function addAttributes (name, url, date) {

    // Set the event heading 
    UI.addName(name);

    // Set the background image 
    UI.addUrl(url);

    // Set the countdown timer 
    interval = setInterval (() => {
        Arithmetic.compute(date); // Compute 
        UI.addDate(); // Update in DOM
    }, 1000);
}

// Class UI : Handles all the UI operations 
class UI {

    static addName (name) {
        eventHeading.innerHTML = name;
    }

    static addUrl (url) {
        body.style.backgroundImage = `url('${url}')`;
    }

    static addDate () {

        // Create the HTML 
        const html = `
            <div id = 'highlight'>${days}<span>Days</span></div>
            <div>${hours}<span>Hrs</span></div>
            <div>${mins}<span>Mins</span></div>
            <div>${secs}<span>Secs</span></div>
        `;

        // Add the HTML to the DOM
        countdownContainer.innerHTML = html;

    }

    static toggle (pageName) {
        if ( pageName === 'event' ) {
            inputContainer.style.display = 'none';
            toggle.style.display = 'block';
            eventContainer.style.display = 'block';
            setTimeout(() => eventContainer.style.opacity = '1', 800);
        } else if (pageName === 'input') {
            inputContainer.style.display = 'block';
            toggle.style.display = 'none';
            eventContainer.style.display = 'none';
            eventContainer.style.opacity = '0';
            body.style.backgroundImage = 'none';
        }
        
    }

}

// Class Arithmetic : Computes operations on the date and time 
class Arithmetic {

    static compute (date) {

        // Get the present time (in ms)
        const now = new Date().getTime(); 

        // Convert the date into milliseconds 
        date += ' 00:00:00';
        const deadline = new Date(date).getTime();

        // Compute the difference between present and the date 
        const distance = deadline - now;

        // Time calculation 
        days = Math.floor(distance / (1000 * 60 * 60 * 24));
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        secs = Math.floor((distance % (1000 * 60)) / 1000);
    }

}

// Class Storage: Handles the Storage Operations 
class Storage {

    static getValue () {
        if (localStorage.getItem('event') === null) {
            return null;
        } else {
            return JSON.parse(localStorage.getItem('event'));
        }
    }

    static addValue (name, date, url) {

        // Make an event object 
        const currEvent = {
            name: name, 
            date: date, 
            url: url
        };
        
        // Push this object into an array 
        let event = [];
        event.push(currEvent);

        // Store this array in localStorage 
        localStorage.setItem('event', JSON.stringify(event));
    }

}