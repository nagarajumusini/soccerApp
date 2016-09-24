// script.js

    // create the module and name it soccerApp
    // also include ngRoute for all our routing needs
    var LOCAL_URI = 'http://10.10.10.113:3000';
    var SERVER_URI = 'http://202.153.39.178:3000';
    var soccerApp = angular.module('soccerApp', ['ngRoute']);

    // configure our routes
    soccerApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'homeController'
            })

            // route for the about page
            .when('/login', {
                templateUrl : 'pages/login.html',
                controller  : 'loginController'
            })

            // route for the contact page
            .when('/dashboard', {
                templateUrl : 'pages/dashboard.html',
                controller  : 'dashboardController'
            });
    });

    // create the controller and inject Angular's $scope
    soccerApp.controller('homeController', function($scope, $rootScope, $http, $window) {
        console.log($rootScope.admin);
        $scope.global = $rootScope.admin;
        $scope.scores = {};
        $scope.todaymatches = [];
        $scope.upcomingmatches = [];
        $scope.oldmatches = [];
       
       $http.defaults.headers.post["Content-Type"] = "application/json";
        var save =  $http({
                        method: 'GET',
                        url: LOCAL_URI+'/api/scores',
                        //headers: {'X-API-KEY': api_key,'accessKey':$rootScope.userdata.accessKey},
                        //data: data,
                        dataType: 'JSON'
                    })
                    save.success(function(result){
                      	$scope.scores = result.data;
                    });
           var getmatches = $http({
                method: 'GET',
                url: LOCAL_URI+'/api/matches',
                dataType: 'JSON'
            }).success(function(result){
                result.data.forEach(function(match){
                 var a = new Date();
                 var b = new Date(match.date);
                 if( a > b){
                     $scope.oldmatches.push(match);
                 }else if( a < b){
                     $scope.upcomingmatches.push(match);
                 }else{
                     $scope.todaymatches.push(match);
                 }
                });
            }); 
              $scope.logout = function(){
                    $rootScope.admin = { status : false };
                    $window.location.reload();
                };           
    });

    soccerApp.controller('loginController', function($scope, $rootScope, $window) {
        $scope.global = $rootScope.admin;
        $scope.submit = function(user){
            console.log(user);
            if(user.username == 'admin' && user.pwd == 'admin'){
               // $state.go('#/dashboard');
               $rootScope.admin = { status : true };
               console.log($rootScope.admin);
               $window.location.href = '#/dashboard';
            }else{
                alert('Please enter valid details');
            }
        }
         $scope.logout = function(){
            $rootScope.admin = { status : false };
            $window.location.reload();
        };
    });

    soccerApp.controller('dashboardController', function($scope, $rootScope, $window, $http) {
        console.log($rootScope.admin);
        $scope.matches = [];
        $scope.global = $rootScope.admin;
        var getteams = $http({
                        method: 'GET',
                        url: LOCAL_URI+'/api/teams',
                        dataType: 'JSON'
                    }).success(function(result){
                      	$scope.teams = result.data;
                          console.log($scope.teams);
                    });
        var getmatches = $http({
                method: 'GET',
                url: LOCAL_URI+'/api/matches',
                dataType: 'JSON'
            }).success(function(result){
                result.data.forEach(function(match){
                 var a = new Date();
                 var b = new Date(match.date);
                 if( a >= b){
                     $scope.matches.push(match);
                 }
                });
                console.log($scope.matches);
            });        
        $scope.addteam = function(info){
            console.log(info);
            var data = 'name='+info.name;
          //  $http.defaults.headers.post["Content-Type"] = "application/json";
             var send = $http({
                method: 'POST',
                url: LOCAL_URI+'/api/teams',
                headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
                data: data,
                dataType: 'JSON'
            }).success(function(result){
               console.log(result);
               if(result.status){
                   alert('Team name added successfully');
                   $window.location.reload();
               }else{
                   alert(result.message);
               }
            });
        };
         $scope.createMatch = function(info){
            console.log(info);
            if(info.lteam_id == info.rteam_id){
                alert('Use different teams');
            }else if(typeof info.date == 'undefined'){
                 alert('Please enter date');   
            }else{
                var data = 'lteam_id='+info.lteam_id+'&rteam_id='+info.rteam_id+'&date='+info.date;
                var send = $http({
                    method: 'POST',
                    url: LOCAL_URI+'/api/matches',
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
                    data: data,
                    dataType: 'JSON'
                }).success(function(result){
                console.log(result);
                if(result.status){
                    alert('Match added successfully');
                    $window.location.reload();
                }else{
                    alert(result.message);
                }
                });
            }
        };
         $scope.addscore = function(info){
            console.log(info);
                var data = 'match_id='+info.match_id+'&goals='+info.goals+'&xgoals='+info.xgoals;
                var send = $http({
                    method: 'POST',
                    url: LOCAL_URI+'/api/scores',
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
                    data: data,
                    dataType: 'JSON'
                }).success(function(result){
                console.log(result);
                if(result.status){
                    alert('Score added successfully');
                    $window.location.reload();
                }else{
                    alert(result.message);
                }
                });
        };
         $scope.logout = function(){
            $rootScope.admin = { status : false };
           // $window.location.reload();
            $window.location.href = '#/';
        };
    });