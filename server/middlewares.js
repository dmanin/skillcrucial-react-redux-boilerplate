export const apiResponseHeaders = () => {
  const USER_ID = 'd818efc8-1e5d-4a2e-b0c1-c3a8e5b3a272'
  return (req, res, next) => {
    res.set('x-skillcrucial-user', USER_ID)
    res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
    next()
  }
}

export default {
  apiResponseHeaders
}
