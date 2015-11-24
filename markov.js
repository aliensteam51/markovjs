
var markov = (function() {

    var _markov = {

        Chain : function () {
            // States
            this.states = []
            this.initialState = null
            this._currentState
            this._previousStates = []
            this.maxPreviousStates = 2
        },

        Weight : function (weight) {
            this._value = 0
            this._updateProc = null

            if (typeof weight === 'number') {
                this._value = weight
            } else if (typeof weight === 'function') {
                this._updateProc = weight
            }
        },

        State : function () {
            this._transitions = []
        },

        _Transition : function (state, weight) {
            this._state = state
            this._weight = weight
        }
    }


    // Weight object prototype
    _markov.Weight.prototype.updateValue = function (fromState, toState, previousStates) {
        if (this._updateProc) {
            this._value = this._updateProc.call(this, fromState, toState, previousStates)
        }
    }


    // State object prototype
    _markov.State.prototype.addTransitionToState = function (state, weight) {
        var transition = new _markov._Transition(state, weight)

        this._transitions.push(transition)
    }

    _markov.State.prototype._nextState = function (previousStates) {
        var totalWeight = 0
            ,transitions = this._transitions
            ,numTransitions = transitions.length
            ,randomValue
            ,lowWeight
            ,highWeight = 0
            ,nextState = this
            ,transition
            ,weight
            ,i

        for (i = 0; i < numTransitions; i++) {
            transition = transitions[i]
            weight = transition._weight

            // Update weights
            weight.updateValue(this, transition._state, previousStates)

            // Add new weight value to total weight
            totalWeight += weight._value
        }

        // Generate random value between 0 and totalWeight
        randomValue = Math.random() * totalWeight

        for (i = 0; i < numTransitions; i++) {
            transition = transitions[i]

            // Set low and high weight of this transition
            lowWeight = highWeight
            highWeight += transition._weight._value

            // Check if randomValue lies between low and high of the transition
            if (randomValue >= lowWeight && randomValue < highWeight) {
                nextState = transition._state
                break
            }
        }

        return nextState
    }


    // Chain object prototype
    _markov.Chain.prototype.initialize = function () {
        this._currentState = this.initialState
    }

    _markov.Chain.prototype._rememberState = function (state) {
        // insert state at front of array
        this._previousStates.unshift(state)

        if (this._previousStates.length > this.maxPreviousStates) {
            // pop from back of array
            this._previousStates.pop()
        }
    }

    _markov.Chain.prototype.nextState = function () {
        // Output is current state
        var currentState = this._currentState

        // Set next state
        this._currentState = currentState._nextState(this._previousStates)

        // Remember current state
        this._rememberState(currentState)

        return currentState
    }


    return _markov

})()


module.exports = markov
