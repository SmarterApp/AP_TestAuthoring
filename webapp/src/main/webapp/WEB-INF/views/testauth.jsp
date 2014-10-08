<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>

<!doctype html>
<html data-ng-app="testauth" id="ng-app">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=Edge">
        <title>Test Authoring - Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">
        <jsp:include page="${includePath}/css-includes.jsp"></jsp:include>
        <script src="${testauthBaseUrl}resources/js/nothing.js"></script>
    </head>

    <body>
        <input type="hidden" id="baseUrl" value="${testauthBaseUrl}" />
        <input type="hidden" id="testauthComponentName" value="${testauthComponentName}" />
        <div id="topOfPage"></div>
        <div id="top" class="container" data-ng-controller="UserController">
            <a id="skipNavigation" class="skipToContent" data-ng-click="#mainContent" href="#mainContent" target="_self">Skip to Main Content</a>
            <div class="header" >
                <div class="info">            
                    <ul>
                    <li id="systemsDropdown" data-ng-show="showSettings" tabindex="0" data-ng-focus="expandSystemsDropdown()"><span class="icon_sprite icon_setup2" ></span>Settings
                        <ul data-ng-controller="HomeController">
                            <li><a href="" data-ng-click="go('subjectsearch');" tabindex="0" title="Subjects">Subjects</a></li>
                            <li><a href="" data-ng-click="go('publicationsearch')" tabindex="0" title="Standards Publications">Standards Publications</a></li>
                            <li><a href="" data-ng-click="go('computationRuleSearch')" tabindex="0" title="Computation Rules">Computation Rules</a></li>
                            <li><a href="" data-ng-click="go('itemSelectionAlgorithmSearch')" tabindex="0" title="Item Selection Algorithms">Item Selection Algorithms</a></li>
                        </ul>
                    </li>                    
                        <li>Logged in as: 
                            ${user}
                        </li>
                        <li>Author Test For: 
                            <select tabindex="0" title="Selected Tenant" data-ng-model="selectedTenant" data-ng-change="changeTenant()" data-ng-options="tenant.type + ' - ' + tenant.name for tenant in tenantContainer" tabindex="0" title="Selected Tenant">
                               
                            </select>
                        </li>
                        <li><a href="saml/logout" title="Logout">Logout</a></li>
                    </ul>
                </div>
                <div class="banner" data-ng-controller="HomeController">                           
	                <span class="logo"><a data-ng-click="go('/home')" data-enter="go('/home')" tabindex="1"><img data-ng-src="{{logoImage}}" class="thumbnail" alt="Logo" name="SBAC_logo"></a></span>
	                <div class="title"><h1>Test Authoring</h1></div>
	                <div class="clear"></div>
                </div>
            </div>
        </div>
        
        <div id="mainContent" data-ng-controller="HomeController" class="content" role="main" tabindex="-1">
                <div data-ui-view="testauthview"></div>
        </div>

        <jsp:include page="${includePath}/js-includes.jsp"></jsp:include>

    </body>

</html>
