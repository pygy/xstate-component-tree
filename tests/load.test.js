"use strict";

const { Machine : createMachine, interpret } = require("xstate");
const trees = require("./util/trees.js");
const component = require("./util/component.js");
const loadAsync = require("./util/async-loader.js");

describe("xstate-component-tree", () => {
    it("should support sync .load methods", async () => {
        const testMachine = createMachine({
            initial : "one",

            states : {
                one : {
                    meta : {
                        load : () => component("one"),
                    },
                },
            },
        });

        const service = interpret(testMachine);

        const states = trees(service);

        await states();
    });
    
    it("should pass context and event params to .load methods", async () => {
        const testMachine = createMachine({
            initial : "one",
            context : "context",

            states : {
                one : {
                    meta : {
                        load : (ctx, event) => ({ ctx, event }),
                    },
                },
            },
        });

        const service = interpret(testMachine);

        const states = trees(service);

        await states();
    });
    
    it("should support async .load methods", async () => {
        const testMachine = createMachine({
            initial : "one",

            states : {
                one : {
                    meta : {
                        load : loadAsync("one"),
                    },
                },
            },
        });

        const service = interpret(testMachine);

        const states = trees(service);

        await states();
    });

    it("should support nested async .load methods", async () => {
        const testMachine = createMachine({
            initial : "one",

            states : {
                one : {
                    meta : {
                        load : loadAsync("one"),
                    },

                    initial : "two",

                    states : {
                        two : {
                            meta : {
                                load : loadAsync("two", 16),
                            },
                        },
                    },
                },
            },
        });

        const service = interpret(testMachine);

        const states = trees(service);

        await states();
    });
});