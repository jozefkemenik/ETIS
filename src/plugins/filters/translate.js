
export default  function translate(input) {
    let lang = this.getters.languages[this.getters.user.lang];
    if(!lang) {
        return '*'+input;
    }
    var val = lang[input]
    if(!val){
      return '*'+input;
    }  
    return val;
}