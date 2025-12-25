
export async function handleAuthError() {
  try {
    await fetch('/api/logout', { 
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Logout API error:', error)
  }
  
  window.location.href = '/login'
}

export async function clientLogout() {
  await handleAuthError()
}

export function clearClientAuth() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('user')
      sessionStorage.clear()
    } catch (e) {
    }
  }
}
