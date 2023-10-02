<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>{{ title }}</strong> <br>
        </div>
      </div>

      <div class="container">
        Niveles: <input type="number" v-model="N">
        <button @click="reset">reset</button> <br><br>

        <div style="display: flex; align-items: flex-start;">
          <div>
            Mover:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="text" v-model="to"> <br>
            Debajo de: <input type="text" v-model="from">
            <button @click="clear">clear</button> <br><br>
          </div>
          <div>
            <small v-show="error" style="color: red;">{{ error }} <br></small>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button class="button" @click="move">Mover</button>
          </div>
        </div>

        <div id="body">
          <div class="tree-container">
            <ul class="tree">
              <li>
                <span @click="select(node)">
                  {{ node.name }} <br>
                  <small style="font-size: 10px;">{{ node.dni }}</small>
                </span>

                <Node :node="node"
                      :N="N" :n="0" :to="to" :from="from"
                      @filter="update" @select="select"/>

              </li>
            </ul>
          </div>
        </div>
      </div>

    </section>

  </Layout>
</template>

<script>
import Layout from '@/views/Layout'
import Node from '@/components/Node'
import api from '@/api'

export default {
  components: { Layout, Node },
  data() {
    return{
      loading: true,
      title: 'Red',
      node: null,
      N: 5,
      to: null,
      from: null,
      error: '',
    }
  },
  async created() {

    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)

    this.loading = true

    // GET data
    const { data } = await api.Tree.GET(); console.log({ data })

    this.loading = false

    // success
    this.node = data.node
    this.Node = data.node
  },
  methods: {
    update(child) {
      this.node = child
    },
    reset(child) {
      this.node = this.Node
      this.N = 5
    },

    select(child) {
      if(this.to   && this.to   == child.dni) return this.to   = null
      if(this.from && this.from == child.dni) return this.from = null

      if(!this.to)   return this.to   = child.dni
      if(!this.from) return this.from = child.dni
    },
    clear() {
      this.to   = null
      this.from = null
      this.error = ''
    },

    async move() {
      if(!this.to || !this.from) return
      if(this.to == this.from) return

      // await
      if(!confirm(`se moverá ${this.to} debajo de ${this.from}, esta operación on puede revertirse`)) return

      const { to, from } = this
      const { data } = await api.Tree.POST({ to, from }); console.log({ data })

      if(data.error) return this.error = data.msg

      const { data: _data } = await api.Tree.GET(); console.log({ _data })

      this.node = _data.node
      this.Node = _data.node
    },
  }
};
</script>

<style>
/* https://codepen.io/ea-ger/pen/rNJjxYr
https://codepen.io/team/amcharts/pen/poPxojR */

  @import url('https://fonts.googleapis.com/css2?family=Oxygen:wght@300&display=swap');

  #body {
    margin: 0;
    padding: 0;
/*    background: #fafafa;*/
    font-family: 'Oxygen', sans-serif;
    letter-spacing: 0.2px;
    height: 100vh;
/*    width: 100vw;*/
/*    background-color: var(--bg-1);*/
    position: relative;
  }

  :root {
    --col-1: #c8ddef;
    --col-2: #c8ddef;
    --bg-1: #0e182d;
    --highlighted: #ff5722;
  }

  .tree-container {
    /*display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;*/

    overflow: auto;

    width: 100%;
/*    padding-top: 5em;*/
    padding-bottom: 5em;
  }

  .tree-container>h1 {
    color: var(--col-1);
    font-weight: 400;
  }

  .tree,
  .tree ul,
  .tree li {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
  }

  .tree {
    margin: 0 0 1em;
    text-align: center;
  }

  .tree,
  .tree ul {
    display: table;
  }

  .tree ul {
    width: 100%;
  }

  .tree li {
    display: table-cell;
    padding: .5em 0;
    vertical-align: top;
  }

  .tree li:before {
    outline: solid 1px var(--col-2);
    content: "";
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    direction: rtl;
  }

  .tree li:hover:before {
    outline: solid 1px var(--col-1);
  }

  .tree li:first-child:before {
    left: 50%;
  }

  .tree li:last-child:before {
    right: 50%;
  }

  .tree code,
  .tree span {
/*    border: solid .1em var(--col-1);*/
    border-radius: .2em;
    display: inline-block;
    margin: 0 .2em .5em;
    padding: .2em .5em;
    position: relative;
/*    background-color: var(--bg-1);*/
    transition: all 0.2s ease;
/*    color: var(--col-1);*/
    font-size: 14px;
  }

  .tree span.green {
    background: rgba(201, 242, 155) !important;
  }
  .tree span.red {
    background: #fe7968 !important;
  }

  .tree span:hover {
    background-color: var(--col-1);
    color: var(--bg-1);
  }

  .tree li:hover>span {
    background-color: var(--col-1);
    color: var(--bg-1);
  }

  .tree span:hover::after,
  .tree li:hover>span::after {
    box-shadow: 0 0 5px 8px var(--col-1) inset;
  }

  .tree ul:before,
  .tree code:before,
  .tree span:before {
    outline: solid 1px var(--col-2);
    content: "";
    height: .5em;
    left: 50%;
    position: absolute;
  }

  .tree ul:hover:before,
  .tree code:hover:before,
  .tree li:hover>span:before {
    outline: solid 1px var(--col-1);
  }

  .tree span::after {
    outline: solid 1px var(--col-1);
    content: "";
    top: -8px;
    left: calc(50% - 5px);
    width: 8px;
    height: 8px;
/*    background-color: var(--bg-1);*/
    background-color: #888;
    border: 1px solid var(--col-1);
    position: absolute;
    opacity: 1;
    border-radius: 100%;
    transition: all 0.2s ease;
  }

  .tree ul:before {
    top: -.5em;
  }

  .tree code:before,
  .tree span:before {
    top: -.55em;
  }

  .tree>li {
    margin-top: 0;
  }

  .tree>li:before,
  .tree>li:after,
  .tree>li>code:before,
  .tree>li>span:before,
  .tree>li>span:after {
    outline: none;
    display: none;

  }

  .highlighted {
    border: 2px solid var(--highlighted) !important;
  }

  .highlighted:hover {
    background-color: var(--highlighted) !important;
  }
</style>
