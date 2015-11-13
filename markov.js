
var markov = (function() {

    var _markov = {

        Chain : function () {
            this.states = []
            this.initialState = null
            this._currentState
            // memory of previous states, states are added to the front of the array
            // and popped from the back
            this._memory = []
            this.memorySize = 2
        },

        Weight : function (value, updateProc) {
            this._value = typeof value !== 'undefined' ? value : 0;
            this._updateProc = typeof updateProc !== 'undefined' ? updateProc : null
        },

        State : function () {
            this._connections = []
        },

        _Connection : function (state, weight) {
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
    _markov.State.prototype.connectToState = function (state, weight) {
        var connection = new _markov._Connection(state, weight)

        this._connections.push(connection)
    }

    _markov.State.prototype._nextState = function (previousStates) {
        var totalWeight = 0
            ,connections = this._connections
            ,numConnections = connections.length
            ,randomValue
            ,lowWeight
            ,highWeight = 0
            ,nextState = this
            ,connection
            ,weight
            ,i

        for (i = 0; i < numConnections; i++) {
            connection = connections[i]
            weight = connection._weight

            // Update weights
            weight.updateValue(this, connection._state, previousStates)

            // Add new weight value to total weight
            totalWeight += weight._value
        }

        // Generate random value between 0 and totalWeight
        randomValue = Math.random() * totalWeight

        for (i = 0; i < numConnections; i++) {
            connection = connections[i]

            // Set low and high weight of this state
            lowWeight = highWeight
            highWeight += connection._weight._value

            // Check if randomValue lies between low and high of the state
            if (randomValue >= lowWeight && randomValue < highWeight) {
                nextState = connection._state
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
        this._memory.unshift(state)

        if (this._memory.length > this.memorySize) {
            // pop from back of array
            this._memory.pop()
        }
    }

    _markov.Chain.prototype.nextState = function () {
        var currentState = this._currentState

        this._currentState = currentState._nextState(this._memory)

        this._rememberState(currentState)

        return currentState
    }


    return _markov

})()


module.exports = markov
