(function(){
	"use strict";

	angular.module('app',
		[
		'app.controllers',
		'app.filters',
		'app.services',
		'app.directives',
		'app.routes',
		'app.config',
		'partialsModule'
		]);

	angular.module('app.routes', []);
	angular.module('app.controllers', ['ui.router', 'ngMaterial', 'ngStorage', 'restangular', 'angular-loading-bar']);
	angular.module('app.filters', []);
	angular.module('app.services', []);
	angular.module('app.directives', []);
	angular.module('app.config', []);

})();

(function(){
	"use strict";

	angular.module('app.routes').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

		var getView = function(viewName){
			return './views/app/' + viewName + '/' + viewName + '.html';
		};

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('app', {
				abstract: true,
				views: {
					header: {
						templateUrl: getView('header')
					},
					footer: {
						templateUrl: getView('footer')
					},
					main: {}
				}
			})
			.state('app.landing', {
				url: '/',
				data: {},
				views: {
					'main@': {
						templateUrl: getView('landing')
					}
				}
			});

	}]);
})();

(function (){
	"use strict";

	angular.module('app.config').config(["cfpLoadingBarProvider", function (cfpLoadingBarProvider){
		cfpLoadingBarProvider.includeSpinner = false;
	}]);

})();

(function(){
	"use strict";

	angular.module('app.config').config(["$mdThemingProvider", function($mdThemingProvider) {
		/* For more info, visit https://material.angularjs.org/#/Theming/01_introduction */
		$mdThemingProvider.theme('default')
		.primaryPalette('indigo')
		.accentPalette('grey')
		.warnPalette('red');
	}]);

})();

(function(){
	"use strict";

	angular.module('app.filters').filter( 'capitalize', function(){
		return function(input) {
			return (input) ? input.replace(/([^\W_]+[^\s-]*) */g,function(txt){
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			}) : '';
		};
	});
})();

(function(){
	"use strict";

	angular.module('app.filters').filter( 'humanReadable', function(){
		return function humanize(str) {
			if ( !str ){
				return '';
			}
			var frags = str.split('_');
			for (var i=0; i<frags.length; i++) {
				frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
			}
			return frags.join(' ');
		};
	});
})();
(function(){
    'use strict';

    angular.module('app.filters').filter('truncateCharacters', function () {
        return function (input, chars, breakOnWord) {
            if (isNaN(chars)) {
                return input;
            }
            if (chars <= 0) {
                return '';
            }
            if (input && input.length > chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    // Get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                } else {
                    while (input.charAt(input.length-1) === ' ') {
                        input = input.substr(0, input.length - 1);
                    }
                }
                return input + '...';
            }
            return input;
        };
    });
})();
(function(){
    'use strict';

    angular.module('app.filters').filter('truncateWords', function () {
        return function (input, words) {
            if (isNaN(words)) {
                return input;
            }
            if (words <= 0) {
                return '';
            }
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '...';
                }
            }
            return input;
        };
    });
})();
(function(){
	"use strict";

	angular.module('app.filters').filter( 'trustHtml', ["$sce", function( $sce ){
		return function( html ){
			return $sce.trustAsHtml(html);
		};
	}]);
})();
(function(){
	"use strict";

	angular.module('app.filters').filter('ucfirst', function() {
		return function( input ) {
			if ( !input ){
				return null;
			}
			return input.substring(0, 1).toUpperCase() + input.substring(1);
		};
	});

})();

(function() {
	"use strict";

	angular.module('app.services').factory('API', ["Restangular", "ToastService", "$localStorage", function(Restangular, ToastService, $localStorage) {

		//content negotiation
		var headers = {
			'Content-Type': 'application/json',
			'Accept': 'application/x.laravel.v1+json'
		};

		return Restangular.withConfig(function(RestangularConfigurer) {
			RestangularConfigurer
				.setBaseUrl('/api/')
				.setDefaultHeaders(headers)
				.setErrorInterceptor(function(response) {
					if (response.status === 422) {
						for (var error in response.data.errors) {
							return ToastService.error(response.data.errors[error][0]);
						}
					}
				})
				.addFullRequestInterceptor(function(element, operation, what, url, headers) {
					if ($localStorage.jwt) {
						headers.Authorization = 'Bearer ' + $localStorage.jwt;
					}
				});
		});
	}]);

})();

(function(){
	"use strict";

	angular.module("app.services").factory('DialogService', ["$mdDialog", function($mdDialog){

		return {
			fromTemplate: function(template, $scope){

				var options = {
					templateUrl: './views/dialogs/' + template + '/' + template + '.html'
				};

				if ($scope){
					options.scope = $scope.$new();
				}

				return $mdDialog.show(options);
			},

			hide: function(){
				return $mdDialog.hide();
			},

			alert: function(title, content){
				$mdDialog.show(
					$mdDialog.alert()
						.title(title)
						.content(content)
						.ok('Ok')
				);
			},

			confirm: function(title, content) {
				return $mdDialog.show(
					$mdDialog.confirm()
						.title(title)
						.content(content)
						.ok('Ok')
						.cancel('Cancel')
				);
			}
		};
	}]);
})();
(function(){
	"use strict";

	angular.module("app.services").factory('ToastService', ["$mdToast", function($mdToast){

		var delay = 6000,
			position = 'top right',
			action = 'OK';

		return {
			show: function(content){
				if (!content){
					return false;
				}

				return $mdToast.show(
					$mdToast.simple()
						.content(content)
						.position(position)
						.action(action)
						.hideDelay(delay)
				);
			},
			error: function(content){
				if (!content){
					return false;
				}

				return $mdToast.show(
					$mdToast.simple()
						.content(content)
						.position(position)
						.theme('warn')
						.action(action)
						.hideDelay(delay)
				);
			}
		};
	}]);
})();
(function(){
    "use strict";

    angular.module('app.controllers').controller('FooterController', FooterController);

    function FooterController(){
        //
    }

})();

(function(){
    "use strict";

    angular.module('app.controllers').controller('HeaderController', HeaderController);

    function HeaderController(){
        //
    }

})();

(function() {
	"use strict";

	angular.module('app.controllers').controller('LandingController', LandingController);

	function LandingController() {
		var vm = this;

		vm.laravel_description = 'Response macros integrated with your Angular app';
		vm.angular_description = 'Query your API without worrying about validations';

		/*
		This is a terrible temporary hack,
		to fix layout issues with flex on iOS (chrome & safari)
		Make sure to remove this when you modify this demo
		*/
		vm.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
	}

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJyb3V0ZXMuanMiLCJjb25maWcvbG9hZGluZ19iYXIuY29uZmlnLmpzIiwiY29uZmlnL3RoZW1lLmNvbmZpZy5qcyIsImZpbHRlcnMvY2FwaXRhbGl6ZS5maWx0ZXIuanMiLCJmaWx0ZXJzL2h1bWFuX3JlYWRhYmxlLmZpbHRlci5qcyIsImZpbHRlcnMvdHJ1bmNhdGVfY2hhcmFjdGVycy5maWx0ZXIuanMiLCJmaWx0ZXJzL3RydW5jYXRlX3dvcmRzLmpzIiwiZmlsdGVycy90cnVzdF9odG1sLmZpbHRlci5qcyIsImZpbHRlcnMvdWNmaXJzdC5maWx0ZXIuanMiLCJzZXJ2aWNlcy9BUEkuc2VydmljZS5qcyIsInNlcnZpY2VzL2RpYWxvZy5zZXJ2aWNlLmpzIiwic2VydmljZXMvdG9hc3Quc2VydmljZS5qcyIsImFwcC9mb290ZXIvZm9vdGVyLmNvbnRyb2xsZXIuanMiLCJhcHAvaGVhZGVyL2hlYWRlci5jb250cm9sbGVyLmpzIiwiYXBwL2xhbmRpbmcvbGFuZGluZy5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsVUFBQTtDQUNBOztDQUVBLFFBQUEsT0FBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztDQUdBLFFBQUEsT0FBQSxjQUFBO0NBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsYUFBQSxjQUFBLGFBQUEsZUFBQTtDQUNBLFFBQUEsT0FBQSxlQUFBO0NBQ0EsUUFBQSxPQUFBLGdCQUFBO0NBQ0EsUUFBQSxPQUFBLGtCQUFBO0NBQ0EsUUFBQSxPQUFBLGNBQUE7Ozs7QUNuQkEsQ0FBQSxVQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLGNBQUEsZ0RBQUEsU0FBQSxnQkFBQSxtQkFBQTs7RUFFQSxJQUFBLFVBQUEsU0FBQSxTQUFBO0dBQ0EsT0FBQSxpQkFBQSxXQUFBLE1BQUEsV0FBQTs7O0VBR0EsbUJBQUEsVUFBQTs7RUFFQTtJQUNBLE1BQUEsT0FBQTtJQUNB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LE9BQUE7OztJQUdBLE9BQUEsU0FBQTtLQUNBLFNBQUE7T0FDQSxRQUFBO09BQ0EsU0FBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7R0FHQSxPQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsQ0FBQSxRQUFBO0tBQ0EsT0FBQTs7O0lBR0EsT0FBQSxTQUFBO0tBQ0EsU0FBQTtPQUNBLFFBQUE7T0FDQSxTQUFBO09BQ0EsTUFBQTtPQUNBLE9BQUE7T0FDQSxVQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0JBQUE7O0lBRUEsU0FBQSxrQkFBQTs7Ozs7O0FDTEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0JBQUE7O0lBRUEsU0FBQSxrQkFBQTs7Ozs7O0FDTEEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEscUJBQUE7O0NBRUEsU0FBQSxvQkFBQTtFQUNBLElBQUEsS0FBQTs7RUFFQSxHQUFBLHNCQUFBO0VBQ0EsR0FBQSxzQkFBQTs7Ozs7OztFQU9BLEdBQUEsTUFBQSxtQkFBQSxLQUFBLFVBQUE7Ozs7QUFJQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0YW5ndWxhci5tb2R1bGUoJ2FwcCcsXHJcblx0XHRbXHJcblx0XHQnYXBwLmNvbnRyb2xsZXJzJyxcclxuXHRcdCdhcHAuZmlsdGVycycsXHJcblx0XHQnYXBwLnNlcnZpY2VzJyxcclxuXHRcdCdhcHAuZGlyZWN0aXZlcycsXHJcblx0XHQnYXBwLnJvdXRlcycsXHJcblx0XHQnYXBwLmNvbmZpZycsXHJcblx0XHQncGFydGlhbHNNb2R1bGUnXHJcblx0XHRdKTtcclxuXHJcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbXSk7XHJcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsndWkucm91dGVyJywgJ25nTWF0ZXJpYWwnLCAnbmdTdG9yYWdlJywgJ3Jlc3Rhbmd1bGFyJywgJ2FuZ3VsYXItbG9hZGluZy1iYXInXSk7XHJcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pO1xyXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbXSk7XHJcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgW10pO1xyXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpe1xyXG5cclxuXHRcdHZhciBnZXRWaWV3ID0gZnVuY3Rpb24odmlld05hbWUpe1xyXG5cdFx0XHRyZXR1cm4gJy4vdmlld3MvYXBwLycgKyB2aWV3TmFtZSArICcvJyArIHZpZXdOYW1lICsgJy5odG1sJztcclxuXHRcdH07XHJcblxyXG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG5cclxuXHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdC5zdGF0ZSgnYXBwJywge1xyXG5cdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxyXG5cdFx0XHRcdHZpZXdzOiB7XHJcblx0XHRcdFx0XHRoZWFkZXI6IHtcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hlYWRlcicpXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0Zm9vdGVyOiB7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdmb290ZXInKVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdG1haW46IHt9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQuc3RhdGUoJ2FwcC5sYW5kaW5nJywge1xyXG5cdFx0XHRcdHVybDogJy8nLFxyXG5cdFx0XHRcdGRhdGE6IHt9LFxyXG5cdFx0XHRcdHZpZXdzOiB7XHJcblx0XHRcdFx0XHQnbWFpbkAnOiB7XHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsYW5kaW5nJylcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHR9KTtcclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpe1xyXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cclxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKXtcclxuXHRcdGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xyXG5cdH0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKCRtZFRoZW1pbmdQcm92aWRlcikge1xyXG5cdFx0LyogRm9yIG1vcmUgaW5mbywgdmlzaXQgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyanMub3JnLyMvVGhlbWluZy8wMV9pbnRyb2R1Y3Rpb24gKi9cclxuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXHJcblx0XHQucHJpbWFyeVBhbGV0dGUoJ2luZGlnbycpXHJcblx0XHQuYWNjZW50UGFsZXR0ZSgnZ3JleScpXHJcblx0XHQud2FyblBhbGV0dGUoJ3JlZCcpO1xyXG5cdH0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlciggJ2NhcGl0YWxpemUnLCBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XHJcblx0XHRcdHJldHVybiAoaW5wdXQpID8gaW5wdXQucmVwbGFjZSgvKFteXFxXX10rW15cXHMtXSopICovZyxmdW5jdGlvbih0eHQpe1xyXG5cdFx0XHRcdHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdH0pIDogJyc7XHJcblx0XHR9O1xyXG5cdH0pO1xyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCAnaHVtYW5SZWFkYWJsZScsIGZ1bmN0aW9uKCl7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gaHVtYW5pemUoc3RyKSB7XHJcblx0XHRcdGlmICggIXN0ciApe1xyXG5cdFx0XHRcdHJldHVybiAnJztcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgZnJhZ3MgPSBzdHIuc3BsaXQoJ18nKTtcclxuXHRcdFx0Zm9yICh2YXIgaT0wOyBpPGZyYWdzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0ZnJhZ3NbaV0gPSBmcmFnc1tpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZyYWdzW2ldLnNsaWNlKDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmcmFncy5qb2luKCcgJyk7XHJcblx0XHR9O1xyXG5cdH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndHJ1bmNhdGVDaGFyYWN0ZXJzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIGNoYXJzLCBicmVha09uV29yZCkge1xyXG4gICAgICAgICAgICBpZiAoaXNOYU4oY2hhcnMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNoYXJzIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5wdXQgJiYgaW5wdXQubGVuZ3RoID4gY2hhcnMpIHtcclxuICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyaW5nKDAsIGNoYXJzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWJyZWFrT25Xb3JkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RzcGFjZSA9IGlucHV0Lmxhc3RJbmRleE9mKCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGxhc3Qgc3BhY2VcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdHNwYWNlICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBsYXN0c3BhY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGlucHV0LmNoYXJBdChpbnB1dC5sZW5ndGgtMSkgPT09ICcgJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBpbnB1dC5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQgKyAnLi4uJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycpLmZpbHRlcigndHJ1bmNhdGVXb3JkcycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCB3b3Jkcykge1xyXG4gICAgICAgICAgICBpZiAoaXNOYU4od29yZHMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHdvcmRzIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbnB1dFdvcmRzID0gaW5wdXQuc3BsaXQoL1xccysvKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbnB1dFdvcmRzLmxlbmd0aCA+IHdvcmRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dFdvcmRzLnNsaWNlKDAsIHdvcmRzKS5qb2luKCcgJykgKyAnLi4uJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cclxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnKS5maWx0ZXIoICd0cnVzdEh0bWwnLCBmdW5jdGlvbiggJHNjZSApe1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBodG1sICl7XHJcblx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGh0bWwpO1xyXG5cdFx0fTtcclxuXHR9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJykuZmlsdGVyKCd1Y2ZpcnN0JywgZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24oIGlucHV0ICkge1xyXG5cdFx0XHRpZiAoICFpbnB1dCApe1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBpbnB1dC5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKSArIGlucHV0LnN1YnN0cmluZygxKTtcclxuXHRcdH07XHJcblx0fSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnKS5mYWN0b3J5KCdBUEknLCBmdW5jdGlvbihSZXN0YW5ndWxhciwgVG9hc3RTZXJ2aWNlLCAkbG9jYWxTdG9yYWdlKSB7XHJcblxyXG5cdFx0Ly9jb250ZW50IG5lZ290aWF0aW9uXHJcblx0XHR2YXIgaGVhZGVycyA9IHtcclxuXHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuXHRcdFx0J0FjY2VwdCc6ICdhcHBsaWNhdGlvbi94LmxhcmF2ZWwudjEranNvbidcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIFJlc3Rhbmd1bGFyLndpdGhDb25maWcoZnVuY3Rpb24oUmVzdGFuZ3VsYXJDb25maWd1cmVyKSB7XHJcblx0XHRcdFJlc3Rhbmd1bGFyQ29uZmlndXJlclxyXG5cdFx0XHRcdC5zZXRCYXNlVXJsKCcvYXBpLycpXHJcblx0XHRcdFx0LnNldERlZmF1bHRIZWFkZXJzKGhlYWRlcnMpXHJcblx0XHRcdFx0LnNldEVycm9ySW50ZXJjZXB0b3IoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQyMikge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBlcnJvciBpbiByZXNwb25zZS5kYXRhLmVycm9ycykge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBUb2FzdFNlcnZpY2UuZXJyb3IocmVzcG9uc2UuZGF0YS5lcnJvcnNbZXJyb3JdWzBdKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmFkZEZ1bGxSZXF1ZXN0SW50ZXJjZXB0b3IoZnVuY3Rpb24oZWxlbWVudCwgb3BlcmF0aW9uLCB3aGF0LCB1cmwsIGhlYWRlcnMpIHtcclxuXHRcdFx0XHRcdGlmICgkbG9jYWxTdG9yYWdlLmp3dCkge1xyXG5cdFx0XHRcdFx0XHRoZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyAkbG9jYWxTdG9yYWdlLmp3dDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0RpYWxvZ1NlcnZpY2UnLCBmdW5jdGlvbigkbWREaWFsb2cpe1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGZyb21UZW1wbGF0ZTogZnVuY3Rpb24odGVtcGxhdGUsICRzY29wZSl7XHJcblxyXG5cdFx0XHRcdHZhciBvcHRpb25zID0ge1xyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy8nICsgdGVtcGxhdGUgKyAnLmh0bWwnXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0aWYgKCRzY29wZSl7XHJcblx0XHRcdFx0XHRvcHRpb25zLnNjb3BlID0gJHNjb3BlLiRuZXcoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGhpZGU6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRhbGVydDogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpe1xyXG5cdFx0XHRcdCRtZERpYWxvZy5zaG93KFxyXG5cdFx0XHRcdFx0JG1kRGlhbG9nLmFsZXJ0KClcclxuXHRcdFx0XHRcdFx0LnRpdGxlKHRpdGxlKVxyXG5cdFx0XHRcdFx0XHQuY29udGVudChjb250ZW50KVxyXG5cdFx0XHRcdFx0XHQub2soJ09rJylcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Y29uZmlybTogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpIHtcclxuXHRcdFx0XHRyZXR1cm4gJG1kRGlhbG9nLnNob3coXHJcblx0XHRcdFx0XHQkbWREaWFsb2cuY29uZmlybSgpXHJcblx0XHRcdFx0XHRcdC50aXRsZSh0aXRsZSlcclxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcclxuXHRcdFx0XHRcdFx0Lm9rKCdPaycpXHJcblx0XHRcdFx0XHRcdC5jYW5jZWwoJ0NhbmNlbCcpXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0YW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVG9hc3RTZXJ2aWNlJywgZnVuY3Rpb24oJG1kVG9hc3Qpe1xyXG5cclxuXHRcdHZhciBkZWxheSA9IDYwMDAsXHJcblx0XHRcdHBvc2l0aW9uID0gJ3RvcCByaWdodCcsXHJcblx0XHRcdGFjdGlvbiA9ICdPSyc7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0c2hvdzogZnVuY3Rpb24oY29udGVudCl7XHJcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxyXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcclxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcclxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxyXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcclxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oY29udGVudCl7XHJcblx0XHRcdFx0aWYgKCFjb250ZW50KXtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiAkbWRUb2FzdC5zaG93KFxyXG5cdFx0XHRcdFx0JG1kVG9hc3Quc2ltcGxlKClcclxuXHRcdFx0XHRcdFx0LmNvbnRlbnQoY29udGVudClcclxuXHRcdFx0XHRcdFx0LnBvc2l0aW9uKHBvc2l0aW9uKVxyXG5cdFx0XHRcdFx0XHQudGhlbWUoJ3dhcm4nKVxyXG5cdFx0XHRcdFx0XHQuYWN0aW9uKGFjdGlvbilcclxuXHRcdFx0XHRcdFx0LmhpZGVEZWxheShkZWxheSlcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Zvb3RlckNvbnRyb2xsZXInLCBGb290ZXJDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBGb290ZXJDb250cm9sbGVyKCl7XHJcbiAgICAgICAgLy9cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckNvbnRyb2xsZXInLCBIZWFkZXJDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBIZWFkZXJDb250cm9sbGVyKCl7XHJcbiAgICAgICAgLy9cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xhbmRpbmdDb250cm9sbGVyJywgTGFuZGluZ0NvbnRyb2xsZXIpO1xyXG5cclxuXHRmdW5jdGlvbiBMYW5kaW5nQ29udHJvbGxlcigpIHtcclxuXHRcdHZhciB2bSA9IHRoaXM7XHJcblxyXG5cdFx0dm0ubGFyYXZlbF9kZXNjcmlwdGlvbiA9ICdSZXNwb25zZSBtYWNyb3MgaW50ZWdyYXRlZCB3aXRoIHlvdXIgQW5ndWxhciBhcHAnO1xyXG5cdFx0dm0uYW5ndWxhcl9kZXNjcmlwdGlvbiA9ICdRdWVyeSB5b3VyIEFQSSB3aXRob3V0IHdvcnJ5aW5nIGFib3V0IHZhbGlkYXRpb25zJztcclxuXHJcblx0XHQvKlxyXG5cdFx0VGhpcyBpcyBhIHRlcnJpYmxlIHRlbXBvcmFyeSBoYWNrLFxyXG5cdFx0dG8gZml4IGxheW91dCBpc3N1ZXMgd2l0aCBmbGV4IG9uIGlPUyAoY2hyb21lICYgc2FmYXJpKVxyXG5cdFx0TWFrZSBzdXJlIHRvIHJlbW92ZSB0aGlzIHdoZW4geW91IG1vZGlmeSB0aGlzIGRlbW9cclxuXHRcdCovXHJcblx0XHR2bS5pT1MgPSAvaVBhZHxpUGhvbmV8aVBvZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcclxuXHR9XHJcblxyXG59KSgpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
