// helper function to format dates (posting and comment dates)

module.exports = {
  
    format_date: (date) => {
        return date.toLocaleString();
    },
  
    format_birthday: (date) => {
        let unformattedBirthday = new Date(date);
        let months = ["January", "February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let birthday = `${months[unformattedBirthday.getMonth()]} ${unformattedBirthday.getDate() + 1}`
        return birthday;
    }
}




    