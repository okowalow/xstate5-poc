import { assertEvent, fromPromise, sendParent, setup } from "xstate";

type ChildEvent = {
  type: "notify";
  message: string;
};
const machine2 = setup({
  types: {
    events: {} as
      | { type: "UPDATE" }
      | ChildEvent
      | { type: "xstate.invoke.done.fakePromise"; output: string },
  },
  actors: {
    fakePromise: fromPromise(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("done");
        }, 1000);
      });
    }),
  },
}).createMachine({
  id: "machine2",

  states: {
    idle: {
      on: {
        UPDATE: {
          target: "updating",
        },
      },
    },

    updating: {
      invoke: {
        src: "fakePromise",
        id: "fakePromise",
        onDone: {
          target: "idle",
          actions: sendParent(({ event }) => ({
            type: "notify",
            message: event.output.toUpperCase(),
          })),
        },
      },
    },
  },

  initial: "idle",
});

export const machine = setup({
  types: {
    events: {} as { type: "next" } | ChildEvent,
  },
  actors: {
    machine2,
  },
}).createMachine({
  id: "mainMachine",
  systemId: "mainMachine",
  initial: "First State",
  states: {
    "First State": {
      on: {
        next: "Second State",
      },
    },
    "Second State": {
      invoke: {
        systemId: "machine2",
        src: "machine2",
        id: "machine2",
      },
      on: {
        notify: {
          actions: ({ event }) => {
            console.log("hello from mainMachine", event.message);
          },
        },
      },
    },
  },
});
