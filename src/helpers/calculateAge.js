const calculateAge = (DateBirth) =>{
    const currentDate = new Date();
    const year = parseInt(currentDate.getFullYear());
    const month = parseInt(currentDate.getMonth()) + 1;
    const day = parseInt(currentDate.getDate());

    const yearBith = parseInt(String(DateBirth).substring(0,5));
    const monthBirth = parseInt(String(DateBirth).substring(6,8));
    const dayBirth = parseInt(String(DateBirth).substring(9,11));
    
    let age = year - yearBith;

    if(month < monthBirth){
        age --;
    }else if(month == monthBirth){
        if(day < dayBirth){
            age --;
        }
    }
    return age;
};

module.exports = calculateAge;
