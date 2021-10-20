<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :model="user" :inline="true">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="user.state">
            <el-option label="所有" :value="0"></el-option>
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
            <el-option label="试用期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleDialog" v-has="'user-create'">新增</el-button>
        <el-button type="danger" @click="handlePatchDel" v-has="'user-patch-delete'">批量删除</el-button>
      </div>
      <el-table :data="userList" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" ></el-table-column>
        <el-table-column 
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop" 
          :label="item.label" 
          :width="item.width"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row, scope.column, value)" v-has="'user-edit'
            ">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row, scope.column, value)" v-has="'user-delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        :total="pager.total"
        :page-size="pager.pageSize"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="dialogTableVisible" :title="title">
      <el-form :model="newUser" ref="newUserForm" :rules="addUserRules" label-width="80px" label-position="right">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="newUser.userName" :disabled="action === 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="newUser.userEmail" :disabled="action === 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="newUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="newUser.job"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="newUser.state">
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
            <el-option label="试用期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select v-model="newUser.roleList" multiple style="width: 100%">
            <el-option 
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-cascader
            v-model="newUser.deptId"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%">
          </el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetDialog('newUserForm')">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref, getCurrentInstance, toRaw} from 'vue'
import utils from '@/utils/utils.js'
export default {
  name: 'user',
  setup () {
    const { proxy } = getCurrentInstance()
    // 查询用户
    const user = reactive({
      state: 1
    })
    // 表单标题
    const columns = ref([
      {
        label: '用户ID',
        prop: 'userId'
      },
      {
        label: '用户名',
        prop: 'userName',
        width: 180
      },
      {
        label: '用户邮箱',
        prop: 'userEmail',
        width: 180
      },
      {
        label: '用户角色',
        prop: 'role',
        formatter(_, __, val) {
          return {
            0: '管理员',
            1: '普通用户'
          }[val]
        }
      },
      {
        label: '用户状态',
        prop: 'state',
        formatter(_, __, val) {
          return {
            1: '在职',
            2: '离职',
            3: '试用期'
          }[val]
        }
      },
      {
        label: '注册时间',
        prop: 'createTime',
        width: '160px',
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        }
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
        width: '160px',
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        }
      }
    ])
    // 用户数据
    const userList = ref([])
    // 部门列表
    const deptList = ref([])
    // 角色列表
    const roleList = ref([])
    // 分页插件
    const pager = reactive({
      pageNum: 1,
      pageSize: 10
    })
    // 删除用户id
    const delUserIds = ref([])
    // 新增表单的显示
    const dialogTableVisible = ref(false)
    // 新增用户
    const newUser = reactive({})
    // 新增用户表单校验
    const addUserRules = {
      userName: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        }
      ],
      userEmail: [
        {
          required: true,
          message: '请输入邮箱',
          trigger: 'blur',
        }
      ],
      mobile: [
        {
          required: true,
          message: '请输入手机号',
          trigger: 'blur',
        },
        {
          pattern: /1\d{10}/,
          message: '请输入正确的手机号',
          trigger: 'blur'
        }
      ],
      deptId: [
        {
          required: true,
          message: '请选择部门',
          trigger: 'blur',
        }
      ]
    }
    // 创建/新增
    const action = ref('add')
    // 表单标题
    const title = ref('用户新增')

    onMounted(() => {
      getUserList()
      getDeptList()
      getRoleList()
    }) 

    // 获取用户列表
    const getUserList = async () => {
      // 条件
      let params = {...user, ...pager}
      const { list, page } = await proxy.$api.getUserList(params)
      userList.value = list
      pager.total = page.total
    }
    // 获取部门列表
    const getDeptList = async () => {
      deptList.value = await proxy.$api.getDeptList()
    }
    // 获取角色列表
    const getRoleList = async () => {
      const { list } = await proxy.$api.getRoleList()
      roleList.value = list
    }
    // 查询事件，获取用户列表
    const handleQuery = () => {
      getUserList()
    }

    // 重置查询表单 需要绑定prop属性
    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
    }

    // 删除单个用户
    const handleDel = async (row, column, value) => {
      delUserIds.value = [row.userId]
      const params = {
        userIds: delUserIds.value
      }
      if (delUserIds.value.length <= 0) return
      const { modifiedCount } = await proxy.$api.deleteUser(params)
      if (modifiedCount >= 1) {
        proxy.$message.success(`成功删除${modifiedCount}个用户`)
        getUserList()
      } else {
        proxy.$message.error(`删除失败`)
      }
    }

    // 批量删除用户
    const handlePatchDel = async () => {
      if (delUserIds.value.length <= 0) {
        proxy.$message.info(`请选择需要删除的用户`)
        return
      }
      const params = {
        userIds: delUserIds.value
      }
      const { modifiedCount } = await proxy.$api.deleteUser(params)
      if (modifiedCount >= 1) {
        proxy.$message.success(`成功删除${modifiedCount}个用户`)
        getUserList()
      } else {
        proxy.$message.error(`删除失败`)
      }
    }

    // 多选框选择用户
    const handleSelectionChange = (val) => {
      // console.log(val) 一个数组
      delUserIds.value = val.map(item => item.userId)
    }

    // 分页
    const handleCurrentChange = (cur) => {
      pager.pageNum = cur
      getUserList()
    }

    // 显示新增表单
    const handleDialog = () => {
      action.value = 'add'
      title.value = '用户新增'
      dialogTableVisible.value = true
    }

    // 重置新增表单
    const resetDialog = (form) => {
      handleReset(form)
      dialogTableVisible.value = false
    }

    // 表单
    const handleSubmit = () => {
      proxy.$refs.newUserForm.validate(async (valid) => {
        if (valid) {
          let params = toRaw(newUser)
          params.action = action.value
          let res = await proxy.$api.operateUser(params)
          console.log(res)
          if (res) {
            dialogTableVisible.value = false
            proxy.$message.success(`用户${action.value === 'add' ? '添加' : '编辑'}成功`)
            handleReset("newUserForm")
            getUserList()
          }
        }
      })
    }

    // 编辑用户
    const handleEdit = (row, column, value) => {
      action.value = 'edit'
      title.value = '用户编辑'
      dialogTableVisible.value = true
      proxy.$nextTick(() => {
        Object.assign(newUser, row)
      })
    }

    return {
      user,
      columns,
      userList,
      deptList,
      roleList,
      handleQuery,
      handleReset,
      handleDel,
      handlePatchDel,
      handleSelectionChange,
      pager,
      handleCurrentChange,
      dialogTableVisible,
      handleDialog,
      newUser,
      addUserRules,
      resetDialog,
      getDeptList,
      getRoleList,
      handleSubmit,
      action,
      title,
      handleEdit
    }
  }
}
</script>

<style>
  .user-manage {
    background-color: #eef0f3;
  }
</style>