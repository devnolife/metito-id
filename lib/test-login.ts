// Test script to debug login issues
export const testLogin = async () => {
  console.log('🧪 Testing login functionality...')

  try {
    // Test login endpoint
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: 'admin@metito.id', // Adjust email as needed
        password: 'admin123' // Adjust password as needed
      }),
    })

    console.log('Login Response Status:', loginResponse.status)

    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      console.log('Login Data:', loginData)

      // Test /api/auth/me endpoint immediately after login
      const meResponse = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      console.log('Me Response Status:', meResponse.status)

      if (meResponse.ok) {
        const meData = await meResponse.json()
        console.log('Me Data:', meData)
      } else {
        console.log('Me endpoint failed')
        const errorText = await meResponse.text()
        console.log('Me Error:', errorText)
      }

    } else {
      console.log('Login failed')
      const errorText = await loginResponse.text()
      console.log('Login Error:', errorText)
    }

  } catch (error) {
    console.error('Test failed:', error)
  }
}

// Check current cookies
export const checkCookies = () => {
  console.log('🍪 Current cookies:')
  console.log(document.cookie)

  const cookies: Record<string, string> = {}
  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=')
    if (name && value) {
      cookies[name] = decodeURIComponent(value)
    }
  })

  console.log('Parsed cookies:', cookies)
  return cookies
}

// Export for browser console use
if (typeof window !== 'undefined') {
  (window as any).testLogin = testLogin;
  (window as any).checkCookies = checkCookies
  console.log('🔧 Test functions available: window.testLogin(), window.checkCookies()')
}
