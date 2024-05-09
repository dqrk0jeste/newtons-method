// @ts-ignore
import evaluatex from 'evaluatex'

const ERROR = 0.000001

type Step = {
  prev: number,
  current: number,
  currentF: number,
  delta: number,
}

type solveReturn = {
  solution: number,
  steps: Step[],
}

function absoluteFunctionMaximum(f: (x: number) => number, a: number, b: number): number {
  let i = a
  let m = -Infinity
  while(i <= b) {
    const absoluteFunctionValue = Math.abs(f(i))
    if(absoluteFunctionValue > m) {
      m = absoluteFunctionValue
    }
      i += 0.1
  }
  return m
}

function absoluteFunctionMinimum(f: (x: number) => number, a: number, b: number): number {
  let i = a
  let m = Infinity
  while(i <= b) {
    const absoluteFunctionValue = Math.abs(f(i))
    if(absoluteFunctionValue < m) {
      m = absoluteFunctionValue
    }
      i += 0.1
  }
  return m
}

function isMonotoneFunction(f: (x: number) => number, a: number, b: number) {
  return isIncreasing(f, a, b) || isDecreasing(f, a, b)
}

function isIncreasing(f: (x: number) => number, a: number, b: number) {
  let i = a
  let prev = f(a)
  while(i <= b) {
    if(f(i) < prev) {
      return false
    }
    i += 0.1
  }
  return true
}

function isDecreasing(f: (x: number) => number, a: number, b: number) {
  let i = a
  let prev = f(a)
  while(i <= b) {
    if(f(i) > prev) {
      return false
    }
    i += 0.1
  }
  return true
}

export function solve(
  eq: string,
  left: number,
  right: number,
) : solveReturn {

  function f(x: number): number {
    return evaluatex(eq)({ x })
  }

  function derivative(x: number) {
    const d = 0.000001
    return (f(x + d) - f(x)) / d
  }

  function secondDerivative(x: number) {
    const d = 0.000001
    return (derivative(x + d) - derivative(x)) / d
  }

  if(f(left) === left) {
    return {
      solution: left,
      steps: []
    }
  }
  
  if(f(right) === right) {
    return {
      solution: right,
      steps: []
    }
  }

  if(f(left) * f(right) > 0) {
    throw new Error('Možda nema rešenja.')
  }
  if(!isMonotoneFunction(f, left, right)) {
    throw new Error('Funkcija nije monotona.')
  }
  if(!isMonotoneFunction(derivative, left, right)) {
    throw new Error('Izvod funkcije nije monoton.')
  }

  const m1 = absoluteFunctionMinimum(derivative, left, right)
  const M2 = absoluteFunctionMaximum(secondDerivative, left, right)

  const criteria = Math.sqrt(2*m1*ERROR / M2)

  let prev: number
  if(f(left) * secondDerivative(left) > 0) {
    prev = left
  } else {
    prev = right
  }
  let current = prev - f(prev) / derivative(prev)

  const steps = [] as Step[]
  steps.push({
    prev,
    current,
    currentF: f(current),
    delta: Math.abs(current - prev),
  })

  while(Math.abs(current - prev) > criteria) {
    prev = current
    current = prev - f(prev) / derivative(prev)
    steps.push({
      prev,
      current,
      currentF: f(current),
      delta: Math.abs(current - prev),
    })
  }

  return {
    solution: current,
    steps,
  }
}





