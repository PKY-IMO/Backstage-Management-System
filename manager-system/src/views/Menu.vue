<template>
<div class="menu-manage">
    <div class="query-form">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" :value="1"></el-option>
            <el-option label="停用" :value="2"></el-option>
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
        <el-button type="primary" @click="handleDialog">创建</el-button>
      </div>
      <el-table :data="menuList"
        :tree-props="{children: 'children'}" 
        row-key="_id"
        style="width: 100%">
        <el-table-column 
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop" 
          :label="item.label" 
          :width="item.width"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button size="mini" @click="handleAdd(scope.row, scope.column, value)">新增</el-button>
            <el-button type="info" size="mini" @click="handleEdit(scope.row, scope.column, value)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogTableVisible" :title="title">
      <el-form :model="menuForm" ref="dialogForm" :rules="rules" label-width="80px" label-position="right">
        <el-form-item label="菜单名称" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          />
          &nbsp;&nbsp;
          <span> 不选，则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.icon" placeholder="请输入标识" />
        </el-form-item>
        <el-form-item
          label="路由地址"
          prop="path"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="menuCode"
          v-show="menuForm.menuType == 2"
        >
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item
          label="组件路径"
          prop="component"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item
          label="菜单状态"
          prop="menuState"
          v-show="menuForm.menuType == 1"
        >
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import util from '../utils/utils.js'
export default {
  name: "app",
  data() {
    return {
      queryForm: {
        menuState:''
      },
      menuList: [],
      columns:[{
        label: '菜单名称',
        prop: 'menuName',
        width: 120
      },{
        label: '图标',
        prop: 'icon'
      },{
        label: '菜单类型',
        prop: 'menuType',
        width: 90,
        formatter(row, column, value) {
          return {
            1: '菜单',
            2: '按钮'
          }[value]
        }
      },{
        label: '权限标识',
        prop: 'menuCode'
      },{
        label: '路由地址',
        prop: 'path'
      },{
        label: '组件路径',
        prop: 'component'
      },{
        label: '菜单状态',
        prop: 'menuState',
        width: 90,
        formatter(row, column, value) {
          return {
            1: '正常',
            2: '停用'
          }[value]
        }
      },{
        label: '创建时间',
        prop: 'createTime',
        formatter(row, column, value) {
          return util.formateDate(new Date(value))
        }
      }],
      dialogTableVisible: false,
      title: '菜单',
      menuForm: {
        parentId: [null],
        menuType: 1,
        menuState: 1
      },
      ation: '',
      rules: {
        menuName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 8,
            message: "长度在2-8个字符",
            trigger: "blur",
          },
        ]
      }
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    async getMenuList() {
      try {
        let list = await this.$api.getMenuList(this.queryForm)
        this.menuList = list
      } catch (error) {
        throw new Error(error)
      }
    },
    handleQuery() {
      this.getMenuList()
    },
    handelReset(form) {
      this.$refs[form].resetFields()
    },
    handleDialog() {
      this.title = '创建菜单'
      this.action = 'create'
      this.dialogTableVisible = true
    },
    handleClose() {
      this.dialogTableVisible = false
      this.handelReset('dialogForm')
    },
    handleAdd(row, column, value) {
      this.title = '新增子菜单'
      this.action = 'create'
      this.dialogTableVisible = true
      this.menuForm.parentId = [...row.parentId, row._id].filter(item => item)
    },
    handleEdit(row, column, value) {
      this.title = '编辑菜单'
      this.action = 'edit'
      this.dialogTableVisible = true
      this.$nextTick(() => {
        Object.assign(this.menuForm, row)
      })
    },
    async handleDel(_id) {
      await this.$api.menuSubmit({_id, action: 'delete' })
      this.$message.success('删除成功')
      this.getMenuList()
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { action, menuForm } = this
          let parmas = {...menuForm, action}
          await this.$api.menuSubmit(parmas)
          this.dialogTableVisible = false
          this.$message.success('操作成功')
          this.handelReset('dialogForm')
          this.getMenuList()
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
