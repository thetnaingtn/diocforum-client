<template>
  <div class="thread-detail">
    <template v-if="thread">
      <div>
        <h1 class="thread__title">{{ thread.topic }}</h1>
        <p class="time">{{ thread.createdAt }}</p>
      </div>
      <div class="thread-post">
        <ul class="thread-post__list">
          <li class="thread-post__item" v-for="post in posts" :key="post._id">
            <div class="thread-post__item-avatar">
              <img class="thread__avatar" :src="post.avatarURL" />
            </div>
            <div class="thread-post__item-body">
              <p>{{ post.body }}</p>
              <div class="thread-body">
                <span>by {{ post.userName }}</span>
                <div
                  class="thread-post__item-body-action"
                  v-if="post.userId === user._id"
                >
                  <el-button
                    icon="el-icon-edit"
                    size="mini"
                    @click="dialogOpen(post)"
                    circle
                  >
                  </el-button>
                  <el-button
                    size="mini"
                    icon="el-icon-delete"
                    @click="deletePost(post)"
                    circle
                  >
                  </el-button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <el-input
        :disabled="!user.name"
        type="textarea"
        class="mb"
        placeholder="Write what in your mind..."
        v-model="body"
        :rows="8"
      ></el-input>
      <el-button :disabled="!user.name" @click="createPost" type="success">
        Create Post
      </el-button>
    </template>
    <no-content v-else>
      <p>
        There is no thread to show back to
        <router-link to="/" custom v-slot="{ navigate }">
          <strong @click="navigate" style="color: #efefef; cursor: pointer">
            home
          </strong>
        </router-link>
      </p>
    </no-content>
  </div>
  <el-dialog v-model="dialog">
    <el-input
      class="mb"
      v-model="editBody"
      placeholder="Write what in your mind..."
    >
    </el-input>
    <el-button type="success" @click="updatePost">Update Post</el-button>
  </el-dialog>
</template>

<script>
import axios from "axios";
import { ref, watchEffect } from "vue";

import { user } from "../composable/user";
import { getThread } from "../composable/thread";
import NoContent from "../components/NoContent.vue";

export default {
  components: {
    NoContent,
  },
  setup() {
    let url = import.meta.env.VITE_API_URL;
    let thread = ref(getThread());
    let body = ref("");
    let posts = ref([]);
    let action = ref("edit");
    let dialog = ref(false);
    let editBody = ref("");
    let post = ref({});

    watchEffect(() => {
      if (thread.value) {
        axios
          .get(`${url}/api/thread/read/${thread.value?._id}`)
          .then(({ data }) => {
            posts.value = data.posts || [];
          });
      }
    });
    return {
      thread,
      body,
      posts,
      dialog,
      post,
      editBody,
      url,
      user,
      action,
    };
  },
  methods: {
    createPost() {
      if (this.body.length == 0) return;
      axios
        .post(`${this.url}/api/post/new`, {
          body: this.body,
          threadId: this.thread._id,
          userId: this.user._id,
        })
        .then(({ data }) => {
          this.body = "";

          this.posts.push({
            ...data,
            avatarURL: this.user.avatarURL,
            userName: this.user.name,
          });
        });
    },
    dialogOpen(post) {
      this.editBody = post.body;
      this.dialog = true;
      this.post = post;
    },
    updatePost() {
      axios
        .put(`${this.url}/api/post/edit/${this.post._id}`, {
          userId: this.user._id,
          threadId: this.thread._id,
          body: this.editBody,
        })
        .then(({ data }) => {
          this.post.body = data.body;
          this.dialog = false;
          this.editBody = "";
        });
    },
    deletePost(post) {
      axios
        .delete(`${this.url}/api/post/delete/${post._id}`, {
          data: { userId: this.user._id },
        })
        .then((_) => {
          let newArr = this.posts.filter((p) => p.body !== post.body);
          this.posts = newArr;
        });
    },
  },
};
</script>

<style  scoped>
.thread__title--center {
  text-align: center;
}
.thread-detail {
  padding: 1.25em;
}

.thread-post {
  max-height: 400px;
  overflow-y: auto;
}

.thread-post__item {
  font-size: 1.125rem;
  padding: 1.25em;
  display: flex;
  align-items: flex-start;
}

.thread-post__item:not(:last-child) {
  border-bottom: 1px solid #f4f4f4;
}

.time {
  padding: 0.625em 0 0;
}

.thread-body {
  margin: 0.5em 0 0;
}

.thread__avatar {
  width: 3.125em;
  height: 3.125em;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 1.25em;
}

.thread-post__item-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.thread-post__item-body-action {
  display: inline-block;
  margin: 0 1.25em;
}
</style>