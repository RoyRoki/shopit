const ISO_To_DataTime = (isoString) => {

      const date = new Date(isoString);
      return date.toLocaleString();
};

export const converter =  { ISO_To_DataTime };