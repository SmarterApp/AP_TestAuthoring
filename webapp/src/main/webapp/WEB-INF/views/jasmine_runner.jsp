<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
  "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <title>Jasmine Spec Runner</title>

  <link rel="shortcut icon" type="image/png" href="resources/jasmine/lib/jasmine-1.3.1/jasmine_favicon.png">
  <link rel="stylesheet" type="text/css" href="resources/jasmine/lib/jasmine-1.3.1/jasmine.css">
  <script type="text/javascript" src="resources/jasmine/lib/jasmine-1.3.1/jasmine.js"></script>
  <script type="text/javascript" src="resources/jasmine/lib/jasmine-1.3.1/jasmine-html.js"></script>

  <!-- include source files here... -->
  <jsp:include page="includes/exploded/js-includes.jsp"></jsp:include>

  <!-- include spec files here... -->
  <script type="text/javascript" src="resources/jasmine/spec/controllers/PublicationFormControllerSpec.js"></script>
  
        
  <script type="text/javascript">
    (function() {
      var jasmineEnv = jasmine.getEnv();
      jasmineEnv.updateInterval = 1000;

      var htmlReporter = new jasmine.HtmlReporter();

      jasmineEnv.addReporter(htmlReporter);

      jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
      };

      var currentWindowOnload = window.onload;

      window.onload = function() {
        if (currentWindowOnload) {
          currentWindowOnload();
        }
        execJasmine();
      };

      function execJasmine() {
        jasmineEnv.execute();
      }

    })();
  </script>

</head>

<body>
</body>
</html>
