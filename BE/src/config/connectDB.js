const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/IOT_DIEMDANH');
        console.log('Connect DB OK!')
    } catch {
        console.log('Connect Failed!');
    }
}
module.exports = { connect };