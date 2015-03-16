/*
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(exports) {


document.addEventListener('polymer-ready', function(e) {
	/*
	var navicon = document.getElementById('navicon');
      var drawerPanel = document.getElementById('drawerPanel');
      navicon.addEventListener('click', function() {
        drawerPanel.togglePanel();
      });
     */

    // custom transformation: scale header's title
    var c_m_title_Style = document.querySelector('.c_m_title').style;
    var subtitle = document.querySelector('.subtitle').style;
    addEventListener('core-header-transform', function(e) {
      var d = e.detail;
      var m = d.height - d.condensedHeight;
      var scale = Math.max(0.44, (m - d.y) / (m / 0.56)  + 0.44);
      c_m_title_Style.transform = c_m_title_Style.webkitTransform = 
          'scale(' + scale + ') translateZ(0)';
      if(scale==0.44){
        subtitle.display="none";
      }else{
        subtitle.display="block";
      }
    });
});


})(window);
