<template>
  <el-dialog width="40%" :before-close="handleClose" v-model="loginDialog">
    <el-input class="mb" placeholder="Email" v-model="email"></el-input>
    <el-input
      class="mb"
      placeholder="Password"
      v-model="password"
      type="password"
    >
    </el-input>
    <el-row justify="center">
      <el-col :span="4">
        <el-button @click="login" type="success">Login</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

import { setUser } from "../composable/user";
import { setSignupState, clear } from "../composable/action";
export default {
  props: {
    loginDialog: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    let password = ref("");
    let email = ref("");
    let url = import.meta.env.VITE_API_URL;
    return {
      password,
      email,
      url,
    };
  },
  emits: ["update:loginDialog"],
  methods: {
    handleClose() {
      this.$emit("update:loginDialog", false);
    },
    login() {
      axios
        .post(`${this.url}/api/login`, {
          email: this.email,
          password: this.password,
        })
        .then(({ data }) => {
          this.password = "";
          this.email = "";
          setSignupState(false);
          setUser(data);
        })
        .catch((err) => console.log(err))
        .finally(() => this.$emit("update:loginDialog", false));
    },
  },
};
</script>

<style scoped>
</style>