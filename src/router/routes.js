export default [
    {
        path: "/",
        name: "Home",
        component: () => import("../views/Home.vue")
    },
    {
        path: "/thread",
        name: "Thread",
        component: () => import("../views/Thread.vue")
    }
]
