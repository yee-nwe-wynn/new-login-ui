<template>
  <div id="app">
    <login-form-v2></login-form-v2>
  </div>
</template>

<script>
import LoginFormV2 from "./components/LoginFormV2.vue";
export default {
  name: "App",
  components: {
    LoginFormV2,
  },
  data() {
    return {
      nav: ["Home", "Products", "About Us"],
    };
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
