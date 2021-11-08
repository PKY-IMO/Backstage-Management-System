<template>
  <div class="base-table">
    <div class="action">
      <slot name="action"></slot>
    </div>
    <el-table v-bind="$attrs">
      <template v-for="item in columns" :key="item.prop">
        <el-table-column
          type="selection"
          width="55"
          v-if="item.type == 'selection'"
          key="selection"
        />
        <el-table-column v-bind="item" v-else-if="!item.type">
        </el-table-column>
        <el-table-column v-if="item.type == 'action'" v-bind="item">
          <template #default="scope">
            <template v-for="(btn, index) in item.list" :key="index">
              <el-button
                :type="btn.type || 'text'"
                size="mini"
                @click="handleAction(index, scope.row)"
                v-if="btn.visible"
              >
                {{ btn.text }}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </template>
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
</template>
<script>
export default {
  name: "BaseTable",
  props: ["columns", "pager"],
  setup(props, { emit }) {
    /**
     * 列按钮点击
     * @param index {number} 索引
     * @param row {object} 行数据
     */
    const handleAction = (index, row) => {
      emit("handleAction", { index, row: { ...row } });
    };
    /**
     * 页码变化
     * @param pageNum {number} 页码
     */
    const handleCurrentChange = (pageNum) => {
      emit("handleCurrentChange", pageNum);
    };
    return {
      handleAction,
      handleCurrentChange,
    };
  },
};
</script>