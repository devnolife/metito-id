// Simple test script to test category API directly
const testCategoryAPI = async () => {
  try {
    console.log('Testing POST /api/categories...')
    
    const response = await fetch('http://localhost:3000/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Category',
        description: 'Test description'
      })
    })
    
    console.log('Response status:', response.status)
    console.log('Response statusText:', response.statusText)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
    console.log('Raw response text:', responseText)
    console.log('Response text length:', responseText.length)
    
    if (responseText) {
      try {
        const jsonData = JSON.parse(responseText)
        console.log('Parsed JSON:', jsonData)
      } catch (parseError) {
        console.error('Failed to parse as JSON:', parseError)
      }
    } else {
      console.log('Response is empty')
    }
    
  } catch (error) {
    console.error('Request error:', error)
  }
}

// Run the test
testCategoryAPI()
