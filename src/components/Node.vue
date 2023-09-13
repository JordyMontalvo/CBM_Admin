<template>
  <ul v-if="node._childs" v-show="n < N">
    <li v-for="child in node._childs">
      <span @dblclick="dblclick(child)"
            @click="click(child)"
            :class="{green: child.dni == to, red: child.dni == from}">
        {{ child.name }}<br>
        <small style="font-size: 10px;">{{ child.dni }}</small>
      </span>
      <Node :node="child"
            :N="N" :n="n+1" :to="to" :from="from"
            @filter="dblclick" @select="pasTop" />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Node',
  props: ['node', 'N', 'n', 'to', 'from'],
  data() {
    return{
      count: 0,
    }
  },
  methods:{
    dblclick(child) {
      this.$emit('filter', child)
    },
    async click(child) {
      this.count += 1
      setTimeout( () => {
        if(this.count == 1) this.$emit('select', child)
        this.count = 0
      }, 250)
    },
    pasTop(child) {
      this.$emit('select', child)
    }
  }
}
</script>
