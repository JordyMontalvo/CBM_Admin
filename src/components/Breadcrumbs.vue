<template>
  <nav class="breadcrumbs" v-if="items.length > 0">
    <ol class="breadcrumbs-list">
      <li v-for="(item, index) in items" :key="index" class="breadcrumbs-item">
        <router-link 
          v-if="item.to && index < items.length - 1" 
          :to="item.to" 
          class="breadcrumbs-link"
        >
          <i v-if="item.icon" :class="item.icon" class="breadcrumbs-icon"></i>
          <span>{{ item.label }}</span>
        </router-link>
        <span v-else class="breadcrumbs-current">
          <i v-if="item.icon" :class="item.icon" class="breadcrumbs-icon"></i>
          <span>{{ item.label }}</span>
        </span>
        <i v-if="index < items.length - 1" class="fas fa-chevron-right breadcrumbs-separator"></i>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

<style lang="stylus" scoped>
.breadcrumbs
  background white
  padding 12px 20px
  border-radius 8px
  box-shadow 0 2px 8px rgba(0, 0, 0, 0.05)
  margin-bottom 20px
  border-left 4px solid #667eea

.breadcrumbs-list
  display flex
  align-items center
  flex-wrap wrap
  gap 8px
  margin 0
  padding 0
  list-style none

.breadcrumbs-item
  display flex
  align-items center
  gap 8px

.breadcrumbs-link
  display flex
  align-items center
  gap 6px
  color #667eea
  text-decoration none
  font-size 14px
  font-weight 500
  transition all 0.2s ease
  padding 4px 8px
  border-radius 4px

  &:hover
    background rgba(102, 126, 234, 0.1)
    color #764ba2

.breadcrumbs-current
  display flex
  align-items center
  gap 6px
  color #333
  font-size 14px
  font-weight 600
  padding 4px 8px

.breadcrumbs-icon
  font-size 12px

.breadcrumbs-separator
  color #999
  font-size 10px
  margin 0 4px

@media (max-width: 768px)
  .breadcrumbs
    padding 10px 15px

  .breadcrumbs-list
    gap 6px

  .breadcrumbs-link, .breadcrumbs-current
    font-size 13px
    padding 3px 6px
</style>









