import { ref, computed } from "vue";

const signup = ref(false);

export function clear(...state) {
    state.forEach(s => {
        s.value = "";
    })
}

export const isSignup = computed(() => signup.value);

export function setSignupState(state) {
    signup.value = state;
}