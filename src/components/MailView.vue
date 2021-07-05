<template>
  <div class="mail-view">
    <div class="mail-view__backdrop" @click="closeModal"></div>
    <div class="card mail-view__content">
      <div class="d-flex mx-n1 pb-2">
        <div class="px-1">
          <button @click="toggleArchive(email)" class="btn">
            {{ `${email.archived ? 'Move to Inbox' : 'Archive'} (e)` }}
          </button>
        </div>
        <div class="px-1">
          <button @click="toggleRead(email)" class="btn">{{ `Mark ${email.read ? 'unread' : 'read'} (r)` }}</button>
        </div>
        <div class="px-1">
          <button @click="goNewer" class="btn">Newer</button>
        </div>
        <div class="px-1">
          <button @click="goOlder" class="btn">Older</button>
        </div>
      </div>
      <h2 class="mail-view__title">Subject: <strong>{{ email.subject }}</strong></h2>
      <div class="mail-view__desc"><em>From: {{ email.from }} on {{ format(new Date(email.sentAt), 'MMM do yy') }}</em>
      </div>
      <div>{{ email.body }}</div>
    </div>
  </div>
</template>

<script>
import Format from "date-fns/format";
import {http} from "../http";

export default {
  name: 'MailView',
  props: {
    email: {}
  },
  computed: {
    format() {
      return Format
    }
  },
  methods: {
    goNewer() {
      this.$emit('NEXT')
    },
    goOlder() {
      this.$emit('PREV')
    },
    toggleArchive() {
      this.email.archived = !this.email.archived
      this.updateEmail(this.email)
    },
    async updateEmail(email) {
      await http.put(`/emails/${this.email.id}`, email)
    },
    toggleRead() {
      this.email.read = !this.email.read
      this.updateEmail(this.email)
    },
    closeModal() {
      this.$emit('update:email', null)
    },
    onKeyDown(e) {
      if (e.key === 'Escape') {
        this.closeModal()
      }
      else if (e.key === 'r') {
        this.toggleRead()
      }
      else if (e.key === 'a') {
        this.toggleArchive()
      }
      else if (e.key === 'n') {
        this.goNewer()
      }
      else if (e.key === 'o') {
        this.goOlder()
      }
    },
  },
  created() {
    window.addEventListener('keydown', this.onKeyDown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>


<style>
.mail-view {
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mail-view__backdrop {
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  background: rgba(0, 0, 0, .5);
}

.mail-view__content.card {
  padding: 50px;
  width: 90%;
  max-width: 700px;
  z-index: 1;
}

.mail-view__title {
  margin-bottom: 15px;
}

.mail-view__desc {
  margin-bottom: 10px;
}
</style>