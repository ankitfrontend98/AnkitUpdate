/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles';
import '@/assets/variable.scss'

// Composables
import { createVuetify } from 'vuetify';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  defaultTheme: "dark",
  theme: {
    themes: {
      light: {
        colors: {
          background: '#F5F5F8',
          customText: '#344054',
          primaryColor: '#182230',
          tableHeader: '#F2F4F7',
          selectBoxBackground: '#FFF',
          radialBackground: '#FFF',
          selectBoxBorder: '#EAECF0',
          textItemColor: '#182230',
          cardBackground: '#FFF',
          chartLabels: '#98A2B3',
        },
      },
      dark: {
        colors: {
          customText: '#F9FAFB',
          background: '#F5F5F8',
          tableHeader: '#282c41',
          selectBoxBackground: '#262A3F',
          selectBoxBorder: '#344054',
          textItemColor: '#FFF',
          labelColor: '#CFB871',
          primaryColor: '#FFF',
          cardBackground: '#232b4c',
          chartLabels: '#FFF',
          surface: '#232b4c'
        },
      },
    }
  },
});