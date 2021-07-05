<template>
  <div class="container">
    <h1>Gmail Inbox</h1>
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
          v-for="(email, index) in unArchivedEmails" :key="email.id"
          @click="openEmail(email, index)"
        >
          <td>
            <input type="checkbox">
          </td>
          <td>{{ email.from }}</td>
          <td>
            <p><strong>{{ email.subject }}</strong></p>
          </td>
          <td class="date">{{ format(new Date(email.sentAt), 'MMM do yy') }}</td>
          <td>
            <button class="btn" @click="archiveEmail(email)">Archive</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <mail-view
    @PREV="() => changeEmail(-1)"
    @NEXT="() => changeEmail(1)"
    @update:email="openedEmailIndex = null"
    :email="unArchivedEmails[openedEmailIndex]" v-if="openedEmailIndex !== null"/>
</template>

<script>
import Format from 'date-fns/format'
import {http} from "../http";
import MailView from "./MailView.vue";

export default {
  name: "MailTable",
  components: {MailView},
  data() {
    return {
      loading: false,
      emails: [],
      openedEmailIndex: null
    }
  },
  methods: {
    changeEmail(index) {
      this.openedEmailIndex += index
    },
    openEmail(email, index) {
      this.openedEmailIndex = index
      email.read = true
    },
    async getEmails() {
      try {
        this.loading = true
        const {data: {data}} = await http.get('/emails')
        this.emails = data
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
    }
  },
  computed: {
    console() {
      return console
    },
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
    }
  },
  created() {
    this.getEmails()
  }
}
</script>