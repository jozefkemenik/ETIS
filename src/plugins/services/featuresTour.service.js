
const introJS = require("intro.js");
import ModalService from '@/modal/modal.service';
import AuthSingletonService from "@/auth/auth.singleton.service";
import store from '@/store';
var index = 0;
var _data = [];
var _page = null;
var _that = null;
var _isOpen = false;
var _regEvents = {};
var _elid = ""
class FeaturesTourService {
  constructor() {
    _that = this;
    // data() {
    //   return { introJS: introJS }
    // },



    // init on cofnig loaded
    store.subscribe((mutation) => {
      if (mutation.type == "SetIsEditFt") {
        if (mutation.payload) {
          mainHandler(true);
          //introJS().start();
        } else {
          mainHandler(false);
        }
      }
    });
  }


  loadFromAPI() {
    return AuthSingletonService.httpGet("Feature").then((response) => {
      store.dispatch('SaveUserTutorial', response.body);
      return response.body;
    })
  }

  initFT(page) {
    _page = page;
    if (store.getters.user.tutorial) {
      _data = store.getters.user.tutorial.filter(f => f.page == _page);
    } else {
      _data = [];
    }
  }

  validate() {
    var obj = store.getters.user.profile.feature && JSON.parse(store.getters.user.profile.feature);
    if (!obj || !obj[_page]) {
      this.startFT();
    }
  }


  resetFirstLoginFT(){
      var payLoad = JSON.parse(JSON.stringify(store.getters.user.profile));
      payLoad.feature = null;
      AuthSingletonService.httpPost("user/update",payLoad).then(() => {
        store.dispatch("SetFeature", null);
      });
  }

  startFT() {
    this.setFtToShow();
    var ijs = introJS()

    ijs.onexit((e) => {
      var obj = store.getters.user.profile.feature && JSON.parse(store.getters.user.profile.feature);
      if (!obj) {
        obj = {};
      }
      obj[_page] = true;
      var strObject = JSON.stringify(obj);
      var payLoad = JSON.parse(JSON.stringify(store.getters.user.profile));
      payLoad.feature = strObject;
      AuthSingletonService.httpPost("user/update",payLoad).then(() => {
        store.dispatch("SetFeature", strObject);
      });
    })

    ijs.start();
  }



  setFtToShow() {
    var makeUniq = {};
    _data = _data.filter(f => f.page == _page);
    _data.forEach(d => {
      var elid = d.option;
      if (!makeUniq[elid]) {
        makeUniq[elid] = true;
        var el = document.getElementById(elid);
        if (el) {
          el.setAttribute("data-step", d.step);
          el.setAttribute("data-intro", d.text);
        }
      }
    });
  }
}

function mainHandler(is) {
  var container = document.getElementsByTagName("body")[0];
  container.removeEventListener("mouseover", handler, true);
  container.removeEventListener("mouseleave", handler, true);
  if (is) {
    ///container.onmouseover = container.onmouseout = handler;
    container.addEventListener("mouseover", handler, true);
    container.addEventListener("mouseleave", handler, true)
  }
}

function handler(event) {

  if (event.target.id && event.target.id.startsWith("ft-")) {
    _elid = event.target.id;
    if (event.type == "mouseover") {
      setbg([event.target], "pink");
      event.target.style.cursor = "normal";
      setContextMenuChildren([event.target], true);
    }
    if (event.type == "mouseleave") {
      setbg([event.target], "");
      setContextMenuChildren([event.target], false);
    }
  }
}


function showModal(e) {
  var elid = _elid;
  e.preventDefault();
  e.stopPropagation();
  _data = _data.filter(f => f && f.page == _page);
  var item = _data.find(f => f.option == elid);
  if (!item) {
    var arr = _data.filter(m => m).map(m => m.step)
    var maxstep = Math.max(...arr);
    item = {
      text: "",
      step: maxstep + 1,
    }
  }
  if (!_isOpen) {
    _isOpen = true;
    ModalService.showFTDialog(item, (res) => {
      _isOpen = false;
      if (res) {
        saveFT(elid, res.text, res.step, res.isDelete);
      }
    });
  }
}

function saveFT(elid, text, step, isDelete) {
  var item = _data.find(f => f.option == elid);
  //delete
  if (isDelete && item) {
    AuthSingletonService.httpPost("Feature/delete", item.id ).
      then(() => {
        _data = _data.filter(d => d.option !== elid);
        refreshData();
      });
  }
  else
    //update
    if (item) {
      item.page = _page;
      item.text = text;
      item.step = step;
      //save existing
      AuthSingletonService.httpPost("Feature", item)
        .then(() => {
          refreshData();
        })
    }
    // add new one
    else {
      item = {
        id: 0,
        page: _page,
        text: text,
        step: step,
        option: elid
      }
      // ad new one;
      AuthSingletonService.httpPost("Feature", item).then(response => {
        _data.push(response.body);
        refreshData();
      })
    }
}


function refreshData() {
  var tmp = _data.concat(store.getters.user.tutorial.filter(f => f.page != _page));
  store.dispatch('SaveUserTutorial', tmp);
}


function setbg(children, color, level = 0) {

  children.forEach(c => {
    c.style["background-color"] = color;
      setbg(c.children, color, level + 1);
  });
}



function setContextMenuChildren(children, isReg, level = 0) {
  children.forEach(c => {
    if (isReg) {
      c.tmpid = _elid + "-" + level;
      if (!_regEvents[c.tmpid]) {
        console.log('reg', c.tmpid);
        c.addEventListener("contextmenu", showModal, false);
        _regEvents[c.tmpid] = true;
      }
    } else {
      if (_regEvents[c.tmpid]) {
        console.log('unreg', c.tmpid);
        c.removeEventListener("contextmenu", showModal, false);
        _regEvents[c.tmpid] = false;
      }
    }
    setContextMenuChildren(c.children, isReg, level + 1)
  });
}
export default new FeaturesTourService();