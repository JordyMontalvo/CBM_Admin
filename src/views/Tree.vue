<template>
  <Layout>
    <i class="load" v-if="loading"></i>

    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>{{ title }}</strong> <br />
          <small>Total de nodos: {{ totalNodes }} | Total de usuarios: {{ totalUsers }}</small>
        </div>
      </div>

      <div class="container">
        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
          <div>
            <label>Buscar nodo:</label>
            <input type="text" v-model="searchNode" placeholder="DNI o nombre" style="width: 200px;" />
            <button @click="searchAndNavigate">Buscar</button>
          </div>
          
          <div>
            <button @click="reset">Volver al inicio</button>
          </div>
        </div>

        <div style="display: flex; align-items: flex-start; gap: 20px; margin-bottom: 20px;">
          <div>
            <label>Mover nodo:</label>
            <input type="text" v-model="to" placeholder="DNI del nodo a mover" /> 
          </div>
          <div>
            <label>Debajo de:</label>
            <input type="text" v-model="from" placeholder="DNI del nodo padre" />
          </div>
          <div>
            <button class="button" @click="move" :disabled="!to || !from">Mover</button>
            <button @click="clear">Limpiar</button>
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div id="body">
          <div class="tree-container">
            <ul class="tree">
              <li>
                <span @click="select(node)" :class="{ highlighted: selectedNode === node.id }">
                  {{ node.name }} {{ node.lastName }} <br />
                  <small style="font-size: 10px">{{ node.dni }}</small>
                  <br />
                  <small style="font-size: 8px; color: #666;">{{ node.plan || 'default' }}</small>
                  <br />
                  <small style="font-size: 8px; color: #00bcd4;">Puntos: {{ node.total_points || 0 }}</small>
                </span>

                <TreeNode
                  :node="node"
                  :to="to"
                  :from="from"
                  :selectedNode="selectedNode"
                  @filter="update"
                  @select="select"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from "@/views/Layout";
import api from "@/api";

// Componente recursivo para renderizar el árbol con lazy loading
const TreeNode = {
  name: 'TreeNode',
  props: ['node', 'to', 'from', 'selectedNode'],
  data() {
    return {
      expanded: false,
      loading: false,
      children: this.node.children || [],
      children_points: this.node.children_points || [],
    }
  },
  computed: {
    isSelected() {
      return this.selectedNode === this.node.id
    }
  },
  methods: {
    async expandNode(e) {
      e.stopPropagation();
      if (this.expanded) {
        this.expanded = false
        return
      }
      if (this.children.length === 0 && this.node.childs && this.node.childs.length > 0) {
        this.loading = true
        try {
          const { data } = await api.Tree.GET({ id: this.node.id })
          this.children = data.children || []
          this.children_points = data.children_points || []
        } catch (err) {
          console.error('Error cargando hijos:', err)
        }
        this.loading = false
      }
      this.expanded = true
    },
    handleSelect(e) {
      this.$emit('select', this.node)
    }
  },
  render(h) {
    return h('li', {
      class: { 'selected-node': this.isSelected },
      style: { marginBottom: '8px' }
    }, [
      h('span', {
        on: { click: this.handleSelect },
        style: {
          display: 'inline-block',
          background: this.isSelected ? '#e0f7fa' : '#f8f9fa',
          border: this.isSelected ? '2px solid #00bcd4' : '1px solid #ccc',
          borderRadius: '8px',
          padding: '8px 12px',
          minWidth: '120px',
          boxShadow: this.isSelected ? '0 0 8px #00bcd4' : 'none',
          cursor: 'pointer',
          position: 'relative',
        }
      }, [
        (this.node.childs && this.node.childs.length > 0) ?
          h('i', {
            class: ['fas', this.expanded ? 'fa-minus-square' : 'fa-plus-square'],
            style: { cursor: 'pointer', marginRight: '6px', color: '#00bcd4', fontSize: '18px', position: 'absolute', left: '3px', top: '8px' },
            on: { click: this.expandNode }
          }) : null,
        h('i', { class: ['fas', 'fa-user-tie', { act: this.node.activated, aff: this.node.affiliated }], style: { fontSize: '24px', marginRight: '6px' } }),
        h('span', { style: { fontWeight: 'bold', color: '#333' } }, this.node.name),
        h('br'),
        h('span', { style: { color: '#888', fontSize: '12px' } }, `Puntos: ${this.node.points}`),
        (this.node.total_points !== undefined) ? h('span', { style: { color: '#00bcd4', fontSize: '12px', marginLeft: '8px', fontWeight: 'bold' } }, `Total: ${this.node.total_points}`) : null,
      ]),
      this.loading ? h('div', { style: { color: '#00bcd4', fontSize: '12px', marginTop: '4px' } }, [
        h('i', { class: ['fas', 'fa-spinner', 'fa-spin'], style: { marginRight: '6px' } }), 'Cargando...']
      ) : null,
      (this.expanded && this.children.length > 0)
        ? h('ul', this.children.map(child => h(TreeNode, { props: { node: child, to: this.to, from: this.from, selectedNode: this.selectedNode }, on: { select: this.$listeners.select, filter: this.$listeners.filter } })))
        : null
    ])
  }
}

export default {
  components: { Layout, TreeNode },
  data() {
    return {
      loading: true,
      title: "Red Completa (Lazy Loading)",
      node: null,
      to: null,
      from: null,
      error: "",
      selectedNode: null,
      searchNode: "",
      totalNodes: 0,
      totalUsers: 0,
    };
  },
  async created() {
    const account = JSON.parse(localStorage.getItem("session"));
    this.$store.commit("SET_ACCOUNT", account);
    await this.loadTree();
  },
  methods: {
    async loadTree(nodeId = null) {
      this.loading = true;
      try {
        const { data } = await api.Tree.GET({ id: nodeId });
        this.loading = false;
        
        if (data.error) {
          this.error = data.msg;
          return;
        }
        
        this.node = data.node;
        this.totalNodes = data.totalNodes || 0;
        this.totalUsers = data.totalUsers || 0;
        this.error = "";
      } catch (err) {
        this.loading = false;
        this.error = "Error cargando el árbol: " + err.message;
        console.error("Error loading tree:", err);
      }
    },
    
    async update(child) {
      // Navegar al nodo seleccionado
      await this.loadTree(child.id);
    },
    
    reset() {
      this.loadTree();
      this.selectedNode = null;
    },
    
    select(child) {
      this.selectedNode = child.id;
      
      if (this.to && this.to == child.dni) return (this.to = null);
      if (this.from && this.from == child.dni) return (this.from = null);
      if (!this.to) return (this.to = child.dni);
      if (!this.from) return (this.from = child.dni);
    },
    
    clear() {
      this.to = null;
      this.from = null;
      this.error = "";
      this.selectedNode = null;
    },
    
    async searchAndNavigate() {
      if (!this.searchNode.trim()) return;
      
      this.loading = true;
      try {
        // Buscar por DNI o nombre
        const { data } = await api.Tree.GET({ id: this.searchNode });
        
        if (data.error) {
          this.error = `No se encontró el nodo: ${this.searchNode}`;
          this.loading = false;
          return;
        }
        
        this.node = data.node;
        this.totalNodes = data.totalNodes || 0;
        this.totalUsers = data.totalUsers || 0;
        this.error = "";
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.error = "Error buscando nodo: " + err.message;
      }
    },
    
    async move() {
      if (!this.to || !this.from) {
        this.error = "Debe especificar ambos nodos para mover";
        return;
      }
      if (this.to == this.from) {
        this.error = "No puede mover un nodo debajo de sí mismo";
        return;
      }
      
      if (!confirm(`¿Mover ${this.to} debajo de ${this.from}? Esta operación no puede revertirse.`)) {
        return;
      }
      
      try {
        const { data } = await api.Tree.POST({ to: this.to, from: this.from });
        
        if (data.error) {
          this.error = data.msg;
          return;
        }
        
        // Recargar el árbol completo
        await this.loadTree();
        this.clear();
        
      } catch (err) {
        this.error = "Error moviendo nodo: " + err.message;
        console.error("Error moving node:", err);
      }
    },
  },
};
</script>

<style>
/* https://codepen.io/ea-ger/pen/rNJjxYr
https://codepen.io/team/amcharts/pen/poPxojR */

@import url("https://fonts.googleapis.com/css2?family=Oxygen:wght@300&display=swap");

#body {
  margin: 0;
  padding: 0;
  font-family: "Oxygen", sans-serif;
  letter-spacing: 0.2px;
  height: 100vh;
  position: relative;
}

:root {
  --col-1: #c8ddef;
  --col-2: #c8ddef;
  --bg-1: #0e182d;
  --highlighted: #ff5722;
}

.tree-container {
  overflow: auto;
  width: 100%;
  padding-bottom: 5em;
}

.tree-container > h1 {
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
  padding: 0.5em 0;
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
  border-radius: 0.2em;
  display: inline-block;
  margin: 0 0.2em 0.5em;
  padding: 0.2em 0.5em;
  position: relative;
  transition: all 0.2s ease;
  font-size: 14px;
  cursor: pointer;
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

.tree li:hover > span {
  background-color: var(--col-1);
  color: var(--bg-1);
}

.tree span:hover::after,
.tree li:hover > span::after {
  box-shadow: 0 0 5px 8px var(--col-1) inset;
}

.tree ul:before,
.tree code:before,
.tree span:before {
  outline: solid 1px var(--col-2);
  content: "";
  height: 0.5em;
  left: 50%;
  position: absolute;
}

.tree ul:hover:before,
.tree code:hover:before,
.tree li:hover > span:before {
  outline: solid 1px var(--col-1);
}

.tree span::after {
  outline: solid 1px var(--col-1);
  content: "";
  top: -8px;
  left: calc(50% - 5px);
  width: 8px;
  height: 8px;
  background-color: #888;
  border: 1px solid var(--col-1);
  position: absolute;
  opacity: 1;
  border-radius: 100%;
  transition: all 0.2s ease;
}

.tree ul:before {
  top: -0.5em;
}

.tree code:before,
.tree span:before {
  top: -0.55em;
}

.tree > li {
  margin-top: 0;
}

.tree > li:before,
.tree > li:after,
.tree > li > code:before,
.tree > li > span:before,
.tree > li > span:after {
  outline: none;
  display: none;
}

.highlighted {
  border: 2px solid var(--highlighted) !important;
}

.highlighted:hover {
  background-color: var(--highlighted) !important;
}

.error-message {
  background-color: #fe7968;
  color: white;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  text-align: center;
}

.container {
  max-width: 100%;
}

input[type="text"], input[type="number"] {
  padding: 5px 10px;
  margin: 0 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 5px 15px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.button {
  background-color: #28a745;
}

.button:hover {
  background-color: #218838;
}

.selected-node > span {
  box-shadow: 0 0 8px #00bcd4 !important;
  border: 2px solid #00bcd4 !important;
  background: #e0f7fa !important;
}
</style>
