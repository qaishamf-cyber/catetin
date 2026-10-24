<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBVTxVUseiZHIyAtMIjyDmFbUc-OdhYK60",
    authDomain: "catetin-app-b6309.firebaseapp.com",
    projectId: "catetin-app-b6309",
    storageBucket: "catetin-app-b6309.firebasestorage.app",
    messagingSenderId: "9369578442",
    appId: "1:9369578442:web:b2735d703d9225773f7d33",
    measurementId: "G-49K9SLMNG0"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>