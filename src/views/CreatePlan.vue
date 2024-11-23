<script setup>
import { ref } from "vue";
import IftaLabel from "primevue/iftalabel"
import Textarea from 'primevue/textarea';

const desc = ref("");

const savePlan = () => {
  console.log("New Plan:", desc.value);
  // 계획 저장 로직 추가
};
</script>

<template>
  <div class="create-plan">
    <IftaLabel>
      <Textarea v-model="desc" rows="5" cols="30" style="resize: none" />
    </IftaLabel>
    <div class="actions">
    </div>
  </div>
</template>

<style scoped>
.create-plan {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plan-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.actions {
  display: flex;
  justify-content: space-between;
}
</style>
