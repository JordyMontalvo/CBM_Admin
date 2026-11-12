<template>
  <div class="pimg">
    <div class="pimg-preview">
      <img v-if="value && !broken" :src="value" alt="Imagen del producto" @error="broken = true" @load="broken = false" />
      <span v-else-if="value && broken" class="pimg-empty">No se pudo cargar</span>
      <span v-else class="pimg-empty">Sin imagen</span>
    </div>

    <div class="pimg-actions">
      <label class="button is-small is-link pimg-upload" :class="{ 'is-loading': uploading }">
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" @change="onFile" :disabled="uploading" />
        Subir desde el equipo
      </label>

      <input
        class="input is-small"
        placeholder="o pega el enlace de la imagen"
        :value="value"
        @change="onLink($event.target.value)"
        :disabled="uploading"
      />

      <a class="pimg-remove" v-if="value && !uploading" @click="setValue('')">Quitar imagen</a>
      <small class="pimg-error" v-if="error">{{ error }}</small>
      <small class="pimg-error" v-else-if="value && broken">
        Ese enlace no es una imagen. Abre la foto, haz clic derecho sobre ella y elige
        «Copiar dirección de imagen» (suele terminar en .jpg, .png o .webp), o descárgala y usa «Subir desde el equipo».
      </small>
    </div>
  </div>
</template>

<script>
import api from "@/api";

const MAX_BYTES = 8 * 1024 * 1024;

export default {
  name: "ProductImageInput",
  props: { value: { type: String, default: "" } },
  data() {
    return { uploading: false, error: null, broken: false };
  },
  watch: {
    value() { this.broken = false; },
  },
  methods: {
    setValue(v) {
      this.error = null;
      this.$emit("input", v);
    },
    onLink(raw) {
      const v = String(raw || "").trim();
      if (v && !/^https?:\/\/\S+$/i.test(v)) {
        this.error = "El enlace debe empezar con http:// o https://";
        return;
      }
      this.setValue(v);
    },
    async onFile(e) {
      const input = e.target;
      const file = input.files && input.files[0];
      input.value = "";
      if (!file) return;

      if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
        this.error = "Formato no permitido. Usa JPG, PNG, WEBP o GIF";
        return;
      }
      if (file.size > MAX_BYTES) {
        this.error = "La imagen supera 8 MB";
        return;
      }

      this.error = null;
      this.uploading = true;
      try {
        const fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
          reader.readAsDataURL(file);
        });
        const { data } = await api.products.uploadImage({ fileName: file.name, fileData });
        if (data.error || !data.url) throw new Error(data.msg || "No se pudo subir la imagen");
        this.setValue(data.url);
      } catch (err) {
        const msg = err.response && err.response.data && err.response.data.msg;
        this.error = msg || err.message || "No se pudo subir la imagen";
      } finally {
        this.uploading = false;
      }
    },
  },
};
</script>

<style scoped>
.pimg { display: flex; gap: 10px; align-items: flex-start; min-width: 280px; }
.pimg-preview {
  width: 72px; height: 72px; flex: 0 0 72px; border: 1px dashed #ccc; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; overflow: hidden; background: #fafafa;
}
.pimg-preview img { max-width: 100%; max-height: 100%; object-fit: contain; }
.pimg-empty { font-size: 11px; color: #999; text-align: center; padding: 4px; }
.pimg-actions { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 190px; }
.pimg-upload { position: relative; overflow: hidden; }
.pimg-upload input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.pimg-remove { font-size: 12px; color: #d93838; cursor: pointer; }
.pimg-error { color: #d93838; font-size: 12px; }
</style>
