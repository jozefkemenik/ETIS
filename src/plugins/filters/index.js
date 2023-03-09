import translate from './translate';
import store from '@/store';
import moment from 'moment'
const emailRegex = /^(?:[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
export default {
  install(Vue) {
    Vue.filter('translate', translate.bind(store));
    Vue.filter('formatDate', function (value) {
      if (value) {
        return moment(String(value)).format('DD. MM. YYYY - hh:mm')
      }
    });

    Vue.prototype.initStepValues = (items, data) => {
      items.forEach((step) => {
        step.items.forEach((item) => {
          if (data && checkProperty(data, item)) {
            setControlfromControSteps(item, data);
          }
        });
      });
    };


    Vue.prototype.initValues = (items, data) => {
      items.forEach((item) => {
        if (data && checkProperty(data, item)) {
          setControlfromControSteps(item, data);
        }
      });

    };



    function checkProperty(data, item) {
      if (Object.prototype.hasOwnProperty.call(data, item.id))
        return true;

      var ids = item.id.split('|');
      if (ids.length == 2 && (Object.prototype.hasOwnProperty.call(data, ids[0]) || Object.prototype.hasOwnProperty.call(data, ids[1])))
        return true;

    }
    Vue.prototype.checkProperty = checkProperty;



    function setControlfromControSteps(item, data) {
      switch (item.type) {
        case "ryn":
          item.value = data[item.id];
          break;
        case "dd":
          var value = item.items.find(
            (i) => i.value == data[item.id]
          );
          if (value) {
            item.value = value;
          }
          break;
        case "calr":
          console.log
          var ids = item.id.split('|');
          if (ids.length == 2) {
            var minId = ids[0];
            var maxId = ids[1];
            item.value = [data[minId], data[maxId]];
            console.log("calr", item);
          }
          break;
        case "cal":
          break;
        case "text":
          item.value = data[item.id];
          break;
      }
    }

    Vue.prototype.setControlfromControSteps = setControlfromControSteps;
    var counter = 0;
    Vue.prototype.getUniqueID = () => {
      return counter++;
    }



    /*************************** resize window global event ******************************* */
    var resizeFn = [];

    Vue.prototype.subscribeResizeFn = (fn) => {
      var index = resizeFn.length == 0 ? 0 : resizeFn[resizeFn.length - 1].index + 1;
      resizeFn.push({
        index: index,
        fn: fn
      })
      return index;
    }

    Vue.prototype.unsubscribeResizeFn = (fn) => {
      var i = resizeFn.indexOf(resizeFn.find(item => item.fn == fn));
      resizeFn.splice(i, 1);
    }



    function resizeHandler() {
      clearTimeout(window.doit);
      window.doit = setTimeout(() => {
        resizeFn.forEach(i => i.fn());
      }, 100);
    }

    Vue.prototype.triggerResizeHandler = resizeHandler;
    window.addEventListener("resize", resizeHandler);
    /********************************************************** */


    Vue.prototype.makePayLoad = (item) => {
      var payload = {};
      if (item.type == "dd") {
        if (item.value || item.value == 0) {
          payload[item.id] = item.value.value;
          if (item.idText)
            payload[item.idText] = item.value.name;
        }
      } else if (item.type == "ryn") {
        if (item.value == true || item.value == false) {
          payload[item.id] = item.value;
        }
      } else if (item.type == "cal") {
        if (item.iso) {
          payload[item.id] = item.iso;
        }
      } else if (item.type == "calr") {
        var nameMin = Object.keys(item.iso)[0];
        var nameMax = Object.keys(item.iso)[1];
        if (item.iso && item.iso[nameMin]) {
          payload[nameMin] = item.iso[nameMin];
        }
        if (item.iso && item.iso[nameMax]) {
          payload[nameMax] = item.iso[nameMax];
        }
      } else {
        if (item.value || item.value == 0 || item.value == false) {
          payload[item.id] = item.value;
        }
      }
      return payload;
    }


    Vue.prototype.getControlfromControSteps = (items, id) => {
      for (var itemName in items) {
        var item = items[itemName];
        if(item && item.items){
        var res = item.items.find(r2 => r2.id == id);
        if (res) {
          return res;
        }
      }
      }
    };

    Vue.prototype.testEmail=(v)=>{
      return emailRegex.test(v) ;
    }

    Vue.prototype.testText=(v)=>{
      return /^[a-zA-Z]{2,}$/.test(v);
    }

  }
}

Array.prototype.MapToDDControl = function () {
  return this.map((m) => {
    return { name: m.name, value: m.id };
  });
};




