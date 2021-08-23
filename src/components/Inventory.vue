<template>
  <div class="inventory">
    <button
      class="is-small button is-outlined is-info"
      @click="inventory_visible = !inventory_visible"
    >
      <span v-if="inventory_visible === true"> Hide Inventory</span>
      <span v-else-if="inventory_visible === false"> Show Inventory</span>
    </button>
    <div class="inventory-container" v-if="inventory_visible === true">
      <div v-for="item in items" :key="item" class="inventory-item">
        <img
          :src="'data:image/png;base64, ' + this.item_data[item].icon"
          :alt="this.item_data[item].name"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inventory_visible: false,
    }
  },
  props: ['items', 'item_data'],
  created() {

  },
}
</script>

<style>
.inventory {
  margin-left: 15px;
  margin-top: 5px;
}
.inventory-container {
  width: 204px;
  margin-top: 5px;
  height: 275px;
  padding: 6px;
  background-image: url('~@/assets/images/inventory_background.png');
}
.inventory-item {
  width: 47.5px;
  height: 36px;
  padding: 5px;
  display: inline-flex;
  justify-content: center;
}
.inventory-item img {
  max-width: 100%;
  max-height: 100%;
}
</style>
