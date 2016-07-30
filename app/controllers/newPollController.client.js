'use strict';

(function(){
   var newFieldBtn = document.querySelector(".btn-newfield");
   var options = 2;

   newFieldBtn.addEventListener("click", function() {
      options++;
      var optStr = options.toString();

      var btn = document.createElement("INPUT");
      var br = document.createElement("BR")
      setAttrsOnElem(btn, "class", "form-control");
      setAttrsOnElem(btn, "type", "text");
      setAttrsOnElem(btn, "name", "option" + optStr);
      setAttrsOnElem(btn, "placeholder", "Option " + optStr);
      document.querySelector("#form-hook").appendChild(btn)
      document.querySelector("#form-hook").appendChild(br)

   })

   function setAttrsOnElem (elem, attr, val) {
      var att = document.createAttribute(attr);
      att.value = val;
      elem.setAttributeNode(att)
   }

})();
