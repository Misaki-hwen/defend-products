<template>
    <div>
        <el-form>
            <el-form-item
                    v-for="role in roles"
                    :key="role._id"
                    :label="role.name">
                <el-select
                    v-model="item.value"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        options: [],
        value: [],
        list: [],
        loading: false,
        data:[],
        roles:[]
        
      }
    },
    mounted() {
      this.fetch();
      this.fetchRoles();
      this.fetchEmployee();
      
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },
      async fetch(){
        const res = await this.$http.get('/getmanage');
        this.data = res.data.data;
    },
      async fetchRoles(){
          const res = await this.$http.get('/get');
          this.roles = res.data.data
      },
      async fetchEmployee(){
          const res = await this.$http.get('getemployee')
          console.log(res);
          this.list = res.data.data.map(item => {
          return { value: item._id, label: item.name };
      });
      }
    }
  }
</script>

<style>
    el-select{
        display: block ;
    }
</style>