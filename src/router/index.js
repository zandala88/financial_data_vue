import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import CompanyList from "@/views/tabs/CompanyList.vue";
import StockMarket from "@/views/tabs/StockMarket.vue";
import FundMarket from "@/views/tabs/FundMarket.vue";
import FuturesData from "@/views/tabs/FuturesData.vue";
import Economics from "@/views/tabs/Economics.vue";
import UserProfile from '@/views/UserProfile.vue'
import MainPage from "@/views/MainPage.vue"; 
import AboutPage from '@/views/AboutPage.vue' 

const routes = [
  {
    path: "/",
    name: "Main",
    component: MainPage,
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: AboutPage // 添加新路由
  },
  {
    path: "/home/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "company",
        name: "CompanyList",
        component: CompanyList,
        meta: {
          keepAlive: true
        }
      },
      {
        path: "stock",
        name: "StockMarket",
        component: StockMarket,
      },
      {
        path: "fund",
        name: "FundMarket",
        component: FundMarket,
      },
      {
        path: "futures",
        name: "FuturesData",
        component: FuturesData,
      },
      {
        path: "economics",
        name: "Economics",
        component: Economics,
      }
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: '/stock/detail/:id',
    name: 'StockDetail',
    component: () => import('@/views/stock/Detail.vue')
  },
  {
    path: '/fund/detail/:id',
    name: 'FundDetail',
    component: () => import('@/views/fund/Detail.vue')
  },
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: UserProfile
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
