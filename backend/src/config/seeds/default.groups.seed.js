
async function defaultGroupsSeed() {
    try {
        console.log('Default groups mapping loaded: 1=Admin, 2=Teacher, 3=Student, 4=School 1');
    } catch (error) {
        console.log('Error seeding default groups:', error);
        process.exit(1);
    }
}

module.exports = defaultGroupsSeed;