import axios from "axios";

// TODO: put this in a .env file
// Note: If the app is free, and doesn't require being logged in to be used, the API key
// will be public anyway. If it requires being logged in, the API key must be used only
// server side.
axios.defaults.headers.common['x-api-key'] = '4e1cf2956b116c4015e5086ebd6b653614f4d1c0'
