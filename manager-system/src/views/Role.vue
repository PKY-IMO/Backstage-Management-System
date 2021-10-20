<template>
<div class="role-manage">
    <div class="query-form">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery" v-has="'role-query'">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate" v-has="'role-create'">创建</el-button>
      </div>
      <el-table :data="roleList">
        <el-table-column 
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop" 
          :label="item.label" 
          :width="item.width"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row, scope.column, value)" v-has="'role-edit'">编辑</el-button>
            <el-button size="mini" @click="handleOpenPermission(scope.row)" v-has="'role-permission'">设置权限</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row._id)" v-has="'role-delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="showModal" :title="title">
      <el-form 
        :model="roleForm" 
        ref="dialogForm" 
        :rules="rules" 
        label-width="100px" 
        label-position="right">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            v-model="roleForm.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 权限弹框-->
    <el-dialog title="权限设置" v-model="showPermission">
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="tree"
            :data="menuList"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取 消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">确 定</el-button>
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
        roleName: ''
      },
      roleList: [],
      roleForm: {},
      // 菜单映射表
      actionMap: {},
      columns:[{
        label: '角色名称',
        prop: 'roleName'
      },{
        label: '备注',
        prop: 'remark'
      },{
        label: '权限列表',
        prop: 'permissionList',
        formatter: (row, column, value) => {
          let names = []
          let list = value.halfCheckedKeys || []
          list.map((key) => {
            let name = this.actionMap[key]
            if (key && name) names.push(name)
          })
          return names.join(",");
        }
      },
      {
        label: '更新时间',
        prop: 'updateTime',
        formatter(row, column, value) {
          return util.formateDate(new Date(value))
        }
      },{
        label: '创建时间',
        prop: 'createTime',
        formatter(row, column, value) {
          return util.formateDate(new Date(value))
        }
      }],
      showModal: false,
      showPermission: false,
      title: '菜单',
      pager: {
        pageNum: 1,
        pageSize: 5
      },
      ation: '',
      rules: {
        roleName: [
        {
          required: true,
          message: '请输入角色名',
          trigger: 'blur',
        }
      ]
      },
      curRoleName: '',
      curRoleId: ''
    }
  },
  mounted() {
    this.getRoleList()
    this.getMenuList()
  },
  methods: {
    async getRoleList() {
      try {
        let { page, list } = await this.$api.getRoleList({
          ...this.queryForm,
          ...this.pager
        })
        this.roleList = list
        this.pager.total = page.total
      } catch (error) {
        throw new Error(error)
      }
    },
    // 菜单列表初始化
    async getMenuList() {
      try {
        let list = await this.$api.getMenuList();
        this.menuList = list;
        this.getActionMap(list);
      } catch (e) {
        throw new Error(e);
      }
    },
    getActionMap(list) {
      let actionMap = {}
      const deep = (arr) => {
        while(arr.length) {
          let item = arr.pop()
          if (item.children && item.action) {
            actionMap[item._id] = item.menuName
          }
          if (item.children && !item.action) {
            deep(item.children)
          }
        }
      }
      deep(JSON.parse(JSON.stringify(list)))
      this.actionMap = actionMap
    },
    handleQuery() {
      this.getRoleList()
    },
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    handleCurrentChange(current) {
      this.pager.pageNum = current;
      this.getRoleList();
    },
    handleCreate() {
      this.title = '创建角色'
      this.action = 'create'
      this.showModal = true
    },
    handleClose() {
      this.showModal = false
      this.handleReset('dialogForm')
    },
    handleEdit(row, column, value) {
      this.title = '编辑角色'
      this.action = 'edit'
      this.showModal = true
      this.$nextTick(() => {
        this.roleForm = {
          _id: row._id,
          roleName: row.roleName,
          remark: row.remark,
        }
      })
    },
    async handleDel(_id) {
      await this.$api.operateRole({_id, action: 'delete' })
      this.$message.success('删除成功')
      this.getRoleList()
    },
    // 角色提交
    handleSubmit() {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { action, roleForm } = this
          let parmas = {...roleForm, action}
          await this.$api.operateRole(parmas)
          this.showModal = false
          this.$message.success('操作成功')
          this.handleReset('dialogForm')
          this.getRoleList()
        }
      })
    },
    handleOpenPermission(row) {
      this.curRoleName = row.roleName
      this.curRoleId = row._id
      this.showPermission = true
      let { checkedKeys } = row.permissionList
      setTimeout(()=>{
        this.$refs.tree.setCheckedKeys(checkedKeys)
      })
    },
    async handlePermissionSubmit() {
      let nodes = this.$refs.tree.getCheckedNodes();
      let halfKeys = this.$refs.tree.getHalfCheckedKeys();
      let checkedKeys = [];
      let parentKeys = [];
      nodes.map((node) => {
        if (!node.children) {
          checkedKeys.push(node._id);
        } else {
          parentKeys.push(node._id);
        }
      });
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: parentKeys.concat(halfKeys),
        },
      };
      await this.$api.updatePermission(params);
      this.showPermission = false;
      this.$message.success("设置成功");
      this.getRoleList();
    }
  },
}
</script>

<style scoped>
</style>
