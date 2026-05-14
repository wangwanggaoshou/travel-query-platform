<template>
  <div class="visa-page">
    <div class="container">
      <div class="user-layout">
        <aside class="user-sidebar">
          <div class="user-card">
            <el-avatar :size="80" icon="UserFilled" />
            <h3>{{ userStore.username || '用户' }}</h3>
          </div>
          <el-menu :default-active="$route.path" router>
            <el-menu-item index="/user/profile"><el-icon><User /></el-icon><span>个人信息</span></el-menu-item>
            <el-menu-item index="/user/preferences"><el-icon><Setting /></el-icon><span>旅游偏好</span></el-menu-item>
            <el-menu-item index="/user/visa"><el-icon><Tickets /></el-icon><span>签证信息</span></el-menu-item>
            <el-menu-item index="/user/favorites"><el-icon><Star /></el-icon><span>我的收藏</span></el-menu-item>
          </el-menu>
        </aside>

        <main class="user-content">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <h2>签证信息</h2>
                <el-button type="primary" size="small" @click="showAddDialog = true">
                  <el-icon><Plus /></el-icon>
                  添加签证
                </el-button>
              </div>
            </template>

            <!-- 已有签证列表 -->
            <div class="visa-list" v-if="visaList.length > 0">
              <div v-for="(visa, index) in visaList" :key="index" class="visa-item">
                <div class="visa-icon">
                  <el-icon size="28"><Ticket /></el-icon>
                </div>
                <div class="visa-info">
                  <h4>{{ visa.country }}</h4>
                  <div class="visa-meta">
                    <span class="visa-type">
                      <el-tag size="small" :type="getVisaTagType(visa.type)">{{ visa.type }}</el-tag>
                    </span>
                    <span class="visa-date">
                      <el-icon><Calendar /></el-icon>
                      有效期：{{ visa.startDate }} 至 {{ visa.endDate }}
                    </span>
                  </div>
                  <div class="visa-status">
                    <el-tag :type="visa.isValid ? 'success' : 'danger'" size="small" effect="plain">
                      {{ visa.isValid ? '有效' : '已过期' }}
                    </el-tag>
                    <span v-if="visa.isValid" class="days-left">
                      剩余 {{ visa.daysLeft }} 天
                    </span>
                  </div>
                </div>
                <div class="visa-actions">
                  <el-button size="small" text type="primary" @click="editVisa(index)">
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button size="small" text type="danger" @click="deleteVisa(index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>

            <el-empty v-else description="暂未添加签证信息">
              <el-button type="primary" @click="showAddDialog = true">添加签证</el-button>
            </el-empty>

            <!-- 签证提示 -->
            <el-alert
              title="签证信息用于智能推荐"
              description="完善签证信息后，系统将根据您的签证状态推荐可直接前往的旅游目的地，避免推荐需要额外签证的目的地。"
              type="info"
              show-icon
              :closable="false"
              style="margin-top: 20px;"
            />
          </el-card>
        </main>
      </div>
    </div>

    <!-- 添加/编辑签证对话框 -->
    <el-dialog v-model="showAddDialog" :title="editIndex >= 0 ? '编辑签证' : '添加签证'" width="500px">
      <el-form :model="visaForm" label-width="100px">
        <el-form-item label="国家/地区" required>
          <el-select v-model="visaForm.country" placeholder="选择国家/地区" filterable>
            <el-option v-for="c in countryOptions" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="签证类型" required>
          <el-select v-model="visaForm.type" placeholder="选择签证类型">
            <el-option label="旅游签证" value="旅游签证" />
            <el-option label="商务签证" value="商务签证" />
            <el-option label="过境签证" value="过境签证" />
            <el-option label="电子签证" value="电子签证" />
            <el-option label="免签" value="免签" />
            <el-option label="落地签" value="落地签" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker
            v-model="visaForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="visaForm.remark" type="textarea" :rows="2" placeholder="签证备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveVisa">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const userStore = useUserStore()

const showAddDialog = ref(false)
const editIndex = ref(-1)

const visaList = ref([])

const visaForm = reactive({
  country: '',
  type: '',
  dateRange: [],
  remark: '',
})

const countryOptions = [
  '日本', '韩国', '泰国', '新加坡', '马来西亚', '越南', '印度尼西亚', '菲律宾',
  '美国', '加拿大', '英国', '法国', '德国', '意大利', '西班牙', '瑞士',
  '澳大利亚', '新西兰', '俄罗斯', '阿联酋', '土耳其', '埃及', '南非',
  '巴西', '阿根廷', '墨西哥', '古巴', '冰岛', '挪威', '瑞典', '芬兰',
]

function getVisaTagType(type) {
  const map = { '旅游签证': '', '商务签证': 'warning', '电子签证': 'success', '免签': 'success', '落地签': 'info', '过境签证': 'info' }
  return map[type] || ''
}

function editVisa(index) {
  editIndex.value = index
  const visa = visaList.value[index]
  visaForm.country = visa.country
  visaForm.type = visa.type
  visaForm.dateRange = [visa.startDate, visa.endDate]
  visaForm.remark = visa.remark || ''
  showAddDialog.value = true
}

function saveVisa() {
  if (!visaForm.country || !visaForm.type) {
    ElMessage.warning('请填写必填信息')
    return
  }
  const newVisa = {
    country: visaForm.country,
    type: visaForm.type,
    startDate: visaForm.dateRange?.[0] || '',
    endDate: visaForm.dateRange?.[1] || '',
    remark: visaForm.remark,
    isValid: visaForm.dateRange?.[1] ? new Date(visaForm.dateRange[1]) > new Date() : true,
    daysLeft: visaForm.dateRange?.[1] ? Math.ceil((new Date(visaForm.dateRange[1]) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
  }

  if (editIndex.value >= 0) {
    visaList.value[editIndex.value] = newVisa
  } else {
    visaList.value.push(newVisa)
  }

  showAddDialog.value = false
  editIndex.value = -1
  Object.assign(visaForm, { country: '', type: '', dateRange: [], remark: '' })
  ElMessage.success('签证信息已保存')
}

function deleteVisa(index) {
  ElMessageBox.confirm('确定删除该签证信息？', '确认', { type: 'warning' }).then(() => {
    visaList.value.splice(index, 1)
    ElMessage.success('已删除')
  }).catch(() => {})
}
</script>

<style scoped>
.visa-page {
  padding: var(--spacing-xl) 0 var(--spacing-3xl);
}

.user-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: var(--spacing-xl);
}

.user-sidebar { position: sticky; top: 80px; align-self: start; }
.user-card { text-align: center; padding: var(--spacing-xl); background: var(--color-bg-card); border-radius: var(--radius-lg); margin-bottom: var(--spacing-md); box-shadow: var(--shadow-sm); }
.user-card h3 { margin-top: var(--spacing-md); font-size: var(--font-size-lg); }
.user-content :deep(.el-card) { border-radius: var(--radius-md); }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 { font-size: var(--font-size-xl); }

.visa-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.visa-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.visa-item:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-sm);
}

.visa-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-bg);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.visa-info {
  flex: 1;
}

.visa-info h4 {
  font-size: var(--font-size-base);
  margin-bottom: 4px;
}

.visa-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: 4px;
}

.visa-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.visa-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.days-left {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.visa-actions {
  display: flex;
  gap: 4px;
}

@media (max-width: 768px) {
  .user-layout { grid-template-columns: 1fr; }
}
</style>
