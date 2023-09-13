<template>
  <ul v-if="node._childs" v-show="n < N">
    <li v-for="_child in node._childs">
      <span @click="passEvent(_child)">{{ _child.name }}</span>
      <Node :node="_child" :N="N" :n="n+1" @selectNode="passEvent" />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Node',
  props: ['node', 'N', 'n'],

  methods:{
    passEvent(child)
    {
      console.log('emit ...')
      this.$emit('selectNode', child)
    }
  }
}
</script>
