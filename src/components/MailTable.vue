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
          v-for="email in unArchivedEmails" :key="email.id"
          @click="email.read = true"
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
</template>

<script>
import Format from 'date-fns/format'
import {http} from "../http";

export default {
  name: "MailTable",
  data() {
    return {
      loading: false,
      emails: [
      ]
    }
  },
  methods: {
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