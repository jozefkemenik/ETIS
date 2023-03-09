import * as Msal from 'msal';
import store from '@/store';
import Vue from "vue";

const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const msedge = ua.indexOf("Edge/");
const isIE = msie > 0 || msie11 > 0 || msedge > 0;


var _signInType = null;
var _this = null;
export default class AuthService {
  constructor() {

    _this = this;
  
    console.log('constructor AuthService');
    _signInType = isIE ? "Redirect" : "Popup";
    _signInType = "Redirect";
    _this.handleRedirect = false;

    if (localStorage.msalconfig) {
      this.msalObj = new Msal.UserAgentApplication(JSON.parse(localStorage.msalconfig));
      this.msalObj.handleRedirectCallback(() => {
        _this.handleRedirect = true;
      });
    }
    // init on cofnig loaded
    store.subscribe((mutation) => {
      if (mutation.type == "ConfLoad") {
        console.log(mutation)
        _this.baseUrl =   mutation.payload.baseUrl;
        console.log("ConfLoad");
        if (!this.msalObj) {
          localStorage.msalconfig = JSON.stringify(mutation.payload.mslaConfig);
          this.msalObj = new Msal.UserAgentApplication(mutation.payload.mslaConfig);
          this.msalObj.handleRedirectCallback(() => {
            _this.handleRedirect = true;
          });
        }
        if (_this.handleRedirect) {
          _this.handleRedirect = false;
          _this.handleRedirectResponse();
        }
      }
    });
  }

  makeToast(title, text, variant = 'danger') {
    this.$bvToast.toast(text, {
      title: `${title || 'Alert!'}`,
      variant: variant,
      solid: true,
      toaster: 'b-toaster-bottom-right',
      appendToast: true
    })
  }

  login() {
    store.dispatch('ResetUser');
    let scopes = {
      scopes: store.getters.config.mslaConfig.scopes
    }
    checkIncodnito().then((is) => {
      if (is) {
        _this.makeToast("Incognito Mode Error", "It typically points to an issue with your browser being in Incognito or Guest Mode.");
        return;
      } else {
        if (_signInType === "Popup") {
          store.dispatch('Authentificate', false);
          this.msalObj.clearCache();

          _this.msalObj.loginPopup(scopes)
            .then(() => {
              if (_this.msalObj.getAccount()) {
                store.dispatch('SaveUserInfo', _this.msalObj.getAccount());
                store.dispatch('SetIsUserBusy', true);
                Promise.all([this.getUser()
                  // ,this.getMasterCourses()
                ]).then(() => {
                  store.dispatch('Authentificate', true);

                  _this.$router.push({ name: 'Home' });
                }).finally(() => {
                  store.dispatch('SetIsUserBusy', false);
                })
              }
            }).catch(function (error) {
              console.log(error);
              _this.makeToast(null, "An problem in login occurs");
            });

        } else if (_signInType === "Redirect") {
          _this.msalObj.loginRedirect(scopes)
        }
      }
    })
  }


  handleRedirectResponse() {
    if (_this.msalObj.getAccount()) {
      store.dispatch('SaveUserInfo', _this.msalObj.getAccount());
      store.dispatch('SetIsUserBusy', true);
      Promise.all([_this.getUser()]).then(() => {
        store.dispatch('Authentificate', true);
        _this.$router.push({ name: 'Home' });
      }).finally(() => {
        store.dispatch('SetIsUserBusy', false);
      }).catch(function (error) {
        console.log(error);
        _this.makeToast(null, "An problem in login occurs");
      });
    }
  }




  getUser() {
    return new Promise((resolve, reject) => {
      this.getToken().then((token) => {
        if (token) {
          Vue.http.get(_this.baseUrl+"/User", { params: {}, headers: _this.getHeaders(token) })
            .then(response => {
              store.dispatch('SaveUserProfile', response && response.body ? response.body : {});
              resolve(response);
            },
              (e) => {
                _this.makeToast(null, "Internal Server Error");
                reject(e)
              }

            )
            .catch(
              (e) => {
                this.makeToast(null, "A problem on server side occurs");
                reject(e);
              })
            }
      });
    });
  }

  solveToken() {
    if (store.getters.isUserBusy) {
      store.dispatch('SetIsUserBusy', false);
    }
    store.dispatch('Authentificate', false);
    this.msalObj.clearCache();
    this.$router.push({ name: 'Landing' });
  }


  getToken() {
    let scopes = {
      scopes: store.getters.config.mslaConfig.scopes
    }

    if (_signInType === "Popup") {
      return this.getTokenPopup(scopes).then(
        r => r ? r.accessToken : null);
    } else
      if (_signInType === "Redirect") {
        return this.getTokenRedirect(scopes).then(
          r => r ? r.accessToken : null);
      }
  }

  getTokenPopup(request) {
    return _this.msalObj.acquireTokenSilent(request)
      .catch(() => {
        console.log("silent token acquisition fails. acquiring token using popup");
        // fallback to interaction when silent call fails
        return _this.msalObj.acquireTokenPopup(request)
          .then(tokenResponse => {
            return tokenResponse;
          }).catch(() => {
            _this.makeToast(null, "Session expired");
            _this.solveToken();
          });
      });
  }

  // This function can be removed if you do not need to support IE
  getTokenRedirect(request) {
    return _this.msalObj.acquireTokenSilent(request)
      .catch(() => {
        _this.makeToast(null, "Session expired");
        _this.msalObj.acquireTokenRedirect(request);
        _this.solveToken();
      });
  }

  logout() {
    store.dispatch('Authentificate', false);
    store.dispatch('ResetUser');
    this.msalObj.clearCache();
    this.msalObj.logout();
    //go to login
    this.$router.push({ name: 'Landing' });
  }

  getHeaders(token) {
    let headers = { 'Accept': 'application/json', 'Access-Control-Allow-Headers': '*' };
    if (token) {
      headers['Authorization'] = 'Bearer ' + token,
        headers['X-CSRF-TOKEN'] = 'TOKEN';
    }
    return headers;
  }
}

async function checkIncodnito() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const { usage, quota } = await navigator.storage.estimate();
    console.log(`Using ${usage} out of ${quota} bytes.`);

    if (quota < 120000000) {
      return true;
    } else {
      return false;
    }
  }
  return null;

}
