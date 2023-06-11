function formatDate(date) {
   const day = date.getDate().toString().padStart(2, '0');
   const month = (date.getMonth() + 1).toString().padStart(2, '0');
   const year = date.getFullYear().toString();
   return `${day}/${month}/${year}`;

}

const updateAt = '1/06/2023';

function calculateDayPassed(date) {
   const currentDate = new Date();
   const [day, month, year] = date.split('/');
   const pastDate = new Date(`${month}/${day}/${year}`);
   const timeDiff = currentDate.getTime() - pastDate.getTime();
   const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

   if (daysDiff >= 30) {
      return true;
   } else {
      return false;
   }
}

const daysPassed = calculateDayPassed(updateAt);

console.log(daysPassed);
