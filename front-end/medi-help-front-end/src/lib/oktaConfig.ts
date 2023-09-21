export const oktaConfig = {
    clientId: '0oabfmw5vkzwzWurz5d7',
    issuer: 'https://dev-59427673.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}