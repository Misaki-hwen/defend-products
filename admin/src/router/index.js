import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import EditRole from '../views/EditRole.vue'
import RoleList from '../views/RoleList.vue'
import Employees from '../views/Employees.vue'
import EditEmployees from '../views/EditEmployees.vue'
import Manage from '../views/Manage.vue'
import ManageList from '../views/ManageList.vue'
import List from '../views/List.vue'
import DefendManage from '../views/DefendManage.vue'




Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[
      { path: '/role/create', component: EditRole},
      { path: '/role/edit/:id', component: EditRole, props:true },
      { path: '/role/list', component: RoleList},
      
      { path: '/role/createemployees', component: EditEmployees},
      { path: '/role/createemployees/:id', component: EditEmployees, props:true },
      { path: '/role/employees', component: Employees},

      { path: '/role/manage', component: Manage},
      { path: '/role/manage/:id', component: Manage, props:true },
      { path: '/role/managelist', component: ManageList},
    
      { path: '/role/save', component: List},
    ]
  },
  {
    path:'/defend',
    name:'DefendManage',
    component:DefendManage
  }
]

const router = new VueRouter({
  routes
})

export default router
