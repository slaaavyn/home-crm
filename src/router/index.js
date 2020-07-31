import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'

import userRoles from '../utils/constants/userRoles'

Vue.use(VueRouter)

const ifNotAuthenticated = (to, from, next) => {
    if (!store.getters.isAuthenticated) {
        next();
        return;
    }
    next('/')
}

const ifAuthenticated = (to, from, next) => {
    if (store.getters.isAuthenticated) {
        next();
        return;
    }
    next('/login')
}

const ifAuthenticatedAsRoleAdmin = (to, from, next) => {
    if (store.getters.isAuthenticated && store.getters.getUser.role === userRoles.ROLE_ADMIN) {
        next();
        return;
    }
    next('/')
}

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        beforeEnter: ifAuthenticated,
        children: [
            {
                path: '/user',
                component: () => import('../views/user/UserList'),
                beforeEnter: ifAuthenticatedAsRoleAdmin
            },

            {
                path: '/user/:id',
                component: () => import('../views/user/UserProfile'),
                beforeEnter: ifAuthenticated
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        beforeEnter: ifNotAuthenticated
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
