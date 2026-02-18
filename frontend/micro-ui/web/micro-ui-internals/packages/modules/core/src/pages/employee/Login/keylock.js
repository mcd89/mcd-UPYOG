import Keycloak from "keycloak-js";

let _kc = null;

export const initKeycloak = (onAuthenticatedCallback) => {
  _kc = new Keycloak({
    url: "https://dev-djb.nitcon.in/keycloak",
    realm: "DL",
    clientId: "local-upyog",
    redirectUri: window.location.origin + "/digit-ui/employee"
  });

  _kc.init({
    onLoad: "login-required",
    pkceMethod: "S256",
    checkLoginIframe: false
  }).then(auth => {
    if (!auth) {
      _kc.login();
    } else {
      onAuthenticatedCallback();
    }
  }).catch(err => {
    console.error("Keycloak init failed:", err);
  });
};

export const getKeycloak = () => _kc;
