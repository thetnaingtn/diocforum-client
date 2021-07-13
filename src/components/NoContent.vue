<template>
  <div class="no-content">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.no-content {
  margin: 0 auto;
  text-align: center;
  font-weight: 500;
  font-size: 2.5rem;
  padding: 2.5em;
  color: #f4f4f4;
}
</style>