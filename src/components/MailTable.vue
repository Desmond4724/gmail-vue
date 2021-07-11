<template>
  <div class="container">
    <h1 class="mb-2">Gmail Inbox</h1>
    <h1 class="mb-2" v-if="selectionEmails.length">{{ selectionEmails.length }} emails selected</h1>
    <div class="d-flex justify-center mb-2">
      <div class="px-1">
        <button @click="toggleScreenView('inbox')" :class="['btn', {disabled: selectedScreenView === 'archived'}]">
          Inbox
        </button>
      </div>
      <div class="px-1">
        <button @click="toggleScreenView('archived')" :class="['btn', {disabled: selectedScreenView === 'inbox'}]">
          Archived
        </button>
      </div>
    </div>
    <bulk-action-bar
      v-if="selectionEmails.length"
      class="mb-2"
      @updateEmail="updateEmail"
      @clear="selectionEmails = []"
      :emails="selectionEmails"
    ></bulk-action-bar>
    <div class="card">
      <div class="linear-activity" v-if="loading">
        <div class="indeterminate"></div>
      </div>
      <table class="mail-table" v-else>
        <thead>
        <tr class="mail-table__row">
          <th></th>
          <th>From</th>
          <th>Subject</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        <tr
          :class="['mail-table__row', {'mail-table__row-read': email.read}]"
          v-for="(email, index) in viewEmails" :key="email.id"
          @click="openEmail(email, index)"
        >
          <td>
            <input
              class="mail-table__checkbox"
              @click.stop="toggleCheckEmail(email)"
              :checked="selectionEmails.includes(email)"
              type="checkbox">
          </td>
          <td>{{ email.from_user }}</td>
          <td>
            <p><strong>{{ email.subject }}</strong></p>
          </td>
          <td class="date">{{ format(new Date(email.sent_at), 'MMM do yy') }}</td>
          <td>
            <button class="btn" @click="archiveEmail(email)">Archive</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <mail-view
    @changeEmail="changeEmail"
    @update:email="openedEmailIndex = null"
    v-model:email="openedEmail" v-if="openedEmail"/>
</template>

<script>
import Format from 'date-fns/format'
import {http} from "../http";
import MailView from "./MailView.vue";
import BulkActionBar from "./BulkActionBar.vue";

export default {
  name: "MailTable",
  components: {BulkActionBar, MailView},
  data() {
    return {
      loading: false,
      emails: [],
      openedEmail: null,
      selectionEmails: [],
      selectedScreenView: 'archived'
    }
  },
  methods: {
    toggleScreenView(view) {
      this.selectedScreenView = view
      localStorage.setItem('view', view)
    },
    toggleCheckEmail(email) {
      const indexEmail = this.selectionEmails.indexOf(email)
      if (indexEmail === -1) {
        this.selectionEmails.push(email)
      }
      else {
        this.selectionEmails.splice(indexEmail, 1)
      }
    },
    changeEmail({toggleRead, toggleArchive, save, closeModal, changeIndex}) {
      if (toggleRead) this.openedEmail.read = !this.openedEmail.read
      if (toggleArchive) {
        this.openedEmail.archived = !this.openedEmail.archived
      }
      if (save) this.updateEmail(this.openedEmail)
      if (closeModal) this.openedEmail = null
      if (typeof changeIndex !== 'undefined') {
        const newEmailIndex = this.unArchivedEmails.indexOf(this.openedEmail) + changeIndex
        if (this.unArchivedEmails[newEmailIndex]) {
          this.openedEmail = this.unArchivedEmails[newEmailIndex]
        }
      }
    },
    openEmail(email) {
      this.openedEmail = email
      email.read = true
    },
    async getEmails() {
      try {
        this.loading = true
        const {data: {data}} = await http.get('/emails')
        this.emails = data
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    archiveEmail(email) {
      email.archived = true
      this.updateEmail(email)
    },
    async updateEmail(email) {
      await http.put(`emails/${email.id}`, email)
    },
  },
  computed: {
    format() {
      return Format
    },
    sortedEmails() {
      return this.emails.sort((e1, e2) => {
        return e1.sentAt < e2.sentAt ? 1 : -1
      })
    },
    unArchivedEmails() {
      return this.sortedEmails.filter(e => !e.archived)
    },
    archivedEmails() {
      return this.sortedEmails.filter(item => item.archived)
    },
    viewEmails() {
      if (this.selectedScreenView === 'inbox') return this.unArchivedEmails
      else if (this.selectedScreenView === 'archived') return this.archivedEmails
      return []
    }
  },
  created() {
    this.getEmails()
    const view = localStorage.getItem('view')
    if (view) this.selectedScreenView = view
  }
}
</script>