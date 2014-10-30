// global variables 
// TODO is there a better way to inject these?
var baseUrl =  '';
var testauthComponentName =  '';

if(document.getElementById('baseUrl')){
    baseUrl = document.getElementById('baseUrl').value;
}
if(document.getElementById('testauthComponentName')){
    testauthComponentName = document.getElementById('testauthComponentName').value;
}
// end global variables
function safeApply($scope, fn) {
    ($scope.$$phase || $scope.$root.$$phase) ? fn() : $scope.$apply(fn);
}


var testauth = angular.module('testauth', ['ui.state','ui.bootstrap', 'ngCookies','ui.select2','xeditable','ui.sortable', 'blueimp.fileupload']);

testauth.run(function($rootScope, editableOptions) {
	editableOptions.theme = 'bs2';
	var pageLoad = false;
		  
    $rootScope.$on('$locationChangeSuccess', function() {
    	var returnUrl = sessionStorage.getItem("returnUrl");
    	if(pageLoad && (returnUrl == null || returnUrl == undefined || returnUrl == "null" || returnUrl !== document.URL)) {
	    	sessionStorage.setItem("returnUrl", document.URL);
    	} else {
    		pageLoad = true;
    	}
    });
});

testauth.config(['$stateProvider','$urlRouterProvider','$provide','$httpProvider', function($stateProvider, $urlRouterProvider, $provide, $httpProvider) {
    // necessary fix to get select2 <input> tags to work
    // taken from: https://github.com/angular/angular.js/issues/5219
    $provide.decorator('inputDirective', ['$delegate', function($delegate) {
        angular.forEach($delegate, function(linkDirective) {
            var _compile = linkDirective.compile;
            linkDirective.compile = function(element, attrs) {
                if (!attrs.uiSelect2) {
                    return _compile.apply(this, arguments);
                }
            };
        });
        return $delegate;
    }]);

  //register the interceptor as a service
  $provide.factory('myHttpInterceptor', function($q) {
		return {
	     'responseError': function(rejection) {
	    	if(rejection.status == 0){
	    		location.reload();
	    	}
	 	    return $q.reject(rejection);
	      }
	    };
  	});
  $httpProvider.interceptors.push('myHttpInterceptor');
  
$urlRouterProvider.when('/assessmenthome/:assessmentId', '/assessmenthome/:assessmentId/edit');

$stateProvider
.state('home', {
        url: "/home", 
        resolve: {
        	navLinks :homeSearchNavResolver
        }, 
        views: {
            "testauthview": {
                templateUrl: 'resources/testauth/partials/home.html',
                controller: 'HomeController'
            }
        }
	}).state('/', {
	    url: "/", 
	    resolve: {
	    	navLinks :homeSearchNavResolver
	    }, 
	    views: {
	        "testauthview": {
	        	templateUrl: 'resources/testauth/partials/home.html',
	            controller: 'HomeController'
	        }
	    }
    }).state('homePostTest', {
        url: "/homePostTest", 
        resolve: {
        	navLinks :homeSearchNavResolver
        }, 
        views: {
            "testauthview": {
                templateUrl: 'resources/testauth/partials/home-post-test.html',
                controller: 'HomeController'
            }
        }
    }).state('noTenant', {
        url: "/subscription-needed", 
        resolve: {
        	navLinks :noNavResolver
        }, 
        views: {
            "testauthview": {
                templateUrl: 'resources/testauth/partials/no-tenant.html'
            }
        }
    }).state('401', {
        url: "/login-error", 
        resolve: {
        	navLinks :noNavResolver
        }, 
        views: {
            "testauthview": {
                templateUrl: 'resources/testauth/partials/error_401.html'
            }
        }
    }).state('assessmentsearch', {
        url: "/assessmentsearch", 
        resolve: {
            navLinks :homeSearchNavResolver,
            loadedGrades: allGradeResolver,
            loadedAssessmentTypes: assessmentTypeResolver,
            loadedAssessmentStatuses: assessmentStatusResolver
        }, 
        views: {
            "testauthview": {
                templateUrl: 'resources/testauth/partials/assessment-search.html',
                controller: 'AssessmentSearchController'
            }
        }
    }).state('assessmenthome', {
        url: "/assessmenthome/{assessmentId}", 
        resolve: {
            navLinks :assessmentEditNavResolver,
            loadedData:testResolverWithCache,
        }, 
        views: {
            "testauthview": {
                templateUrl: 'resources/testauth/partials/assessment-home.html',
                controller: 'AssessmentHomeController'
            }
        }
    }).state('assessmenthome.detailhome', {
        url: "/detailshome",
        resolve: {
        },
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-details-home.html',
                controller: 'AssessmentDetailsHomeController'
            }
        }
    }).state('assessmenthome.detailhome.edit', {
        url: "/edit",
        resolve: {
        	loadedData:testResolverWithCache
        },
        views: {
            "details-home-view": {
                templateUrl: 'resources/testauth/partials/assessment-edit.html',
                controller: 'AssessmentEditController'
            }
        }
	}).state('assessmenthome.detailhome.summary', {
        url: "/assessmentsummary",
        resolve: {
        	loadedData:testResolverWithCache,
        	segmentListData:segmentListResolver
        },
        views: {
            "details-home-view": {
                templateUrl: 'resources/testauth/partials/assessment-summary.html',
                controller: 'AssessmentSummaryController'
            }
        }
    }).state('assessmentedit', {
        url: "/assessmentedit/{assessmentId}", 
        resolve: {
        	navLinks :assessmentEditNavResolver,
        	loadedData:testResolverWithCache
        }, 
        views: {
            "testauthview": {
                templateUrl: 'resources/testauth/partials/assessment-edit.html',
                controller: 'AssessmentEditController'
            }
        }
    }).state('assessmenthome.segment', {
        url: "/segment",
        resolve: {
            segmentList:segmentListResolver
        }, 
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-segments.html',
                controller: 'AssessmentSegmentController'
            }
        }
    })
    .state('assessmenthome.segmentedit', {
        url: "/segment/edit/{segmentId}", 
        resolve: {
            loadedSegment:segmentResolver,
            segmentList:segmentListResolver,
            algorithmList:algorithmListResolver
        }, 
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-segments-edit.html',
                controller: 'AssessmentSegmentEditController'
            }
        }
    }).state('assessmenthome.blueprint', {
        url: "/blueprint",
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-blueprints.html',
                controller: 'AssessmentBlueprintController'
            }
        }
    }).state('assessmenthome.itempool', {
        url: "/itempool",
        resolve: {
            segmentListData:segmentListResolver
        },
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-item-pool.html',
                controller: 'AssessmentItemPoolController'
            }
        }
    }).state('assessmenthome.itempool.items', {
        url: "/items",
        resolve: {
            segmentListData:segmentListResolver,
        },
        views: {
            "item-pool-view": {
                templateUrl: 'resources/testauth/partials/assessment-items.html',
                controller: 'AssessmentItemsController'
            }
        }
    }).state('assessmenthome.itempool.groups', {
        url: "/itemgroups",
        resolve: {
            formPartitionListData : function(){return {};},
            segmentListData:segmentListResolver,
            pageDetails: function(){return {locationType:'SEGMENT'};}
        },
        views: {
            "item-pool-view": {
                templateUrl: 'resources/testauth/partials/item-group-search.html',
                controller: 'ItemGroupSearchController'
            }
        }
    })
    .state('assessmenthome.itempool.sort', {
        url: "/segmentSort",
        resolve: {
        	segmentListData:segmentListResolver
        },
        views: {
            "item-pool-view": {
                templateUrl: 'resources/testauth/partials/assessment-segment-items-sort.html',
                controller: 'AssessmentSegmentItemSortController'
            }
        }
    })
    .state('assessmenthome.itempool.groupsForm', {
        url: "/itemGroupForm/{itemGroupId}", 
        resolve: {
        	navLinks :homeSearchNavResolver,
        	loadedItemGroup:itemGroupResolver,
        	formPartitionListData : function(){return {};},
            segmentListData:segmentListResolver,
        	pageDetails: function(){return {locationType:'SEGMENT'};}
        }, 
        views: {
            "item-pool-view": {
                templateUrl: 'resources/testauth/partials/item-group-segment-form.html',
                controller: 'ItemGroupFormController'
            }
        }
    }).state('assessmenthome.itempool.enemy', {
        url: "/enemy",
        resolve: {
            loadedEnemyTypes:enemyTypeResolver
        },
        views: {
            "item-pool-view": {
                templateUrl: 'resources/testauth/partials/assessment-enemies.html',
                controller: 'AssessmentEnemyController'
            }
        }
    }).state('assessmenthome.itempool.summary', {
	    url: "/itempoolsummary",
	    resolve: {
	        segmentListData:segmentListResolver
	    },        
	    views: {
	        "item-pool-view": {
	            templateUrl: 'resources/testauth/partials/assessment-itempool-summary.html',
	            controller: 'AssessmentItemSummaryController'
	        }
	    }
    }).state('assessmenthome.itempool.enemyedit', {
        url: "/enemy/edit/{enemyId}",
        resolve: {
            loadedEnemy:enemyResolver,
            loadedEnemyTypes:enemyTypeResolver
        },
        views: {
            "item-pool-view": {
                templateUrl: 'resources/testauth/partials/assessment-enemies-edit.html',
                controller: 'AssessmentEnemyEditController'
            }
        }
    }).state('assessmenthome.affinityGroups', {
    	url: "/affinityGroups",
    	resolve: {
    		loadedSegments: segmentListResolver
    	},
    	views: {
    		"assessment-tab-view": {
    			templateUrl: 'resources/testauth/partials/assessment-affinity-groups.html',
    			controller: 'AssessmentAffinityGroupsController'
    		}
    	}
    }).state('assessmenthome.affinityGroupForm', {
    	url: "/affinityGroupForm/{affinityGroupId}",
    	resolve: {
    		loadedAffinityGroup: affinityGroupResolver
    	},
    	views: {
    		"assessment-tab-view": {
    			templateUrl: 'resources/testauth/partials/assessment-affinity-group-form.html',
    			controller: 'AssessmentAffinityGroupFormController'
    		}
    	}
    }).state('assessmenthome.affinityGroupItems', {
    	url: "/affinityGroupItems/{affinityGroupId}/{segmentId}",
    	resolve: {
    		loadedAffinityGroup: affinityGroupResolver,
    		loadedSegment: segmentResolver
    	},
    	views: {
    		"assessment-tab-view": {
    			templateUrl: 'resources/testauth/partials/assessment-affinity-group-items.html',
    			controller: 'AssessmentAffinityGroupItemController'
    		}
    	}
    }).state('assessmenthome.formhome', {
        url: "/formshome",
        resolve: {
        },
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-forms-home.html',
                controller: 'AssessmentFormsHomeController'
            }
        }
    }).state('assessmenthome.formhome.formsearch', {
        url: "/search",
        views: {
            "forms-home-view": {
                templateUrl: 'resources/testauth/partials/assessment-forms-search.html',
                controller: 'AssessmentFormController'
            }
        }
    }).state('assessmenthome.formhome.formedit', {
        url: "/edit/{formId}",
        resolve: {
            loadedForm:formResolver,
            loadedLanguages:formLanguagesResolver
        },
        views: {
            "forms-home-view": {
                templateUrl: 'resources/testauth/partials/assessment-form-edit.html',
                controller: 'AssessmentFormEditController'
            }
        }
    }).state('assessmenthome.formhome.partitionsearch', {
        url: "/partitionsearch",
        resolve: {
            loadedForm:formResolver,
            loadedFormList:formListResolver
        },
        views: {
            "forms-home-view": {
                templateUrl: 'resources/testauth/partials/assessment-formpartitions.html',
                controller: 'AssessmentFormPartitionController'
            }
        }
    }).state('assessmenthome.formhome.partitionedit', {
        url: "/partition/{formPartitionId}/edit",
        resolve: {
            loadedFormList:formListResolver,
            loadedFormPartition:formPartitionResolver,
            segmentList:segmentListResolver
        },
        views: {
            "forms-home-view": {
                templateUrl: 'resources/testauth/partials/assessment-formpartition-edit.html',
                controller: 'AssessmentFormPartitionEditController'
            }
        }
    }).state('assessmenthome.formhome.items', {
        url: "/items",
        resolve: {
            formPartitionListData : formPartitionListResolver
        },
        views: {
            "forms-home-view": {
                templateUrl: 'resources/testauth/partials/assessment-form-items.html',
                controller: 'AssessmentFormItemController'
            }
        }
    })
    .state('assessmenthome.formhome.sorting', {
        url: "/partition/sort",
        resolve: {
            formPartitionListData : formPartitionListResolver
        },
        views: {
            "forms-home-view": {
                templateUrl: 'resources/testauth/partials/assessment-form-items-sort.html',
                controller: 'AssessmentFormItemSortController'
            }
        }
    }).state('assessmenthome.formhome.itemgroups', {
        url: "/formitemgroups",
        resolve: {
            formPartitionListData : formPartitionListResolver,
            segmentListData:function(){return {};},
            pageDetails: function(){return {locationType:'FORM_PARTITION'};}
        },
        views: {
            "forms-home-view": {
                templateUrl: 'resources/testauth/partials/item-group-search.html',
                controller: 'ItemGroupSearchController'
            }
        }
    }).state('assessmenthome.formhome.itemgroupForm', {
        url: "/itemGroupForm/{itemGroupId}", 
        resolve: {
        	navLinks :homeSearchNavResolver,
        	loadedItemGroup:itemGroupResolver,
        	formPartitionListData : formPartitionListResolver,
            segmentListData:function(){return {};},
        	pageDetails: function(){return {locationType:'FORM_PARTITION'};}
        }, 
        views: {
            "forms-home-view": {
                templateUrl: 'resources/testauth/partials/item-group-partition-form.html',
                controller: 'ItemGroupFormController'
            }
        }
    }).state('assessmenthome.masterpool', {
        url: "/masterpool",
        resolve: {},
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-master-pool.html',
                controller: 'AssessmentMasterPoolController'
            }
        }
    }).state('assessmenthome.masterpool.items', {
        url: "/items",
        resolve: {
            segmentListData:segmentListResolver,
            formPartitionListData : formPartitionListResolver,
            itemGroupListData : itemGroupListResolver,
            affinityGroupListData : affinityGroupListResolver,
            itemMetadataKeyData : itemMetadataKeysResolver
        },
        views: {
            "master-pool-view": {
                templateUrl: 'resources/testauth/partials/assessment-master-pool-items.html',
                controller: 'AssessmentMasterPoolItemsController'
            }
        }
    }).state('assessmenthome.masterpool.summary', {
        url: "/affinitygroupsummary",
        resolve: {
            loadedSegments:segmentListResolver
        },        
        views: {
            "master-pool-view": {
                templateUrl: 'resources/testauth/partials/assessment-master-pool-summary.html',
                controller: 'AssessmentMasterPoolSummaryController'
            }
        }
    }).state('assessmenthome.scoringrule', {
        url: "/scoringRule",
        resolve: {
            loadedBlueprintReferenceTypes:blueprintReferenceTypeResolver,
            loadedBlueprintReferences:scoringRuleBlueprintReferenceResolver
        },
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-scoringrules.html',
                controller: 'AssessmentScoringRuleController'
            }
        }
    }).state('assessmenthome.scoringruleedit', {
        url: "/scoringRule/edit/{scoringRuleId}",
        resolve: {
            loadedScoringRule:scoringRuleResolver,
            loadedBlueprintReferenceTypes:blueprintReferenceTypeResolver,
            loadedBlueprintDenotationTypes:blueprintDenotationTypeResolver,
            scoringRuleList:scoringRuleListResolver
        }, 
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-scoringrule-edit.html',
                controller: 'AssessmentScoringRuleEditController'
            }
        }
    }).state('assessmenthome.performancelevel', {
        url: "/performancelevel",
        resolve: {
            loadedBlueprintReferenceTypes:blueprintReferenceTypeResolver,
            loadedBlueprintReferences:performanceLevelBlueprintReferenceResolver
        },
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-performancelevels.html',
                controller: 'AssessmentPerformanceLevelController'
            }
        }
    }).state('assessmenthome.performanceleveledit', {
        url: "/performancelevel/edit/{performanceLevelId}",
        resolve: {
            loadedPerformanceLevel:performanceLevelResolver,
            loadedBlueprintReferenceTypes:blueprintReferenceTypeResolver
        }, 
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-performancelevels-edit.html',
                controller: 'AssessmentPerformanceLevelEditController'
            }
        }
    }).state('assessmenthome.reportingmeasures', {
        url: "/reportingmeasure",
        resolve: {
            loadedBlueprintReferenceTypes:blueprintReferenceTypeResolver,
            scoringRuleList:scoringRuleListResolver
        },
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-reportingmeasures.html',
                controller: 'AssessmentReportingMeasureController'
            }
        }
    }).state('assessmenthome.reportingmeasureedit', {
        url: "/reportingmeasure/edit/{reportingMeasureId}",
        resolve: {
            loadedReportingMeasure:reportingMeasureResolver,
            loadedReportingMeasureScoringRule:reportingMeasureScoringRuleResolver
        },
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-reportingmeasure-edit.html',
                controller: 'AssessmentReportingMeasureEditController'
            }
        }
	}).state('assessmenthome.publishinghome', {
        url: "/publishinghome",
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-publishing-home.html',
                controller: 'AssessmentPublishingHomeController'
            }
        }
    }).state('assessmenthome.publishinghome.publishing', {
        url: "/publishing",
        resolve: {
        	loadedPublishingValidity:checkPublishingValidityPublishingRecordResolver
        },
        views: {
            "publishing-home-view": {
                templateUrl: 'resources/testauth/partials/assessment-publishing.html',
                controller: 'AssessmentPublishingController'
            }
        }
    }).state('assessmenthome.publishinghome.itemmetadataconfig', {
        url: "/itemmetadataconfig",
        resolve: {
        	loadedItemMetadataConfig:itemMetadataConfigResolver,
        	itemMetadataKeys:itemMetadataKeysResolver
        },
        views: {
            "publishing-home-view": {
                templateUrl: 'resources/testauth/partials/assessment-itemmetadataconfig.html',
                controller: 'AssessmentItemMetadataConfigController'
            }
        }
    }).state('assessmenthome.publishinghome.history', {
        url: "/history",
        views: {
            "publishing-home-view": {
                templateUrl: 'resources/testauth/partials/assessment-approval-history.html',
                controller: 'AssessmentApprovalHistoryController'
            }
        }
    }).state('assessmenthome.simulation', {
        url: "/simulation",
        resolve: {
        	loadedRecord:recordResolver
        },
        views: {
            "assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-simulation-record.html',
                controller: 'AssessmentSimulationRecordController'
            }
        }
    }).state('assessmenthome.psychometric', {
        url: "/psychometric",
        resolve: {
        	loadedPublishingRecord:currentPublishingRecordResolver,
        	loadedRecord:recordResolver
        },
        views: {
        	"assessment-tab-view": {
            	templateUrl: 'resources/testauth/partials/assessment-psychometric-record.html',
                controller: 'AssessmentPsychometricRecordController'
            }
        }
    }).state('assessmenthome.simulationForm', {
        url: "/simulationform/{fileGroupId}/{formAction}",
        resolve: {
        	loadedRecord:recordResolver,
        	loadedFileGroup:fileGroupResolver,
        	formAction:formActionResolver
        },
        views: {
        	"assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-simulation-record-edit.html',
                controller: 'AssessmentSimulationRecordEditController'
            }
        }
    }).state('assessmenthome.psychometricForm', {
        url: "/psychometricform/{fileGroupId}/{formAction}",
        resolve: {
        	loadedPublishingRecord:currentPublishingRecordResolver,
        	loadedRecord:recordResolver,
        	loadedFileGroup:fileGroupResolver,
        	formAction:formActionResolver
        },
        views: {
        	"assessment-tab-view": {
                templateUrl: 'resources/testauth/partials/assessment-psychometric-record-edit.html',
                controller: 'AssessmentPsychometricRecordEditController'
            }
        }
    }).state('publicationsearch', {
        url: "/publicationsearch", 
        resolve: {
        	navLinks :homeSearchNavResolver,
        }, 
        views: {
            "testauthview": {
                templateUrl: 'resources/testauth/partials/publication-search.html',
                controller: 'PublicationSearchController'
            }
        }
    }).state('publicationform', {
        url: "/publicationform/{publicationId}/{formAction}", 
        resolve: {
        	navLinks :publicationEditNavResolver,
        	loadedData:publicationResolver,
            formAction:formActionResolver
        }, 
        views: {
            "testauthview": {
                templateUrl: 'resources/testauth/partials/publication-form.html',
                controller: 'PublicationFormController'
            }
        }
    }).state('subjectsearch', {
        url: "/subjectsearch", 
        resolve: {
            navLinks :homeSearchNavResolver,
        }, 
        views: {
            "testauthview": {
                templateUrl: 'resources/testauth/partials/subject-search.html',
                controller: 'SubjectSearchController'
            }
        }
    }).state('subjectForm', {
        url: "/subjectform/{subjectId}/{formAction}", 
        resolve: {
            navLinks :subjectEditNavResolver,
            loadedData:subjectResolver,
            formAction:formActionResolver
        }, 
        views: {
            "testauthview": {
                templateUrl: 'resources/testauth/partials/subject-form.html',
                controller: 'SubjectFormController'
            }
        }
    }).state('computationRuleSearch', {
        url: "/computationRuleSearch", 
        resolve: {
        	navLinks :homeSearchNavResolver
        }, 
        views: {
            "testauthview": {
                templateUrl: 'resources/testauth/partials/computation-rule-search.html',
                controller: 'ComputationRuleSearchController'
            }
        }
    }).state('computationRuleForm', {
        url: "/computationRuleForm/{computationRuleId}", 
        resolve: {
            navLinks :computationRuleEditNavResolver,
            loadedData:computationRuleResolver
        }, 
        views: {
            "testauthview": {
                templateUrl: 'resources/testauth/partials/computation-rule-form.html',
                controller: 'ComputationRuleFormController'
            }
        }
	}).state('itemSelectionAlgorithmSearch', {
	    url: "/itemSelectionAlgorithmSearch", 
	    resolve: {
	    	navLinks :homeSearchNavResolver,
	    }, 
	    views: {
	        "testauthview": {
	            templateUrl: 'resources/testauth/partials/item-selection-algorithm-search.html',
	            controller: 'ItemSelectionAlgorithmSearchController'
	        }
	    }
	}).state('itemSelectionAlgorithmForm', {
	    url: "/itemSelectionAlgorithmForm/{itemSelectionAlgorithmId}", 
	    resolve: {
	        navLinks :itemSelectionAlgorithmEditNavResolver,
	        loadedData:itemSelectionAlgorithmResolver
	    }, 
	    views: {
	        "testauthview": {
	            templateUrl: 'resources/testauth/partials/item-selection-algorithm-form.html',
	            controller: 'ItemSelectionAlgorithmFormController'
	        }
	    }
    });

}]).run(['$state', function ($state) {
   $state.transitionTo('home');
}]);

testauth.filter('joinBy', function () {
    return function (input,delimiter) {
        return (input || []).join(delimiter || ',');
    };
});

testauth.filter('findItemById', function() {
	return function(input, newItem) {
		for (var i = 0; i < input.length; i++) {
			if(input[i].tibIdentifier == newItem.tibIdentifier) {
				return input[i];
			}
		}
	return null;
	};
});

testauth.filter('reverse', function() {
	return function(items) {
		if(items && items.length > 0) {
			return items.slice().reverse();
		}
		return null;
	};
});

testauth.filter('fixedFormSegments', function() {
	return function(segments, value) {
		var filtered = [];
        angular.forEach(segments, function (segment) {
        	if(segment.itemSelectionAlgorithm && segment.itemSelectionAlgorithm.itemSelectionAlgorithmType == "Fixed Form" ){
        		filtered.push(segment);
    		};
        });
        return filtered; 
	};
});

testauth.filter('adaptiveSegments', function() {
	return function(segments, value) {
		var filtered = [];
        angular.forEach(segments, function (segment) {
        	if(segment.itemSelectionAlgorithm && 
        	        (segment.itemSelectionAlgorithm.itemSelectionAlgorithmType == "Adaptive" || 
        	         segment.itemSelectionAlgorithm.itemSelectionAlgorithmType == "Field Test")) {
        		filtered.push(segment);
    		};
        });
        return filtered; 
	};
});

testauth.filter('formPartitionCount', function() {
	return function(forms, value) {
		var filtered = 0;
        angular.forEach(forms, function (form) {
        	filtered += form.partitions.length;
        });
        return filtered; 
	};
});

testauth.filter('englishForm', function() {
	return function(forms, value) {
		var filtered = [];
        angular.forEach(forms, function (form) {
        	if(form.language == "eng" ){
        		filtered.push(form);
    		};
        });
        return filtered; 
	};
});

testauth.filter('nonEnglishForm', function() {
	return function(forms, value) {
		var filtered = [];
        angular.forEach(forms, function (form) {
        	if(form.language != "eng" ){
        		filtered.push(form);
    		};
        });
        return filtered; 
	};
});

testauth.filter('assessmentBpReference', function() {
	return function(objects, value) {
		var filtered = [];
        angular.forEach(objects, function (object) {
        	if(object.blueprintReferenceType == "Assessment" ){
        		filtered.push(object);
    		};
        });
        return filtered; 
	};
});

testauth.filter('segmentBpReference', function() {
	return function(objects, value) {
		var filtered = [];
        angular.forEach(objects, function (object) {
        	if(object.blueprintReferenceType == "Segment" ){
        		filtered.push(object);
    		};
        });
        return filtered; 
	};
});

testauth.filter('affinityBpReference', function() {
	return function(objects, value) {
		var filtered = [];
        angular.forEach(objects, function (object) {
        	if(object.blueprintReferenceType == "Affinity Group" ){
        		filtered.push(object);
    		};
        });
        return filtered; 
	};
});

testauth.filter('standardBpReference', function() {
	return function(objects, value) {
		var filtered = [];
        angular.forEach(objects, function (object) {
        	if(object.blueprintReferenceType == "Blueprint Standard" ){
        		filtered.push(object);
    		};
        });
        return filtered; 
	};
});

//Added Resolver code for Navigation
var homeSearchNavResolver =  ['$stateParams','NavigationService', function ($stateParams, NavigationService) {
	NavigationService.clearMe();
	NavigationService.addNavLink("Home","home", {});
}];

var noNavResolver =  ['$stateParams','NavigationService', function ($stateParams, NavigationService) {
	NavigationService.clearMe();
}];

var subjectEditNavResolver =  ['$stateParams','NavigationService', function ($stateParams, NavigationService) {
    NavigationService.clearMe();
    NavigationService.addNavLink("Home","home", {});
    NavigationService.addNavLink("Subject Search","subjectSearch", {});
}];

var assessmentEditNavResolver =  ['$stateParams','NavigationService', function ($stateParams, NavigationService) {
    NavigationService.clearMe();
    NavigationService.addNavLink("Home","home", {});
    NavigationService.addNavLink("Assessment Search","assessmentsearch", {});
}];

var publicationEditNavResolver =  ['$stateParams','NavigationService', function ($stateParams, NavigationService) {
    NavigationService.clearMe();
    NavigationService.addNavLink("Home","home", {});
    NavigationService.addNavLink("Publication Search","publicationsearch", {});
}];

var computationRuleEditNavResolver =  ['$stateParams','NavigationService', function ($stateParams, NavigationService) {
    NavigationService.clearMe();
    NavigationService.addNavLink("Home","home", {});
    NavigationService.addNavLink("Scoring Function Search","computationRuleSearch", {});
}];

var itemSelectionAlgorithmEditNavResolver =  ['$stateParams','NavigationService', function ($stateParams, NavigationService) {
    NavigationService.clearMe();
    NavigationService.addNavLink("Home","home", {});
    NavigationService.addNavLink("Item Selection Algorithm Search","itemSelectionAlgorithmSearch", {});
}];

var testResolver = ['$stateParams','AssessmentService', function ($stateParams, AssessmentService) {
	return AssessmentService.getCache();
}];

var testResolverWithCache = ['$stateParams','AssessmentService', function ($stateParams, AssessmentService) {	
    if($stateParams.assessmentId) {    	   	
    	AssessmentService.removeCache();
    	return AssessmentService.findById($stateParams.assessmentId).then(function(loadedData) {
    		AssessmentService.updateCache(loadedData.data);
    		return loadedData;
		});
    } 
    return { data:{}, errors:[] };
}];

var assessmentTypeResolver = ['$stateParams','AssessmentService', function ($stateParams, AssessmentService) {
    return AssessmentService.getAssessmentTypes();
}];

var assessmentStatusResolver = ['$stateParams','PublishingRecordService', function ($stateParams, PublishingRecordService) {
    return PublishingRecordService.getPublishingStatuses();
}];

var segmentResolver = ['$stateParams','SegmentService', function ($stateParams, SegmentService) {
    if($stateParams.segmentId) {
        return SegmentService.findById($stateParams.segmentId); 
    }
    return { data:{}, errors:[] };
}];

var segmentListResolver = ['$stateParams','SegmentService', function ($stateParams, SegmentService) {
    if ($stateParams.assessmentId) {
        return SegmentService.search({"assessmentId": $stateParams.assessmentId, "pageSize": 100, "sortKey":"position"});
    }
    return { data:{}, errors:[] };
}];

var standardKeyResolver = ['$stateParams', function ($stateParams) {
    if($stateParams.standardKey) {
        return { data:$stateParams.standardKey, errors:[] }; 
    }
    return { data:{}, errors:[] };
}];

var allGradeResolver = ['$stateParams','CoreStandardsService', function ($stateParams, CoreStandardsService) {
    return CoreStandardsService.search({"hierarchy":"grade"});
}];

var formActionResolver = ['$stateParams', function ($stateParams) {
    if($stateParams.formAction) {
        return $stateParams.formAction; 
    }
    return { data:{}, errors:[] };
}];

var itemResolver = ['$stateParams','ItemService', function ($stateParams, ItemService) {
    if ($stateParams.assessmentId) {
        return ItemService.search({"assessmentId": $stateParams.assessmentId, "pageSize": 1000, "sortKey":"tibIdentifier"});
    } else {
        return { data:{}, errors:[] };
    }
}];

var itemGroupResolver = ['$stateParams','ItemGroupService', function ($stateParams, ItemGroupService) {
    if($stateParams.itemGroupId) {
        return ItemGroupService.findById($stateParams.itemGroupId); 
    }
    return { data:{}, errors:[] };
}];

var itemGroupListResolver = ['$stateParams','ItemGroupService', function ($stateParams, ItemGroupService) {
    if($stateParams.assessmentId) {
        return ItemGroupService.findByAssessmentId($stateParams.assessmentId); 
    }
    return { data:{}, errors:[] };
}];

var affinityGroupResolver = ['$stateParams','AffinityGroupService', function ($stateParams, AffinityGroupService) {
	if($stateParams.affinityGroupId) {
		return AffinityGroupService.findById($stateParams.affinityGroupId); 
	}
	return { data:{}, errors:[] };
}];

var affinityGroupListResolver = ['$stateParams','AffinityGroupService', function ($stateParams, AffinityGroupService) {
    if($stateParams.assessmentId) {
        return AffinityGroupService.findByAssessmentId($stateParams.assessmentId); 
    }
    return { data:{}, errors:[] };
}];

var enemyResolver = ['$stateParams','EnemyService', function ($stateParams, EnemyService) {
    if($stateParams.enemyId) {
        return EnemyService.findById($stateParams.enemyId); 
    }
    return { data:{}, errors:[] };
}];

var enemyTypeResolver = ['EnemyService', function (EnemyService) {
    return EnemyService.getEnemyTypes();
}];

var formResolver = ['$stateParams','FormService', function ($stateParams, FormService) {
    if ($stateParams.formId) {
        return FormService.findById($stateParams.formId); 
    }
    return { data:{}, errors:[] };
}];

var formListResolver = ['$stateParams','FormService', function ($stateParams, FormService) {
	if ($stateParams.assessmentId) {
	        return FormService.search({"assessmentId": $stateParams.assessmentId, "pageSize": 1000, "sortKey":"name"});
	} 
    return { data:{}, errors:[] };
}];

var formLanguagesResolver = ['$stateParams', 'AssessmentService','TibItemService', function ($stateParams, AssessmentService, TibItemService) {
		return AssessmentService.findById($stateParams.assessmentId).then(function(response) {
			var assessment = response.data;
			return TibItemService.getItemMetadataValues({"metadataKey":"Language", "tenantId":assessment.tenantId, "sortKey":"metadataValue", "pageSize":300}).then( function(loadedData) {
				if(!loadedData.data.searchResults) {
					return {data:[], errors:[]};
				}
		        return loadedData.data.searchResults;
		    });
		});
}];

var formPartitionResolver = ['$stateParams','FormPartitionService', function ($stateParams, FormPartitionService) {
    if ($stateParams.formPartitionId) {
        return FormPartitionService.findById($stateParams.formPartitionId); 
    }
    return { data:{}, errors:[] };
}];

var formPartitionListResolver = ['$stateParams','FormPartitionService', function ($stateParams, FormPartitionService) {
	if ($stateParams.assessmentId) {
	        return FormPartitionService.search({"assessmentId": $stateParams.assessmentId, "pageSize": 1000, "sortKey":"formId"});
	} 
    return { data:{}, errors:[] };
}];

var scoringRuleResolver = ['$stateParams','ScoringRuleService', function ($stateParams, ScoringRuleService) {
    if($stateParams.scoringRuleId) {
        return ScoringRuleService.findById($stateParams.scoringRuleId); 
    }
    return { data:{}, errors:[] };
}];

var scoringRuleListResolver = ['$stateParams','ScoringRuleService', function ($stateParams, ScoringRuleService) {
    if ($stateParams.assessmentId) {
    	return ScoringRuleService.search({"assessmentId": $stateParams.assessmentId, "pageSize": 1000});
    }
    return { data:{}, errors:[] };
}];

var blueprintReferenceTypeResolver = ['$stateParams','ScoringRuleService', function ($stateParams, ScoringRuleService) {
    return ScoringRuleService.getBlueprintReferenceTypes();
}];

var scoringRuleBlueprintReferenceResolver = ['$stateParams','ScoringRuleService', function ($stateParams, ScoringRuleService) {
	return ScoringRuleService.getBlueprintReferences({"assessmentId": $stateParams.assessmentId, "pageSize": 1000});
}];

var performanceLevelBlueprintReferenceResolver = ['$stateParams','PerformanceLevelService', function ($stateParams, PerformanceLevelService) {
	return PerformanceLevelService.getBlueprintReferences({"assessmentId": $stateParams.assessmentId, "pageSize": 1000});
}];

var blueprintDenotationTypeResolver = ['$stateParams','ScoringRuleService', function ($stateParams, ScoringRuleService) {
    return ScoringRuleService.getBlueprintDenotationTypes();
}];

var performanceLevelResolver = ['$stateParams','PerformanceLevelService', function ($stateParams, PerformanceLevelService) {
    if($stateParams.performanceLevelId) {
        return PerformanceLevelService.findById($stateParams.performanceLevelId); 
    }
    return { data:{}, errors:[] };
}];

var reportingMeasureResolver = ['$stateParams','ReportingMeasureService', function ($stateParams, ReportingMeasureService) {
    if ($stateParams.reportingMeasureId) {
        return ReportingMeasureService.findById($stateParams.reportingMeasureId); 
    }
    return { data:{}, errors:[] };
}];

var reportingMeasureScoringRuleResolver = ['$stateParams','ScoringRuleService', function ($stateParams, ScoringRuleService) {
    if ($stateParams.assessmentId) {
    	var scoringRuleSearchParams = { "assessmentId":$stateParams.assessmentId, "sortKey" : "name", "sortDir" : "asc", "pageSize" : "5000" };
        return ScoringRuleService.search(scoringRuleSearchParams); 
    }
    return { data:{}, errors:[] };
}];

var itemMetadataConfigResolver = ['$stateParams','ItemMetadataConfigService', function ($stateParams, ItemMetadataConfigService) {
    if ($stateParams.assessmentId) {
    	return ItemMetadataConfigService.findByAssessmentId($stateParams.assessmentId); 
    }
    return { data:{}, errors:[] };
}];

var itemMetadataKeysResolver = ['$stateParams','ItemMetadataKeysService', function ($stateParams, ItemMetadataKeysService) {
    if ($stateParams.assessmentId) {
    	return ItemMetadataKeysService.findByAssessmentId($stateParams.assessmentId); 
    }
    return { data:{}, errors:[] };
}];

var fileGroupResolver = ['$stateParams','FileGroupService', function ($stateParams, FileGroupService) {
    if($stateParams.fileGroupId) {
        return FileGroupService.findById($stateParams.fileGroupId); 
    }
    return { data:{}, errors:[] };
}];

var recordResolver = ['$stateParams','FileGroupService', function ($stateParams, FileGroupService) {
    if($stateParams.assessmentId) {
        return FileGroupService.getSimulationRecordByAssessmentId($stateParams.assessmentId);
    }
    return { data:{}, errors:[] };
}];

var currentPublishingRecordResolver = ['$stateParams','PublishingRecordService', function ($stateParams, PublishingRecordService) {
    if ($stateParams.assessmentId) {
    	return PublishingRecordService.retrieveLatestStatus($stateParams.assessmentId);
    }
    return { data:{}, errors:[] };
}];

var checkPublishingValidityPublishingRecordResolver = ['$stateParams','PublishingRecordService', function ($stateParams, PublishingRecordService) {
    if ($stateParams.assessmentId) {
    	return PublishingRecordService.checkPublishingValidity($stateParams.assessmentId);
    }
    return { data:{}, errors:[] };
}];

var publishingRecordResolver = ['$stateParams','PublishingRecordService', function ($stateParams, PublishingRecordService) {
    if ($stateParams.publishingRecordId) {
        return PublishingRecordService.findById($stateParams.publishingRecordId); 
    }
    return { data:{}, errors:[] };
}];

var algorithmListResolver = ['$stateParams','ItemSelectionAlgorithmService', function ($stateParams, ItemSelectionAlgorithmService) {
    return ItemSelectionAlgorithmService.search({'sortKey':'name', "pageSize": 1000});
}];

var subjectResolver = ['$stateParams','SubjectService', function ($stateParams, SubjectService) {
    if($stateParams.subjectId) {
        return SubjectService.findById($stateParams.subjectId); 
    }
    return { data:{}, errors:[] };
}];

var publicationResolver = ['$stateParams','PublicationService', function ($stateParams, PublicationService) {
    if($stateParams.publicationId) {
        return PublicationService.findById($stateParams.publicationId); 
    }
    return { data:{}, errors:[] };
}];

var computationRuleResolver = ['$stateParams','ComputationRuleService', function ($stateParams, ComputationRuleService) {
    if($stateParams.computationRuleId) {
        return ComputationRuleService.findById($stateParams.computationRuleId); 
    }
    return { data:{}, errors:[] };
}];

var itemSelectionAlgorithmResolver = ['$stateParams','ItemSelectionAlgorithmService', function ($stateParams, ItemSelectionAlgorithmService) {
    if($stateParams.itemSelectionAlgorithmId) {
        return ItemSelectionAlgorithmService.findById($stateParams.itemSelectionAlgorithmId); 
    }
    return { data:{}, errors:[] };
}];
