const User = require('../models/User');

async function generateUniqueCode(department) {
    const year = new Date().getFullYear();
    const prefix = `${year}${department}`;
    
    // Count the number of users in the same department and year
    const count = await User.countDocuments({ uniqueCode: new RegExp(`^${prefix}`) });
    const codeNumber = (count + 1).toString().padStart(3, '0');
    
    return `${prefix}${codeNumber}`;
}

module.exports = generateUniqueCode;
