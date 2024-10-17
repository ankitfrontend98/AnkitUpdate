export function useDateFormat() {
    const formatDateTime = (value) => {
      if (!value) return '';
      const year = value.substring(0, 4);
      const month = value.substring(4, 6);
      const day = value.substring(6, 8);
      return `${year}/${month}/${day}`;
    };
  
    return {
      formatDateTime
    };
  }