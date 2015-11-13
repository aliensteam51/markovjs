var markov = require('./markov.js')

var TestState = function (value) {
    this.value = value
    markov.State.call(this)
}

TestState.prototype = Object.create(markov.State.prototype)

var chain = new markov.Chain()
var state1 = new TestState(10)
var state2 = new TestState(20)
var state3 = new TestState(30)

chain.states.push(state1)
chain.states.push(state2)
chain.states.push(state3)
chain.initialState = state1

state1.addTransitionToState(state1, new markov.Weight(0, function (fromState, toState, previousStates) {
    if (previousStates.length > 0 &&
        previousStates[0] === state1) {
        return 0
    }

    return 20
}))
state1.addTransitionToState(state2, new markov.Weight(60))
state1.addTransitionToState(state3, new markov.Weight(20))

state2.addTransitionToState(state2, new markov.Weight(0, function (fromState, toState, previousStates) {
    if (previousStates.length > 1 &&
        previousStates[0] === state2 &&
        previousStates[1] === state2) {
        return 0
    }

    return 50
}))
state2.addTransitionToState(state3, new markov.Weight(50))

state3.addTransitionToState(state1, new markov.Weight(100))

chain.initialize()

for (var i = 0; i < 100; i++) {
    var state = chain.nextState()

    console.log("value", state.value)
}
