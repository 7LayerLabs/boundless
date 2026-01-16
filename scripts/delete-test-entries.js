// Temporary script to delete test entries
// Run with: node scripts/delete-test-entries.js

const { init, tx } = require('@instantdb/admin');

const APP_ID = '9f557bfc-7463-4e90-9b3b-1b8d22a9b70d';

// You'll need to get the admin token from InstantDB dashboard
// For now, we'll use the client SDK approach

async function main() {
  console.log('InstantDB App ID:', APP_ID);
  console.log('\nTo delete entries, you have two options:\n');
  console.log('1. Use the InstantDB Dashboard:');
  console.log('   - Go to https://instantdb.com/dash');
  console.log('   - Select your app');
  console.log('   - Navigate to "Explorer"');
  console.log('   - Find the "entries" table');
  console.log('   - Select and delete entries 2-9\n');
  console.log('2. Add a temporary delete function in the app:');
  console.log('   - We can add a hidden admin button to delete entries');
}

main();
