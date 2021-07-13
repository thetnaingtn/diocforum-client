<template>
  <div class="thread">
    <div class="thread-toolbar">
      <div>
        <router-link to="/" custom v-slot="{ navigate }">
          <el-button
            style="margin-right: 1.25em"
            v-show="$route.name === 'Thread'"
            @click="navigate"
            @keypress.enter="navigate"
            role="link"
          >
            Back
          </el-button>
        </router-link>
        <span v-show="user.name">Logged in as {{ user.name }}</span>
      </div>
      <div>
        <template v-if="!user.name">
          <el-button
            v-if="!isSignup"
            @click="signupDialog = true"
            type="primary"
          >
            Sign up
          </el-button>
          <span v-else>
            You already signup please click login button to signin
          </span>
          <el-button @click="loginDialog = true"> Login </el-button>
        </template>
        <el-button
          v-show="user.name"
          @click="threadDialog = true"
          type="success"
        >
          Create New Thread
        </el-button>
        <el-button v-show="user.name" @click="logout" type="danger">
          Logout
        </el-button>
      </div>
    </div>
    <router-view></router-view>
  </div>
  <login-dialog v-model:loginDialog="loginDialog"></login-dialog>
  <signup-dialog v-model:signupDialog="signupDialog"></signup-dialog>
  <thread-dialog v-model:threadDialog="threadDialog"></thread-dialog>
</template>

<script>
import axios from "axios";

import { setUser, user } from "./composable/user";
import { isSignup } from "./composable/action";

import LoginDialog from "./components/LoginDialog.vue";
import SignupDialog from "./components/SignupDialog.vue";
import ThreadDialog from "./components/ThreadCreateDialog.vue";
export default {
  components: {
    LoginDialog,
    SignupDialog,
    ThreadDialog,
  },
  setup() {
    return {
      user,
      isSignup,
    };
  },
  data: () => ({
    url: import.meta.env.VITE_API_URL,
    signupDialog: false,
    threadDialog: false,
    loginDialog: false,
  }),
  methods: {
    logout() {
      axios
        .post(`${this.url}/api/logout`, {
          userId: this.user._id,
        })
        .then((_) => {
          setUser({});
        });
    },
  },
};
</script>

<style>
@import "./assets/css/reset.css";
*,
::before,
::after {
  box-sizing: border-box;
}

:root {
  font-size: 1rem;
}
body {
  font-family: "Roboto", sans-serif;
  background-color: #f4f4f4;
}
.thread-list__item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  padding: 1.43em;
}
.thread-list__item-left {
  display: flex;
  flex-direction: column;
}

.thread-list__item-right {
  align-self: stretch;
  padding-left: 1.43em;
  border-left: 1px solid #f4f4f4;
  margin-left: 1.43em;
}

.thread-list__item:not(:last-child) {
  border-bottom: 1px solid #f4f4f4;
}

.thread-list__item-left > * + * {
  margin-top: 0.625em;
}

.thread__title {
  font-size: 1.375rem;
  user-select: none;
  cursor: pointer;
}

.thread-date {
  font-size: 2.1875rem;
}

.thread-month {
  font-size: 1.25rem;
}

.thread {
  background-color: #fff;
  margin: 10vh auto;
  width: 80vw;
  min-height: 80vh;
}

.thread-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25em;
  border-bottom: 1px solid #f4f4f4;
}

.mb {
  margin-bottom: 1.43em;
}
</style>
