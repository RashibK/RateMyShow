//---------------------------------------------------For MyAnimeList--------------------------------------------------------------------------------------------------//
export function createCodeVerifier() {
    var rand = new Uint8Array(32);
    crypto.getRandomValues(rand);
    var code_verifier = btoa(String.fromCharCode.apply(null, rand)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    sessionStorage.setItem('mal_code_verifier', code_verifier);
    return code_verifier
  } 


export function createStateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const state_token = btoa(array).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  
    sessionStorage.setItem('mal_state_param', state_token)
  
    
    return state_token
  }
