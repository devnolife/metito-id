// Script to clear authentication cache manually
// Run this in browser console if you're having auth issues

console.log('Clearing authentication cache...')

// Clear localStorage
localStorage.removeItem('authToken')
localStorage.removeItem('adminUser')
localStorage.removeItem('user')

// Clear sessionStorage
sessionStorage.clear()

// Clear cookies (if possible)
document.cookie.split(";").forEach(function (c) {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
})

console.log('Authentication cache cleared!')
console.log('Please refresh the page and try logging in again.')

// Force page reload
window.location.reload() 
