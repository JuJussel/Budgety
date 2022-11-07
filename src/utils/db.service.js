const mongoose = require('mongoose');
import config from '../config/config.json'

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://' + config.db.user + ':' + config.db.password + '@' + config.db.db);

}