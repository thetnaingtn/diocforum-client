<template>
  <el-dialog :before-close="handleClose" width="40%" v-model="signupDialog">
    <el-input class="mb" placeholder="Email" v-model="email"></el-input>
    <el-input class="mb" placeholder="Name" v-model="name"></el-input>
    <el-input class="mb" placeholder="AvatarURL" v-model="avatarURL"></el-input>
    <el-input
      class="mb"
      placeholder="Password"
      v-model="password"
      type="password"
    >
    </el-input>
    <el-row justify="center">
      <el-col :span="4">
        <el-button @click="signupUser" type="success">Signup</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

import { setSignupState } from "../composable/action";

export default {
  props: {
    signupDialog: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:signupDialog"],
  setup() {
    let url = import.meta.env.VITE_API_URL;
    let email = ref("");
    let name = ref("");
    let avatarURL = ref("");
    let password = ref("");
    return {
      email,
      url,
      name,
      avatarURL,
      password,
    };
  },
  methods: {
    handleClose() {
      this.$emit("update:signupDialog", false);
    },
    signupUser() {
      axios
        .post(`${this.url}/api/signup`, {
          name: this.name,
          avatarURL: this.avatarURL,
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.email = "";
          this.password = "";
          this.name = "";
          this.avatarURL = "";
          setSignupState(true);
        })
        .finally(() => this.$emit("update:signupDialog", false));
    },
  },
};
</script>

<style scoped>
</style>