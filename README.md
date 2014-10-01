# Welcome to the Test Authoring Component #
The Test Authoring Component is responsible for test (assessment) design, construction, and publishing.

The authenticated and authorized user can define subjects, computation rules (scoring functions), item selection algorithms, and build publication relationships, all of which are then used to author tests (assessments).

Authoring of a test involves construction and configuration of segments, blueprints, test item import, forms, scoring rules, performance levels, reporting measures, and finally going through an approval workflow from users with appropriate authorization to perform approvals. The result is a test specification that can be published to Test Specification Bank (TSB) and made available further downstream for Administration and Registration Tools (ART) and Test Delivery (TDS).

## License ##
This project is licensed under the [AIR Open Source License v1.0](http://www.smarterapp.org/documents/American_Institutes_for_Research_Open_Source_Software_License.pdf).

## Getting Involved ##
We would be happy to receive feedback on its capabilities, problems, or future enhancements:

* For general questions or discussions, please use the [Forum](forum_link_here).
* Use the **Issues** link to file bugs or enhancement requests.
* Feel free to **Fork** this project and develop your changes!

## Usage
### REST Module
The REST module is a deployable WAR file (`test-auth.rest-VERSION.war`) that provides REST endpoints that can be used to access and modify Test Authoring data.

In order to run and use the REST WAR application, several supporting applications must be running and accessible: Program Management (PM), Monitoring and Alerting (MNA), Test Item Bank (TIB), and Test Spec Bank (TSB). In addition, the following Shared Services applications are also required at run time: Permissions, Single Sign On (SSO - OpenAM) Core Standards (CS).

The REST layer setup must be performed before deploying the WAR to a Tomcat-compatible application server. Specifically, virtually all of the start up and run time parameters that the REST module needs are stored in sb11-program-management using its profile property configuration feature.

To execute the REST module and connect to sb11-program-management, run time parameters are passed to the Tomcat server running the Test Authoring REST module:

`-Dspring.profiles.active="progman.client.impl.integration,mna.client.integration"`
This run time parameter specifies which spring profile to use for the program management and monitoring & alerting client interfaces.

`-Dprogman.baseUri="http://sb11-progman-stable.drc-ec2.com/rest/"`
This run time parameter specifies the REST endpoint of a running sb11-program-management instance that will be accessed during REST module startup.

`-Dprogman.locator="testauth,dev,dev_testauth_overrides"` 
This run time parameter specifies the property configuration set stored in the running PM instance which contains all of the needed properties to get this instance of Test Authoring. The third optional value example 

'`dev_testauth_overrides`'
is a useful feature that allows for overrides: in this case, all properties contained in the property group '`testauth`' for level '`dev`' are used by default, except where property group '`dev_testauth_overrides`' has an overriding property value.

**Note:** the Program Management config variables required for this component are found [here:](external_release_docs/installation/testauth-progman-config.txt)

* The REST module contains all of the domain beans used to model the Test Authoring data as well as code used as search beans to create Mongo queries
* The REST module is also responsible for persistence of application data. This includes all business rules, validation, XML configuration, and publishing

During the authoring of a test, items are frequently searched and imported from TIB. However, with more and more items imported into an assessment, the publishing of that assessment can be affected when the number of items gets extremely large, because the XML grows geometrically as more and more metadata about the item metadata is tallied and included. Extremely large item pools also can have negative effects downstream in Test Spec Bank, Administration and Registration Tools (ART), and Test Delivery. To mitigate this, Test Authoring is built to look for and utilize a property saved into Program Management within the testauth profile property configuration, with a key of "testauth.item.count.max.limit" and numeric integer value representing the maximum allowable number of items per assessment (e.g. '30000'). If the property is not found, or is not a valid integer, it will not be used, and the item import has no upper limit.

Once an assessment has garnered all necessary approvals it is transformed into XML and published to TSB. However, during publishing, validation of that XML by use of the related DTD is not performed by default, as it is a very costly operation in both time and memory usage. However, if needed it can be activated during application restart by saving a property into Program Management within the testauth profile property configuration, with a key of "testauth.dtd.validation" and value of "true".

### Webapp Module
The Webapp module is a deployable WAR file (`test-auth.webapp-VERSION.war`) that provides the rich UI for Test Authoring functionality. As with several other sb11 applications, this is a single-page application (SPA) built using AngularJS for a robust, reactive user interface. The Webapp module uses the REST module for all data access, but this is a runtime dependency through a REST endpoint and not a direct code dependency.

## Build
These are the steps that should be taken in order to build all of the Test Authoring related artifacts.

### Pre-Dependencies
* Mongo 2.0 or higher
* Tomcat 6 or higher
* Maven (mvn) version 3.X or higher installed
* Java 7
* Access to sb11-shared-build repository
* Access to sb11-shared-code repository
* Access to sb11-shared-security repository
* Access to sb11-rest-api-generator repository
* Access to sb11-program-management repository
* Access to sb11-monitoring-alerting repository
* Access to sb11-test-spec-bank repository
* Access to sb11-test-auth repository

### Build order

See the Build Sequence Diagram at blob/master/designPics/build%20sequence.png.

## Dependencies
Test Authoring has a number of direct dependencies that are necessary for it to function.  These dependencies are already built into the Maven POM files.

### Compile Time Dependencies
* Apache Commons IO
* Apache Commons Beanutils
* Jackson Datatype Joda
* Google Guava
* Hibernate Validator
* Apache Commons File Upload
* Jasypt
* SB11 Shared Code
* SB11 Shared Security
* Logback
* SLF4J
* JCL over SLF4J
* Spring Core
* Spring Beans
* Spring Data MongoDb
* Mongo Data Driver
* Spring Context
* Spring WebMVC
* Spring Web
* Spring Aspects
* AspectJ RT
* AspectJ Weaver
* Javax Inject
* Apache HttpClient
* JSTL API
* Apache Commons Lang
* Joda Time
* Jackson Core
* Jackson Annotations
* Jackson Databind
* SB11 REST API Generator
* JSTL

### Test Dependencies
* Spring Test
* Hamcrest
* JUnit 4
* Mockito
* Fongo
* Podam
* Log4J over SLF4J

### Runtime Dependencies
* Servlet API
* Persistence API