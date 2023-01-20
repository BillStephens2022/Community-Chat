const { User } = require('../models');

const userData = [
    {
        username: "MarsellusWallace",
        email: "mwallace@aol.com",
        password: "PrettyFarFromOK",
    },
    {
        username: "MiaWallace",
        email: "miawallace@hotmail.com",
        password: "FiveDollarShake",
    },
    {
        username: "VincentVega",
        email: "vincent@gmail.com",
        password: "RoyaleWithCheese",
    },
    {
        username: "JulesWinfield",
        email: "jules@yahoo.com",
        password: "BigKahunaBurger",
    },
];

const seedUsers = async () => {
    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });
};

module.exports = seedUsers;