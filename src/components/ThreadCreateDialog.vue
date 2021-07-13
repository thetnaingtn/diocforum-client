<template>
  <el-dialog :before-close="handleClose" width="40%" v-model="threadDialog">
    <el-input class="mb" placeholder="Topic" v-model="topic"></el-input>
    <el-row justify="center">
      <el-col :span="4">
        <el-button @click="createThread" type="success">
          Create Thread
        </el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { user } from "../composable/user";
import { appendNewThread } from "../composable/thread";
import axios from "axios";
import { ref } from "vue";
export default {
  props: {
    threadDialog: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:threadDialog"],
  setup() {
    let topic = ref("");
    let url = import.meta.env.VITE_API_URL;
    return {
      user,
      url,
      topic,
    };
  },
  methods: {
    handleClose() {
      this.$emit("update:threadDialog", false);
    },
    createThread() {
      axios
        .post(`${this.url}/api/thread/new`, {
          topic: this.topic,
          userId: this.user._id,
        })
        .then(({ data }) => {
          appendNewThread({ ...data, userName: this.user.name });
          this.topic = "";
        })
        .catch((err) => console.log(err))
        .finally(() => this.$emit("update:threadDialog", false));
    },
  },
};
</script>

<style scoped>
</style>