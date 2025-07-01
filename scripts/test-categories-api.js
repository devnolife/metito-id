// Quick test for categories API
const testUrl = 'http://localhost:3000/api/categories'

console.log('Testing categories API...')

// Test data
const testCategory = {
  name: 'Test Category',
  description: 'Test description'
}

console.log('Sending POST request with data:', testCategory)

fetch(testUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify(testCategory)
})
.then(response => {
  console.log('Response status:', response.status)
  console.log('Response headers:', [...response.headers.entries()])
  return response.text()
})
.then(text => {
  console.log('Raw response text:', text)
  try {
    const json = JSON.parse(text)
    console.log('Parsed JSON:', json)
  } catch (e) {
    console.error('Failed to parse JSON:', e)
  }
})
.catch(error => {
  console.error('Fetch error:', error)
})
