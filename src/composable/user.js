import { computed, ref } from 'vue';

const USER = ref("{}");

export const user = computed(() => {
    USER.value = localStorage.getItem("_auth");
    return JSON.parse(USER.value || "{}");
})

export function setUser(user) {
    let _auth = typeof user === "object" ? JSON.stringify(user) : user;
    localStorage.setItem("_auth", _auth);
    USER.value = _auth;
}

