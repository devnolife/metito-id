// Test script to directly test categories API without authentication
const testCategoryAPIBasic = async () => {
  console.log('=== TESTING CATEGORIES API ===')
  
  try {
    // First test: GET categories (should work without auth)
    console.log('\n1. Testing GET /api/categories')
    const getResponse = await fetch('http://localhost:3000/api/categories')
    console.log('GET Response status:', getResponse.status)
    console.log('GET Response statusText:', getResponse.statusText)
    
    const getResponseText = await getResponse.text()
    console.log('GET Raw response:', getResponseText)
    
    if (getResponse.ok && getResponseText) {
      try {
        const getData = JSON.parse(getResponseText)
        console.log('GET Parsed data:', getData)
      } catch (e) {
        console.error('GET Failed to parse:', e)
      }
    }
    
    // Second test: POST categories (will fail without auth, but let's see the error)
    console.log('\n2. Testing POST /api/categories (without auth)')
    const postResponse = await fetch('http://localhost:3000/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Category',
        description: 'Test description'
      })
    })
    
    console.log('POST Response status:', postResponse.status)
    console.log('POST Response statusText:', postResponse.statusText)
    console.log('POST Response headers:', Object.fromEntries(postResponse.headers.entries()))
    
    const postResponseText = await postResponse.text()
    console.log('POST Raw response:', postResponseText)
    console.log('POST Response length:', postResponseText.length)
    console.log('POST Response type:', typeof postResponseText)
    
    if (postResponseText) {
      try {
        const postData = JSON.parse(postResponseText)
        console.log('POST Parsed data:', postData)
      } catch (e) {
        console.error('POST Failed to parse JSON:', e)
        console.log('POST Response appears to be:', postResponseText.substring(0, 100) + '...')
      }
    } else {
      console.log('POST Response is empty!')
    }
    
  } catch (error) {
    console.error('Test failed with error:', error)
  }
}

// Run the test
testCategoryAPIBasic()
