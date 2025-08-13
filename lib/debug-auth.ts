// Debug utility for authentication issues
export const debugAuth = {
  logAuthState: () => {
    console.log('🔍 Debug Auth State:')
    console.log('Current URL:', window.location.href)
    console.log('Document cookies:', document.cookie)

    // Parse cookies
    const cookies: Record<string, string> = {}
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=')
      if (name && value) {
        cookies[name] = decodeURIComponent(value)
      }
    })

    console.log('Parsed cookies:', cookies)
    console.log('Auth token present:', !!cookies['auth-token'])
    console.log('Auth status:', cookies['auth-status'])

    // Check localStorage
    const storedUser = localStorage.getItem('adminUser')
    console.log('Stored user in localStorage:', storedUser ? JSON.parse(storedUser) : null)
  },

  testAuthFlow: async () => {
    console.log('🧪 Testing full auth flow...')

    // Test login
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: 'admin@metito.id',
        password: 'admin123'
      }),
    })

    console.log('Login response status:', loginResponse.status)
    console.log('Login response headers:', Object.fromEntries(loginResponse.headers.entries()))

    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      console.log('Login response data:', loginData)

      // Check cookies after login
      setTimeout(() => {
        console.log('Cookies after login:', document.cookie)

        // Test /api/auth/me
        fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
          .then(response => {
            console.log('Me endpoint status:', response.status)
            return response.json()
          })
          .then(data => {
            console.log('Me endpoint data:', data)
          })
          .catch(error => {
            console.error('Me endpoint error:', error)
          })
      }, 100)
    } else {
      const errorText = await loginResponse.text()
      console.log('Login error:', errorText)
    }
  }
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth
  console.log('🔧 Debug auth available: window.debugAuth.logAuthState(), window.debugAuth.testAuthFlow()')
} 
