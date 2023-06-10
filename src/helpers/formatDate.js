function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;

}

function calculateDayPassed(date) {
    const currentDate = new Date();
    const pastDate = new Date(date);
    const timeDiff = currentDate.getTime() - pastDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff >= 10) {
        return true;
    } else {
        return false;
    }
}


module.exports = { formatDate, calculateDayPassed };