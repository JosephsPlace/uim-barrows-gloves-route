<template>
  <div>
    <div v-for="item in items" :key="item">
      <img
        :src="'data:image/png;base64, ' + this.item_data[item].icon"
        :alt="this.item_data[item].name"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ['items', 'item_data'],
  created() {
    console.log(this.items)
  },
}
</script>
