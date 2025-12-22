<template>
  <div>
    <h1>{{ welcome_message }}</h1>
    <p>Counter: {{ counter }}</p>
    <button v-on:click="increment">Add one</button>

    <p v-if="counter >= 5">Big numer</p>
    <p v-else>Little number</p>

    <Login />
    <ToDoList />

  </div>
</template>

<script>
  import Login from "./Login.vue"
  import ToDoList from "./ToDoList.vue"

  export default {
    data(){
      return {
        welcome_message: "Hello World!",
        counter: 0
      }
    },
    methods: {
      increment(){
        this.counter ++;
      }
    },
    components: {
      Login,
      ToDoList
    }
  }
</script>

<style scoped></style>