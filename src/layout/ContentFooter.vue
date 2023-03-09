<template>
  <footer class="footer">
    <div class="container-fluid">
      <nav>
        <ul class="footer-menu">
          <li>
            <!-- <router-link :to="{path:'/admin'}">Dashboard</router-link> -->
          </li>
        </ul>
      </nav>
      <div class="copyright text-center">
        &copy; Coded with
        <i class="fa fa-heart heart"></i> by
        <a href="https://binarcode.com" target="_blank">BinarCode</a>.
        Designed by <a href="https://www.creative-tim.com/?ref=pdf-vuejs" target="_blank">Creative Tim</a>.
      </div>
    </div>
  </footer>
</template>
<script>
  export default {}

</script>
<style>
.footer {
  background-attachment: fixed;
  position: relative;
  line-height: 20px;
}
.footer nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  font-weight: normal;
}
.footer nav ul li {
  display: inline-block;
  padding: 10px 15px;
  margin: 15px 3px;
  line-height: 20px;
  text-align: center;
}
.footer nav ul a:not(.btn) {
  color: #66615b;
  display: block;
  margin-bottom: 3px;
}
.footer nav ul a:not(.btn):focus, .footer nav ul a:not(.btn):hover {
  color: #484541;
}
.footer .copyright {
  color: #66615b;
  padding: 10px 15px;
  font-size: 14px;
  margin: 15px 3px;
  line-height: 20px;
  white-space: nowrap;
  text-align: center;
}
.footer .heart {
  color: #EB5E28;
}

.footer-black {
  background-color: #252422;
  color: #cfcfca;
}
.footer-black .links ul a:not(.btn) {
  color: #A49E9E;
}
.footer-black .links ul a:not(.btn):hover, .footer-black .links ul a:not(.btn):focus {
  color: #F1EAE0;
}
.footer-black .copyright {
  color: #66615b;
}
.footer-black .copyright ul > li a:not(.btn) {
  color: #66615b;
}
.footer-black hr {
  border-color: #66615b;
}

.footer-transparent {
  background-size: cover;
  position: relative;
  background-color: transparent;
}
.footer-transparent .container {
  z-index: 2;
  position: relative;
}
.footer-transparent hr {
  border-color: #A49E9E;
}
.footer-transparent .copyright {
  color: #A49E9E;
}
.footer-transparent .copyright ul > li a:not(.btn) {
  color: #A49E9E;
}

</style>
