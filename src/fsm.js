class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config === undefined) {
            throw new Error('Failure: config is not passed');
        }

        this.current = config.initial;
        this.states = config.states;
        this.historyOfStates = {
            currentArray: [config.initial],
            deletedArray: [],
            lastOperation: null,
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.current;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        for (var i in this.states) {

            if (i === state) {

                this.current = state;
                this.historyOfStates.currentArray.push(state);
                this.historyOfStates.lastOperation = 'add';

                return true;
            }
        }

        throw new Error();
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var currentState = this.current;

        for (var i in this.states[currentState].transitions) {

            if (i === event) {

                this.current = this.states[currentState].transitions[event];
                this.historyOfStates.currentArray.push(this.current);
                this.historyOfStates.lastOperation = 'add';

                return true;
            }
        }

        throw new Error();
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.current = this.historyOfStates.currentArray[0];
        this.historyOfStates.currentArray.splice(1);
        this.historyOfStates.deletedArray.splice(0);
        this.lastOperation = null;

        return true;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var arrayOfStates = [];

        if (event === undefined) {

            for (var i in this.states) {
                arrayOfStates.push(i);
            }

            return arrayOfStates;
        }

        for (var i in this.states) {

            for (var variable in this.states[i].transitions) {

                if (variable === event) {
                    arrayOfStates.push(i);
                    break;
                }
            }
        }

        return arrayOfStates;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        var arrayLength = this.historyOfStates.currentArray.length;
        var itemToRemove = this.historyOfStates.currentArray[arrayLength - 1];

        if (arrayLength <= 1 ) {
            return false;
        }

        this.historyOfStates.currentArray.pop();
        this.historyOfStates.deletedArray.push(itemToRemove);
        this.historyOfStates.lastOperation = 'remove';

        arrayLength = this.historyOfStates.currentArray.length;
        this.current = this.historyOfStates.currentArray[arrayLength - 1];

        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        var arrayLength = this.historyOfStates.deletedArray.length;
        var itemToRestore =this.historyOfStates.deletedArray[arrayLength - 1];

        if (arrayLength == 0 || this.historyOfStates.lastOperation == 'add') {
            return false;
        }

        this.historyOfStates.deletedArray.pop();
        this.historyOfStates.currentArray.push(itemToRestore);

        this.current = itemToRestore;

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.historyOfStates.currentArray.splice(0);
        this.historyOfStates.deletedArray.splice(0);
        this.lastOperation = null;

        return true;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
