<template>
  <div class="d-flex  mx-n1">
    <div class="px-1">
      <button @click="markReadEmails" :disabled="emails.every(item => item.read === true)" class="btn">Mark read
      </button>
    </div>
    <div class="px-1">
      <button :disabled=" emails.every(item => item.read === false)" @click="markUnreadEmails"
              class="btn">Mark unread
      </button>
    </div>
    <div class="px-1">
      <button @click="archiveEmails" class="btn">Archive
      </button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'BulkActionBar',
  props: {
    emails: {
      type: Array,
    }
  },
  methods: {
    markReadEmails() {
      this.emails.forEach(item => {
        item.read = true
        this.$emit('updateEmail', item)
      })
      this.clearEmails()
    },
    markUnreadEmails() {
      this.emails.forEach(item => {
        item.read = false
        this.$emit('updateEmail', item)
      })
      this.clearEmails()
    },
    archiveEmails() {
      this.emails.forEach(item => {
        item.archived = true
        this.$emit('updateEmail', item)
      })
      this.clearEmails()
    },
    clearEmails() {
      this.$emit('clear')
    }
  },
}
</script>