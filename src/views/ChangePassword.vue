<template>
  <Layout>
    <div class="change-password-page">
      <div class="card">
        <div class="header">
          <h1 class="title">Cambiar contraseña</h1>
          <p class="subtitle">Actualiza la contraseña del usuario administrador.</p>
        </div>

        <form @submit.prevent="submit" class="form">
          <div class="field">
            <label class="label">Contraseña actual</label>
            <div class="password-input-wrapper">
              <input
                class="input"
                :type="showOldPassword ? 'text' : 'password'"
                autocomplete="current-password"
                v-model="oldPassword"
                :disabled="loading"
                @input="clearMessages"
              />
              <button
                type="button"
                class="toggle-password"
                :disabled="loading"
                :aria-label="showOldPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                @click="showOldPassword = !showOldPassword"
              >
                <i :class="showOldPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <p v-if="errors.oldPassword" class="error">{{ errors.oldPassword }}</p>
          </div>

          <div class="field">
            <label class="label">Nueva contraseña</label>
            <div class="password-input-wrapper">
              <input
                class="input"
                :type="showNewPassword ? 'text' : 'password'"
                autocomplete="new-password"
                v-model="newPassword"
                :disabled="loading"
                @input="clearMessages"
              />
              <button
                type="button"
                class="toggle-password"
                :disabled="loading"
                :aria-label="showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                @click="showNewPassword = !showNewPassword"
              >
                <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <p class="hint">Recomendado: mínimo 8 caracteres.</p>
            <p v-if="errors.newPassword" class="error">{{ errors.newPassword }}</p>
          </div>

          <label class="checkbox">
            <input type="checkbox" v-model="revokeOthers" :disabled="loading" />
            <span>Cerrar otras sesiones de admin</span>
          </label>

          <div v-if="alert" class="alert" :class="{ success: alertType === 'success', danger: alertType === 'danger' }">
            {{ alert }}
          </div>

          <div class="actions">
            <button class="btn primary" type="submit" :disabled="loading">
              <span v-if="!loading">Guardar</span>
              <span v-else>Guardando...</span>
            </button>
            <button class="btn" type="button" :disabled="loading" @click="cancel">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/views/Layout";
import api from "@/api";

export default {
  components: { Layout },
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      showOldPassword: false,
      showNewPassword: false,
      revokeOthers: true,
      loading: false,
      alert: null,
      alertType: "danger",
      errors: {
        oldPassword: null,
        newPassword: null,
      },
    };
  },
  created() {
    const account = JSON.parse(localStorage.getItem("session") || "null");
    if (account) this.$store.commit("SET_ACCOUNT", account);
  },
  methods: {
    clearMessages() {
      this.alert = null;
      this.errors.oldPassword = null;
      this.errors.newPassword = null;
    },
    validate() {
      let ok = true;
      this.errors.oldPassword = null;
      this.errors.newPassword = null;

      if (!this.oldPassword) {
        this.errors.oldPassword = "Este campo es obligatorio";
        ok = false;
      }
      if (!this.newPassword) {
        this.errors.newPassword = "Este campo es obligatorio";
        ok = false;
      } else if (this.newPassword.length < 8) {
        this.errors.newPassword = "Debe tener mínimo 8 caracteres";
        ok = false;
      }
      return ok;
    },
    async submit() {
      this.clearMessages();
      if (!this.validate()) return;

      this.loading = true;
      try {
        const resp = await api.auth.CHANGE_PASSWORD({
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          revokeOthers: this.revokeOthers,
        });

        if (resp?.data?.error) {
          this.alertType = "danger";
          this.alert = resp.data.msg || "No se pudo actualizar la contraseña";
          return;
        }

        this.alertType = "success";
        this.alert = "Contraseña actualizada";
        this.oldPassword = "";
        this.newPassword = "";
      } catch (e) {
        this.alertType = "danger";
        this.alert = e?.response?.data?.msg || e?.message || "Error de red";
      } finally {
        this.loading = false;
      }
    },
    cancel() {
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style lang="stylus" scoped>
.change-password-page
  display flex
  justify-content center
  padding 10px

.card
  width 100%
  max-width 720px
  background white
  border-radius 16px
  box-shadow 0 12px 30px rgba(0,0,0,0.08)
  padding 28px

.header
  margin-bottom 28px

.title
  margin 0 0 12px 0
  font-size 28px
  line-height 1.3
  font-weight 800
  color #1f2937

.subtitle
  margin 0
  font-size 15px
  line-height 1.5
  color #6b7280

.field
  margin 18px 0

.label
  display block
  font-weight 700
  margin-bottom 8px
  color #111827

.password-input-wrapper
  position relative

.input
  width 100%
  border 2px solid #e5e7eb
  border-radius 10px
  padding 12px 44px 12px 14px
  font-size 15px
  outline none
  transition all .2s ease

.toggle-password
  position absolute
  top 50%
  right 12px
  transform translateY(-50%)
  border none
  background transparent
  color #9ca3af
  cursor pointer
  padding 4px
  display flex
  align-items center
  justify-content center
  font-size 16px
  transition color .2s ease

.toggle-password:hover:not(:disabled)
  color #667eea

.toggle-password:disabled
  opacity 0.5
  cursor not-allowed

.input:focus
  border-color #667eea
  box-shadow 0 0 0 4px rgba(102,126,234,0.12)

.hint
  margin 8px 0 0 0
  color #6b7280
  font-size 13px

.error
  margin 8px 0 0 0
  color #ef4444
  font-size 13px
  font-weight 600

.checkbox
  display flex
  align-items center
  gap 10px
  margin 14px 0 6px 0
  font-weight 600
  color #111827

.alert
  margin 16px 0 0 0
  padding 12px 14px
  border-radius 10px
  font-weight 700

.alert.danger
  background #fff5f5
  color #ef4444
  border 1px solid rgba(239,68,68,0.35)

.alert.success
  background #f0fdf4
  color #16a34a
  border 1px solid rgba(22,163,74,0.35)

.actions
  display flex
  gap 12px
  margin-top 20px

.btn
  border none
  border-radius 10px
  padding 12px 18px
  font-weight 800
  cursor pointer
  background #f3f4f6
  color #111827
  transition all .2s ease

.btn:disabled
  opacity 0.7
  cursor not-allowed

.btn.primary
  background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  color white
  box-shadow 0 8px 18px rgba(102,126,234,0.35)

.btn.primary:hover:not(:disabled)
  transform translateY(-1px)
</style>

