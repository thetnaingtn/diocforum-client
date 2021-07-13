import { reactive } from "vue";

const state = reactive({
    threads: [],
    thread: {}
})

export function setThread(thread) {
    state.thread.value = thread;
}

export function getThread() {
    return state.thread.value
}

export function appendNewThread(thread) {
    state.threads.value.unshift(thread)
}

export function setThreads(threads) {
    state.threads.value = threads || [];
}

export function getAllThreads() {
    return state.threads.value || [];
}