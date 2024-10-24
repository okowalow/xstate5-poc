<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";
import { useActor, useMachine } from "@xstate/vue";
import { createBrowserInspector } from "@statelyai/inspect";
import { machine } from "./machine";
import { computed, watch } from "vue";
import { createActor } from "xstate";

const { inspect } = createBrowserInspector();

const { actorRef, snapshot, send } = useActor(machine, {
  inspect,
});

// actor.system;
console.log("🚀 ~ actorRef.system:", actorRef.system);

// const { snapshot, send } = useMachine(machine, {
//   inspect,
// });
// const children = snapshot.value?.children;
// const machine2 = computed(() => {
//   const child = actor.getSnapshot().children;
//   console.log("🚀 ~ machine2 ~ actor.getSnapshot():", actor.getSnapshot());
//   if (
//     child &&
//     Object.keys(child).length > 0 &&
//     Object.keys(child)[0] === "machine2"
//   ) {
//     return child.machine2;
//   }
//   return null;
// });
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <button @click="send({ type: 'next' })">SEND</button>
      <button
        @click="() => snapshot.children?.machine2?.send?.({ type: 'UPDATE' })"
      >
        SEND from child
      </button>

      <!-- <HelloWorld msg="You did it!" /> -->
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
