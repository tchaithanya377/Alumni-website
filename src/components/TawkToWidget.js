import React, { useEffect } from 'react';

const TawkToWidget = () => {
  useEffect(() => {
    // Dynamically add the Tawk.to script
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement('script');
      var s0 = document.getElementsByTagName('script')[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/66e2f612ea492f34bc127645/1i7j92f5k';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  return null; // No UI component is rendered, it just loads the script
};

export default TawkToWidget;
