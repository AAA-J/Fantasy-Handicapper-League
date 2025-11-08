#!/usr/bin/env node

/**
 * Test Setup Script
 * Verifies that the application is properly configured and running
 */

const http = require('http');
const { exec } = require('child_process');

const BACKEND_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:5173';

console.log('🧪 Testing Fantasy Handicapper League Setup...\n');

// Test backend health
function testBackend() {
  return new Promise((resolve) => {
    const req = http.get(`${BACKEND_URL}/api/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.status === 'OK') {
            console.log('✅ Backend server is running');
            resolve(true);
          } else {
            console.log('❌ Backend server responded with error');
            resolve(false);
          }
        } catch (e) {
          console.log('❌ Backend server response is not valid JSON');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Backend server is not running');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Backend server connection timeout');
      resolve(false);
    });
  });
}

// Test frontend
function testFrontend() {
  return new Promise((resolve) => {
    const req = http.get(FRONTEND_URL, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Frontend server is running');
        resolve(true);
      } else {
        console.log('❌ Frontend server returned status:', res.statusCode);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Frontend server is not running');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Frontend server connection timeout');
      resolve(false);
    });
  });
}

// Test API endpoints
async function testAPIEndpoints() {
  const endpoints = [
    { url: '/api/users', name: 'Users API' },
    { url: '/api/market-contracts', name: 'Market Contracts API' },
    { url: '/api/prop-bets', name: 'Prop Bets API' }
  ];
  
  let allPassed = true;
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${BACKEND_URL}${endpoint.url}`);
      if (response.ok) {
        console.log(`✅ ${endpoint.name} is working`);
      } else {
        console.log(`❌ ${endpoint.name} returned status: ${response.status}`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name} failed: ${error.message}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

// Main test function
async function runTests() {
  console.log('Testing server connectivity...\n');
  
  const backendOk = await testBackend();
  const frontendOk = await testFrontend();
  
  if (backendOk && frontendOk) {
    console.log('\nTesting API endpoints...\n');
    const apiOk = await testAPIEndpoints();
    
    console.log('\n' + '='.repeat(50));
    if (backendOk && frontendOk && apiOk) {
      console.log('🎉 All tests passed! Application is ready to use.');
      console.log(`\n📱 Frontend: ${FRONTEND_URL}`);
      console.log(`🔧 Backend API: ${BACKEND_URL}`);
      console.log('\n💡 You can now start using the application!');
    } else {
      console.log('❌ Some tests failed. Please check the setup.');
      process.exit(1);
    }
  } else {
    console.log('\n❌ Server connectivity tests failed.');
    console.log('\nTo start the servers, run:');
    console.log('  npm run dev');
    console.log('\nOr start them separately:');
    console.log('  Terminal 1: npm run dev:server');
    console.log('  Terminal 2: npm run dev:client');
    process.exit(1);
  }
}

// Run tests
runTests().catch(console.error);
