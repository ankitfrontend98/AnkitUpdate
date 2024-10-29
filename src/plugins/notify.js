import { reactive } from 'vue'; 

export default {
  install: (app) => {
    const snackbar = reactive({
      message: '',
      color: 'success',
      timeout: 3000,
      value: false,
    });
    const notify = (message, options = {}) => {
      snackbar.message = message;
      snackbar.color = options.color || 'success';
      snackbar.timeout = options.timeout || 3000;
      snackbar.value = true;
    };
    app.provide('snackbar', snackbar);
    app.provide('notify', notify);
  },
};
