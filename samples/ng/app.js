(function (scope, angular) {
    var app = angular.module('app', []);
    app.directive('seedComponent', DNA.ngCreate('seed-component', {
        prototype: SeedComponent
    }));
    app.run(['$rootScope', function ($rootScope) {
        $rootScope.owner = 'Chialabbers';
    }])
})(this, angular);
