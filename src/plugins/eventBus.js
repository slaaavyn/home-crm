import Vue from 'vue';

const EventBus = new Vue();

EventBus.emitError = (error = {}) => {
    if(error.data.message) {
        EventBus.$emit('showError', error.data.message);
    } else {
        EventBus.$emit('showError', `${error.statusText}. Something wrong.`);
    }

    // Develop
    if(process.env.NODE_ENV !== 'production') {
        console.log(error);
    }
};

export default EventBus;

/* Example for use */

/* Import the EventBus
    import { EventBus } from './eventBus.js';
*/

/*  Emit global event
    EventBus.$emit('i-got-clicked', this.clickCount);
*/

/*  Receive global event
    EventBus.$on('i-got-clicked', clickCount => {
      console.log(`Oh, that's nice. It's gotten ${clickCount} clicks! :)`)
    });
*/


