/**
 * * PRZYKŁAD Z sendParent (tak sobie z Typescript)
 */
import { assertEvent, fromPromise, sendParent, setup } from "xstate";

type ChildEvent = {
  type: "notify";
  message: string;
};
const machine2 = setup({
  types: {
    events: {} as { type: "UPDATE" } | ChildEvent,
  },
  actions: {
    sendParent: sendParent({ type: "notify", message: 234 }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgCYA6bCAGzAGIBVABQBEBBAFQFEBtABgF1FQAHAPaxsAF2yDcfEAA9EARgIBWIkoA0IAJ6IAHJ1UBfIxtyCIcaWix5C0oSPGTpchAFoAbBu1v3xkFZx8YlIKO2ExCSkkWUQAFgIvXXk-AJtiAFd+CFRRSDCHSOdEAliAdiIATgqCeR1S9S0koyMgA */
  id: "machine2",

  states: {
    idle: {
      on: {
        UPDATE: {
          target: "updated",
          // actions: sendParent(() => {
          //   return { type: "notify", message: "hello from machine2" };
          // }),

          // actions: "sendParent",
        },
      },
    },

    updated: {
      // write a fake fromPromise
      invoke: {
        src: fromPromise(
          () =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve("done");
              }, 1000);
            })
        ),
        onDone: {
          target: "idle",
          actions: sendParent({ type: "notify", message: "done" }),
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
  /** @xstate-layout N4IgpgJg5mDOIC5QFUB2AXAlugNpAdAGKYBOs6ABAMroCG6YAxKmAB7oDaADALqKgAHAPaxsmIan4hWiAIwB2LvgAcANnkAmLrNUBOAMy7NOgDQgAnomWz8AVgC+js6iEQ4UtFlyQpw0VgkpGQQAWlUzS1DVJxBPbDwIIlJyajoGXxExQKRpRAAWDQirG11S0vlZZX1lLlsCmLjvRKowAGMJCFT6MAz-cUkc4I1VWxVlDXHVPUNjcIti-DLyyura+sd7IA */
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
            // assertEvent(event, "notify");
            console.log("hello from mainMachine", event.message);
          },
        },
      },
    },
  },
});

/**
 * PRZYKŁAD Z sendTo
 */

// import { createActor, log, sendTo, setup } from "xstate";
// import type { ActorRef, Snapshot } from "xstate";

// type ChildEvent = {
//   type: "tellParentSomething";
//   data?: string;
// };
// type ParentActor = ActorRef<Snapshot<unknown>, ChildEvent>;

// const machine2 = setup({
//   types: {
//     context: {} as {
//       parentRef: ParentActor;
//     },
//     input: {} as {
//       parentRef: ParentActor;
//     },
//   },
// }).createMachine({
//   /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgCYA6bCAGzAGIBVABQBEBBAFQFEBtABgF1FQAHAPaxsAF2yDcfEAA9EARgIBWIkoA0IAJ6IAHJ1UBfIxtyCIcaWix5C0oSPGTpchAFoAbBu1v3xkFZx8YlIKO2ExCSkkWUQAFgIvXXk-AJtiAFd+CFRRSDCHSOdEAliAdiIATgqCeR1S9S0koyMgA */
//   id: "machine2",
//   context: ({ input: { parentRef } }) => ({ parentRef }),

//   states: {
//     idle: {
//       on: {
//         UPDATE: {
//           target: "updated",
//           actions: sendTo(({ context }) => context.parentRef, {
//             type: "tellParentSomething",
//             data: "Hi parent!",
//           }),
//         },
//       },
//     },

//     updated: {},
//   },

//   initial: "idle",
// });

// export const machine = setup({
//   types: {
//     events: {} as { type: "next" } | ChildEvent,
//   },
//   actors: {
//     machine2,
//   },
// }).createMachine({
//   /** @xstate-layout N4IgpgJg5mDOIC5QFUB2AXAlugNpAdAGKYBOs6ABAMroCG6YAxKmAB7oDaADALqKgAHAPaxsmIan4hWiAIwB2LvgAcANnkAmLrNUBOAMy7NOgDQgAnomWz8AVgC+js6iEQ4UtFlyQpw0VgkpGQQAWlUzS1DVJxBPbDwIIlJyajoGXxExQKRpRAAWDQirG11S0vlZZX1lLlsCmLjvRKowAGMJCFT6MAz-cUkc4I1VWxVlDXHVPUNjcIti-DLyyura+sd7IA */
//   id: "mainMachine",
//   initial: "First State",
//   states: {
//     "First State": {
//       on: {
//         next: "Second State",
//       },
//     },
//     "Second State": {
//       invoke: {
//         input: ({ self }) => {
//           return {
//             parentRef: self,
//           };
//         },
//         src: "machine2",
//         id: "machine2",
//       },
//       on: {
//         tellParentSomething: {
//           actions: log(({ event: { data } }) => `Child actor says "${data}"`),
//         },
//       },
//     },
//   },
// });

/**
 * ROZKMINA Z SYSTEMAMI - chodzi że system jest dla actorów nie w relacji rodzic-dziecko.
 */

// import { assertEvent, sendParent, sendTo, setup } from "xstate";

// type ChildEvent = {
//   type: "notify";
//   message: string;
// };
// const machine2 = setup({
//   types: {
//     events: {} as { type: "UPDATE" } | ChildEvent,
//   },
// }).createMachine({
//   /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgCYA6bCAGzAGIBVABQBEBBAFQFEBtABgF1FQAHAPaxsAF2yDcfEAA9EARgIBWIkoA0IAJ6IAHJ1UBfIxtyCIcaWix5C0oSPGTpchAFoAbBu1v3xkFZx8YlIKO2ExCSkkWUQAFgIvXXk-AJtiAFd+CFRRSDCHSOdEAliAdiIATgqCeR1S9S0koyMgA */
//   id: "machine2",

//   states: {
//     idle: {
//       on: {
//         UPDATE: {
//           target: "updated",
//           actions: sendTo(
//             ({ system }) => {
//               console.log("system", system);
//               return system.get("machine2FromMainMachine");
//             },
//             {
//               type: "notify",
//               message: "Form submitted!",
//             }
//           ),
//         },
//       },
//     },

//     updated: {},
//   },

//   initial: "idle",
// });

// export const machine = setup({
//   types: {
//     events: {} as { type: "next" } | ChildEvent,
//   },
//   actors: {
//     machine2,
//   },
// }).createMachine({
//   /** @xstate-layout N4IgpgJg5mDOIC5QFUB2AXAlugNpAdAGKYBOs6ABAMroCG6YAxKmAB7oDaADALqKgAHAPaxsmIan4hWiAIwB2LvgAcANnkAmLrNUBOAMy7NOgDQgAnomWz8AVgC+js6iEQ4UtFlyQpw0VgkpGQQAWlUzS1DVJxBPbDwIIlJyajoGXxExQKRpRAAWDQirG11S0vlZZX1lLlsCmLjvRKowAGMJCFT6MAz-cUkc4I1VWxVlDXHVPUNjcIti-DLyyura+sd7IA */
//   id: "mainMachine",
//   systemId: "systemMainMachine",
//   initial: "First State",
//   states: {
//     "First State": {
//       on: {
//         next: "Second State",
//       },
//     },
//     "Second State": {
//       invoke: {
//         systemId: "machine2FromMainMachine",
//         src: "machine2",
//         id: "machine2",
//       },
//       on: {
//         notify: {
//           actions: ({ event }) => {
//             // assertEvent(event, "notify");
//             console.log("hello from mainMachine", event.message);
//           },
//         },
//       },
//     },
//   },
// });
