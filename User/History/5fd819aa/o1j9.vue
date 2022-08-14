<template>
  <div class="hello">
    <!--  -->
  </div>
</template>

<script>
import qiniu from 'qiniu'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
   name() {
  var mac = new qiniu.auth.digest.Mac(ak, sk);
  var options = {
    scope: bucketname,
    expires: 7200,
  };
  var putPolicy = new qiniu.rs.PutPolicy(options);
  var uploadToken = putPolicy.uploadToken(mac);
  console.log(
    "%c [ uploadToken ]-89",
    "font-size:13px; background:#0095FF; color:white;",
    uploadToken
  );
}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
