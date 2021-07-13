<template>
  <div class="thread-list">
    <template v-if="!loading">
      <div
        v-for="thread in allThreads"
        :key="thread._id"
        class="thread-list__item"
      >
        <div class="thread-list__item-left">
          <span class="thread-date">{{ thread.createdAt.split(" ")[0] }}</span>
          <span class="thread-month">
            {{
              `${thread.createdAt.split(" ")[1]}, 
                ${thread.createdAt.split(" ")[2]}`
            }}
          </span>
          <span class="thread-time"
            >at {{ thread.createdAt.split(" ")[3] }}</span
          >
        </div>
        <div class="thread-list__item-right">
          <h1 class="thread__title" @click="goToThread(thread)" role="link">
            {{ thread.topic }}
          </h1>
          <div class="thread-post__last-visit">
            <p class="thread-post__info">
              by {{ thread.userName }} at {{ thread.createdAt }}
              <template v-if="thread.userId === user._id">
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  @click="openDialog(thread)"
                  circle
                >
                </el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteThread(thread)"
                  circle
                >
                </el-button>
              </template>
            </p>
            <el-row style="margin-top: 1em" align="middle">
              <img
                class="thread-post__avatars"
                v-for="post in thread.posts"
                :src="post.avatarURL"
                :key="post._id"
              />
              <span style="margin-left: 1em" v-show="thread.other"
                >and {{ thread.other }} others</span
              >
            </el-row>
          </div>
        </div>
      </div>
      <no-content v-if="!allThreads.length">
        <p>There is no thread to show</p>
      </no-content>
    </template>
  </div>

  <el-dialog v-model="threadDialog" width="40%">
    <el-input
      ref="editinput"
      class="mb"
      placeholder="Topic"
      v-model="editTopic"
    ></el-input>
    <el-row justify="center">
      <el-col :span="4">
        <el-button @click="editThread" type="success">Update Thread</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import axios from "axios";
import { computed } from "vue";
import { format, parseISO } from "date-fns";

import { setThread, getAllThreads, setThreads } from "../composable/thread";
import { user } from "../composable/user";

import NoContent from "../components/NoContent.vue";

export default {
  components: {
    NoContent,
  },
  setup() {
    let allThreads = computed(() => {
      return getAllThreads()?.map((thread) => ({
        ...thread,
        posts: thread.posts?.slice(0, 4),
        createdAt: format(parseISO(thread.createdAt), "dd MMM yyyy k:mm"),
        other: thread.posts?.length > 4 ? thread.posts?.length - 4 : "",
      }));
    });
    return {
      user,
      allThreads,
    };
  },
  data: () => ({
    threadDialog: false,
    editTopic: "",
    loading: false,
    url: import.meta.env.VITE_API_URL,
    thread: {},
  }),
  created() {
    this.loading = true;
    axios.get(`${this.url}/api/thread`).then(({ data: threads }) => {
      this.loading = false;
      setThreads(threads);
    });
  },
  methods: {
    goToThread(thread) {
      setThread(thread);
      this.$router.push({ name: "Thread" });
    },
    openDialog(thread) {
      this.threadDialog = true;
      this.thread = thread;
      this.editTopic = thread.topic;
      this.$nextTick().then((_) => this.$refs.editinput.focus());
    },
    editThread() {
      axios
        .put(`${this.url}/api/thread/edit/${this.thread._id}`, {
          userId: this.user._id,
          topic: this.editTopic,
        })
        .then(({ data }) => {
          this.threadDialog = false;
          this.thread.topic = data.topic;
        });
    },
    deleteThread(thread) {
      axios
        .delete(`${this.url}/api/thread/delete/${thread._id}`, {
          data: {
            userId: this.user._id,
          },
        })
        .then((_) => {
          let threads = getAllThreads();
          setThreads(threads.filter((t) => t._id !== thread._id));
        });
    },
  },
};
</script>

<style scoped>
.thread-post__info {
  margin-top: 0.875em;
}
.thread-post__avatars {
  border-radius: 50%;
  object-fit: cover;
  margin: 0 -0.9375em 0 0;
  width: 2.8125em;
  height: 2.8125em;
  box-sizing: content-box;
  border: 2px solid #fff;
}
</style>