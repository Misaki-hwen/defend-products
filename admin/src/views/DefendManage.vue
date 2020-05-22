<template>
<el-card header="个人防护用品管理 " class="card-box">
    <el-form ref="form" label-width="150px" label-position="left" :model="form">
        <el-form-item prop="uploadFile" :inline="false" label="附件上传区:">
            <el-upload 
            :on-preview="handlePictureCardPreview"
             action="" 
             :file-list="form.invioceFile" 
             :on-change='onChangeInvioce' 
             :auto-upload="false" 
             :on-remove="onRemoveInvoice">
                <el-button size="small" type="primary">采购发票（上传）</el-button>
                <div slot="tip" class="el-upload__tip">只能上传图片、pdf或word类型文件</div>
            </el-upload>
            <!-- <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog> -->
            <div class="el-form-item__error">{{approvalFileErr}}</div>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="表单填写区">
            <el-table :data="form.tableData" ref="table" border style="width: 100%">
                <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                <el-table-column label="车间" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.studio"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="用品名称" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.pname"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="型号" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.sku"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="数量" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.quantity"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="领取人" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMan"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="领取日期" width="250">
                    <template slot-scope="scope">
                        <div class="block">
                            <el-date-picker v-model="scope.row.date" type="datetime" placeholder="选择日期时间" size="large">
                            </el-date-picker>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="防护用品供应商单位" width="200">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.companyName"></el-input>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click.prevent="delData(scope.row)" type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
    </el-form>
    <div class="corss-line"></div>
    <div class="buttons">
        <el-button @click.prevent="additem()">新增</el-button>
        <el-button type="primary" @click.prevent="submitform">提交</el-button>
        <el-button type="warning">重置</el-button>
    </div>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            form: {
                // fdata: [],
                tableData: [],
                invioceFile:[]
            },
            fileList: [],
            approvalFileErr: '',
            oldApproval:[]
        }
    },
    methods: {
        handlePictureCardPreview(file) {
            let fileSplite = file.name.split('.')
            if (fileSplite[fileSplite.length - 1] === 'pdf') {
                let a = document.createElement('a')
                a.href = file.url
                a.target = '_blank'
                a.click()
            }else {
                this.dialogImageUrl = file.url
                this.dialogVisible = true
            }
        },
        onChangeInvioce(file, filelist) {
            console.log(file);
            this.fileList = filelist
            this.form.invioceFile = filelist
            console.log(this.form.invioceFile)
            if (file.raw.type === 'image/jpg' || file.raw.type === 'image/gif' || file.raw.type === 'image/bmp' || file.raw.type ===
                'image/jpeg' || file.raw.type === 'image/png' || file.raw.type === 'application/pdf') {
                this.approvalFileErr = ''
            } else {
                this.approvalFileErr = '请上传图片、pdf或word文件!'
            }
        },
        onRemoveInvoice(file, filelist) {
            this.form.uploadFile = filelist
            this.approvalFileErr = ''
            this.oldApproval.forEach((item, i) => {
                if (file.url.indexOf(item.staticName) !== -1) {
                    this.oldApproval.splice(i, 1)
                    this.editAndDeleteFiles.push(item)
                }
            })
        },
        // 增加行
        additem() {
            this.form.tableData.push({
                studio: '',
                pname: '',
                sku: '',
                quantity: '',
                date: '',
                receiveMan: '',
                companyName: '',
            });
        },
        delData(row) {
            console.log(row)
            this.$confirm(`确定是否要删除数据?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // this.tableData.splice(scope.$index,1)
                await this.$http.post('deletedefendproduct', {
                    _id: row._id
                })
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.fetch();
            })
        },
        async submitform() {
            let params = new FormData()
            params.append('formData',JSON.stringify(this.form.tableData))
            console.log(JSON.stringify(this.form.tableData))
            params.append('companyId','人生无极限有限公司')
            console.log(this.model)
            this.form.invioceFile.forEach((item,i)=>{
                item.raw && params.append('invoice'+i,item.raw)
            })
            //params.append('invoice',this.form.invioceFile[0].raw)
            let res = await this.$http.post('/upload', params)
            console.log(res)
            this.$message({
                type: 'success',
                message: '提交成功!'
            });
            this.fetch();
        },
        async fetch() {
            let res = await this.$http.get('/getdefendproduct')
            console.log(res.data.data)
            this.form.tableData = res.data.data.formData;
            this.form.invioceFile.push({name:'124',url:'http://localhost:7001/public/'+res.data.data.invoice})
            console.log(res)
        },
    },
    mounted() {
        this.fetch();
    },
}
</script>

<style>
.box-card {
    width: 90%;
    height: 100%;
    margin: 0 auto;
}

.font-small {
    font-size: 14px;
    color: rgb(200, 208, 214);
    margin: 0 auto;
    text-align: center;
}

.corss-line {
    margin-top: 30px;
    border: 1px solid rgb(200, 208, 214);
}

.buttons {
    margin-top: 30px;
    text-align: center;
}

.uploadImage {
    width: 90%;
}
</style>
