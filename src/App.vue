<script setup>
import { computed, ref } from 'vue'

import { solve } from './eq'

const input = ref("")
const left = ref()
const right = ref()

const stepsOpened = ref(false)

const parsedInput = computed(() => {
  return input.value.
    replaceAll('pi', 'PI').
    replaceAll('e', 'E').
    replaceAll('arcsin', 'asin').
    replaceAll('arccos', 'acos').
    replaceAll('arctg', 'atan').
    replaceAll('tg', 'tan').
    replaceAll('ctg', 'cot').
    replaceAll('log', 'logn').
    replaceAll('ln', 'log')
})

const result = computed(() => {
  if(input === "" || left.value === undefined || right.value === undefined) {
    return null
  }
  try {
    const res = solve(
      parsedInput.value,
      left.value,
      right.value,
    )
    return res
  } catch(e) {
    return e
  }
})

</script>

<template>
  <main class="p-2 flex items-center justify-center min-h-[100dvh]">
    <div class="flex flex-col items-center gap-3">
      <h1 class="text-4xl">Rešavanje jednačina Njutnovom metodom</h1>
      <div class="flex flex-col items-center">
        <h2 class="flex items-center gap-3">
          <input
            v-model="input"
            type="text"
            class="border-black border focus:border-blue-500 outline-none rounded p-3 text-lg"
            placeholder="g(x)"
          >
          <span class="text-3xl">= 0</span>
          <span class="text-3xl flex items-center gap-2">na segmentu
            [
            <input
              v-model="left"
              type="number"
              placeholder="a"
              class="border-black border focus:border-blue-500 outline-none rounded p-3 text-lg w-24"
            >
            ,
            <input
              v-model="right"
              type="number"
              placeholder="b"
              class="border-black border focus:border-blue-500 outline-none rounded p-3 text-lg w-24"
            >
            ]
          </span>
        </h2>
      </div>
      <template v-if="result && !(result instanceof Error)">
        <h3 class="text-3xl flex items-center gap-3">
          <span>
            Rešenje je <span class="text-blue-500">{{ result?.solution?.toFixed(6) }}</span> 
          </span>
          <button
            @click="stepsOpened = true"
            class="px-3 py-2 border-solid border-black border hover:border-blue-500 hover:text-blue-500 rounded-lg transition-all"
          >
            ->
          </button>
        </h3>
      </template>
      <template v-else>
        {{ result }}
      </template>
    </div>
  </main>
  <Teleport v-if="stepsOpened" to="body">
    <div class="fixed left-0 top-0 w-full h-[100dvh] py-5 overflow-auto bg-white">
      <div class="max-w-[1000px] m-auto">
        <div class="grid grid-cols-5 gap-3">
        <button
          class="py-3 border border-solid border-red-500 rounded-lg text-red-500 text-center hover:bg-red-500 hover:text-white transition-colors"
          @click="stepsOpened = false"
        >
          zatvori
        </button>
        <div class="py-3 border border-solid border-black rounded-lg text-center font-bold">x <sub>n-1</sub></div>
        <div class="py-3 border border-solid border-black rounded-lg text-center font-bold">x <sub>n</sub></div>
        <div class="py-3 border border-solid border-black rounded-lg text-center font-bold">g(x <sub>n</sub>)</div>
        <div class="py-3 border border-solid border-black rounded-lg text-center font-bold">| x <sub>n</sub> - x <sub>n-1</sub> |</div>
        <template v-for="step, index in result.steps">
          <div class="py-3 border border-solid border-black text-center rounded-lg">n = {{ index + 1 }}</div>
          <div class="py-3 border border-solid border-black text-center rounded-lg">{{ step.prev.toFixed(6) }}</div>
          <div class="py-3 border border-solid border-black text-center rounded-lg">{{ step.current.toFixed(6) }}</div>
          <div class="py-3 border border-solid border-black text-center rounded-lg">{{ step.currentF.toFixed(6)}}</div>
          <div class="py-3 border border-solid border-black text-center rounded-lg">{{ step.delta.toFixed(6) }}</div>
        </template>
      </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>