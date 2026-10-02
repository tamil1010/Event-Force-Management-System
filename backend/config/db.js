const { dbInstance } = require('../services/embeddedDb');

const connectDB = async () => {
  console.log('---------------------------------------------------------');
  console.log('⚡ [EventForce] Running in Standalone Embedded Database Mode');
  console.log('📁 Data storage: backend/data/db.json (Zero Atlas setup required!)');
  console.log('👥 Demo Accounts ready:');
  console.log('   - Admin: admin@eventforce.com / password123');
  console.log('   - Manager: manager@eventforce.com / password123');
  console.log('   - Staff: john.security@eventforce.com / password123');
  console.log('---------------------------------------------------------');
  return true;
};

module.exports = connectDB;
