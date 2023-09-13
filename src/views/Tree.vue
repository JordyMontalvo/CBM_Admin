<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>{{ title }}</strong>
        </div>
      </div>

      <div class="container">
        Niveles: <input type="number" v-model="N">
        <button @click="reset">reset</button>

        <div id="body">
          <div class="tree-container">
            <ul class="tree">
              <li>
                <span>{{ node.name }}</span>

                <Node :node="node" :N="N" :n="0" @selectNode="update"/>

                <!-- <ul v-if="node._childs">
                  <li v-for="_child1 in node._childs">

                    <span>{{ _child1.name }}</span>

                    <ul v-if="_child1._childs">
                      <li v-for="_child2 in _child1._childs">

                        <span>{{ _child2.name }}</span>

                        <ul v-if="_child2._childs">
                          <li v-for="_child3 in _child2._childs">

                            <span>{{ _child3.name }}</span>

                            <ul v-if="_child3._childs">
                              <li v-for="_child4 in _child3._childs">

                                <span>{{ _child4.name }}</span>

                                <ul v-if="_child4._childs">
                                  <li v-for="_child5 in _child4._childs">

                                    <span>{{ _child5.name }}</span>

                                    <ul v-if="_child5._childs">
                                      <li v-for="_child6 in _child5._childs">

                                        <span>{{ _child6.name }}</span>

                                        <ul v-if="_child6._childs">
                                          <li v-for="_child7 in _child6._childs">

                                            <span>{{ _child7.name }}</span>

                                            <ul v-if="_child7._childs">
                                              <li v-for="_child8 in _child7._childs">

                                                <span>{{ _child8.name }}</span>

                                                <ul v-if="_child8._childs">
                                                  <li v-for="_child9 in _child8._childs">

                                                    <span>{{ _child9.name }}</span>

                                                    <ul v-if="_child9._childs">
                                                      <li v-for="_child10 in _child9._childs">

                                                        <span>{{ _child10.name }}</span>

                                                      </li>
                                                    </ul>
                                                  </li>
                                                </ul>
                                              </li>
                                            </ul>
                                          </li>
                                        </ul>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul> -->
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
      // tree,
      // l,
      // id,
      loading: true,
      title: 'Red',
      // tree: null,
      node: null,
      N: 5,
    }
  },
  async created() {

    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)

    this.loading = true

    // GET data
    const { data } = await api.Tree.GET(); console.log({ data })

    this.loading = false

    // error
    // if(data.error && data.msg == 'invalid filter') this.$router.push('collects/all')

    // success
    // this.tree = data.tree
    this.node = data.node
    this.Node = data.node
  },
  methods: {
    update(child) {
      this.node = child
    },
    reset(child) {
      this.node = this.Node
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
    padding-top: 5em;
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
