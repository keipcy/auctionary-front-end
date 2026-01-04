import { createRouter, createWebHistory } from 'vue-router'

import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import ItemDetail from "../views/ItemDetail.vue"
import PostItem from "../views/PostItem.vue"

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login},
    { path: "/item/:id", component: ItemDetail},
    { path: "/post", component: PostItem}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;