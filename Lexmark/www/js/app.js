var devicedet = '0';
var deviceSN = '0';
var activityRowId = '0';
var sImgValue;
angular.module('starter', ['ionic',  'highcharts-ng', 'n3-pie-chart', 'starter.controllers', 'starter.services', 'ngCordova', 'SrmFilters', 'uiGmapgoogle-maps'])

.run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.hide();
            }
        });
    })
    .config(function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });
    })
.controller("mapctrl", ['$scope', 'uiGmapGoogleMapApi', '$timeout', '$ionicModal', 'Projects', '$ionicSideMenuDelegate', '$state', '$cordovaCamera', '$http', 'ContactsService', '$ionicLoading', '$ionicNavBarDelegate', '$ionicViewService', '$location', '$rootScope', function ($scope, uiGmapGoogleMapApi, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $state, $cordovaCamera, $http, ContactsService, $ionicLoading, $ionicNavBarDelegate, $ionicViewService, $location, $rootScope) {
        
        var longi, lati;
         console.log("To go inside maps");
        uiGmapGoogleMapApi.then(function (maps) {
            //$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
             console.log("To go inside maps");
            navigator.geolocation.getCurrentPosition(showPosition);
            var markers = [];

            function showPosition(position) {
                
                lati = position.coords.latitude;
                longi = position.coords.longitude;
                markers.push({latitude: +lati,longitude: +longi,id : + Math.round(Math.random()*100)})
                console.log("Longi" + longi);
                $scope.map = {
                    center: {
                        latitude: +lati,
                        longitude: +longi
                    },
                    zoom: 16,
                    idKey: 1,
                    coords: {
                        latitude: +lati,
                        longitude: +longi
                    }
                };
            }
            var userInfo;
            $scope.DevicePromise = null;
            userInfo = JSON.parse(sessionStorage.userInfo);
            var token = userInfo.accessToken;
            console.log(token);
            $scope.DevicePromise = $http.get("http://dlexwsbla007.na.ds.lexmark.com:8080/SiebelRestUI/rest/siebelpage?ioname=LXK%20LBS%20Asset%20Detail&ss=[LXK%20LBS%20Asset%20Detail.LXK LBS Account Id]='1-WHYUC1'&pagesize=100&startnum=1", {
                headers: {
                    'token': token
                }
            }).then(function (response) {
                $scope.totalItems = response.data.count;
                $scope.devices = response.data.LXKLBSAssetDetail;
                $scope.randomMarkers = [];
                
                console.log($scope.devices);
                 console.log("Total Item" +$scope.totalItems);
                for (var i = 0; i < $scope.totalItems; i++) {
                    console.log($scope.devices[i]);
                    var lati = $scope.devices[i].LXKLBSLatitude;
                    var longi = $scope.devices[i].LXKLBSLongitude;
                    console.log(longi+lati);
                    
                    markers.push(markmulti(longi, lati));
                }

                function markmulti(longi, lati) {
                    console.log(longi+lati);
                    var ret = {
                        latitude: +lati,
                        longitude: +longi,
                        id : + Math.round(Math.random()*100)
                    };
                    return ret;
                }
                console.log(markers);
                $scope.randomMarkers = markers;
                console.log($scope.randomMarkers);
            });

        });
        $scope.showasset = function(assetid){$scope.map = {
                 center: {
                        latitude: +$scope.randomMarkers[assetid+1].latitude,
                        longitude: +$scope.randomMarkers[assetid+1].longitude
                    },
                    zoom: 16,
                    idKey: +$scope.randomMarkers[assetid+1].id
                   };};
        $scope.cling = function(marker){alert("It is clicked");};
}])

.controller("dvctrl", 
    ['$scope', '$cordovaBarcodeScanner','$timeout', '$ionicModal', 'Projects', '$ionicSideMenuDelegate', 
    '$state', '$cordovaCamera', '$http', 'ContactsService', '$ionicLoading', '$ionicNavBarDelegate', 
    '$ionicViewService', '$location', '$rootScope', 
    function ($scope, $cordovaBarcodeScanner, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $state, $cordovaCamera, $http, ContactsService, $ionicLoading, $ionicNavBarDelegate, $ionicViewService, $location, $rootScope) {
    var userInfo;
    
    userInfo = JSON.parse(sessionStorage.userInfo);
    var token = userInfo.accessToken;
    console.log(token);
    $scope.bardevdetail = function(barindex){
    devicedet = $scope.bardev[barindex].LXKLBSId;
    deviceSN = $scope.bardev[barindex].SerialNumber;
    $state.go('devicedetail'); 
    };
    if($state.current.name == 'home.device')
    {
        console.log("Only device screen");
    $http.get("http://dlexwsbla007.na.ds.lexmark.com:8080/SiebelRestUI/rest/siebelpage?ioname=LXK%20LBS%20Asset%20Detail&ss=[LXK%20LBS%20Asset%20Detail.LXK LBS Account Id]='1-WHYUC1'&pagesize=100&startnum=1", {
                headers: {
                    'token': token
                }
            }).then(function (response) {
                $scope.bardev = response.data.LXKLBSAssetDetail;
                });
      }
     $scope.barscan = function(){ 
    console.log("Inside function");
    document.addEventListener("deviceready", function () {
    $cordovaBarcodeScanner.scan().then(function(barcodeData) {
        console.log(barcodeData);
        
            
        var bardata = barcodeData.text;
              $http.get("http://dlexwsbla007.na.ds.lexmark.com:8080/SiebelRestUI/rest/siebel?ioname=LXK%20LBS%20Asset%20Detail&ss=[LXK%20LBS%20Asset%20Detail.LXK LBS Account Id]=%271-WHYUC1%27 AND [LXK%20LBS%20Asset%20Detail.LXK LBS Zone] LIKE '"+bardata+"*'", {
                headers: {
                    'token': token
                }
            }).then(function (response) {
                $scope.bartot = response.data.count;
                console.log($scope.bartot);
                if($scope.bartot=='0')
                {
                    console.log("0");
                    $scope.dvcdiv = 'templates/nodevice.html'
                }
                else
                {
                    $scope.bardev = response.data.LXKLBSAssetDetail;
                }
                });
      }, function(error) {
        // An error occurred
      });})
}

}])
.controller("claimctrl", 
    ['$scope', '$cordovaBarcodeScanner','$timeout', '$ionicModal', 'Projects', '$ionicSideMenuDelegate', 
    '$state', '$cordovaCamera', '$http', 'ContactsService', '$ionicLoading', '$ionicNavBarDelegate', 
    '$ionicViewService', '$location', '$rootScope', 
    function ($scope, $cordovaBarcodeScanner, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $state, $cordovaCamera, $http, ContactsService, $ionicLoading, $ionicNavBarDelegate, $ionicViewService, $location, $rootScope) {
    $scope.imgarr = [];
$scope.CurrentRecordId ='';
var queyPagenum  = 1;
$scope.scanDiv = true;
$scope.editDiv = true;
var userInfo;
userInfo =JSON.parse(sessionStorage.userInfo);
var token = userInfo.accessToken;if(!token){alert("Please Login again, Do Not use Back or refresh after logged Out.");}
console.log(token);
$http.get('http://dlexwsbla007.na.ds.lexmark.com:8080/SiebelRestUI/rest/siebelpage?ioname=LXK SW Claim Detail Partner Portal&ss=[LXK SW Action Detail - Partner Portal.Id]%20LIKE%20%27*%27&pagesize=10&startnum='+queyPagenum,{headers: {'token': token}}).then(function (response) {
$scope.CurrentRecordId = response.data.LXKSWClaimDetailPartnerPortal[0].Id;
$scope.homeOrders = response.data.LXKSWClaimDetailPartnerPortal;
$scope.contactsCount = response.data.count;
$http.get('http://dlexwsbla007.na.ds.lexmark.com:8080/SiebelRestUI/rest/siebelpage?ioname=LXK SW Claim Detail Partner Portal&ss=[LXK SW Action Detail - Partner Portal.Id]%20LIKE%20%27'+$scope.CurrentRecordId+'%27&pagesize=5&startnum=1',{headers: {'token': token}}).then(function (response) {
$scope.ordersDetail = response.data.LXKSWClaimDetailPartnerPortal[0];
});

});

$scope.leftswiped = function(divId){
queyPagenum++;
console.log(queyPagenum);
divId = "#"+divId;
  $(divId).animate({scrollLeft:$(divId).scrollLeft()+210},100);
$http.get('http://dlexwsbla007.na.ds.lexmark.com:8080/SiebelRestUI/rest/siebelpage?ioname=LXK SW Claim Detail Partner Portal&ss=[LXK SW Action Detail - Partner Portal.Id]%20LIKE%20%27*%27&pagesize=10&startnum='+queyPagenum,{headers: {'token': token}}).then(function (response) {

var nextSetOrders = response.data.LXKSWClaimDetailPartnerPortal;
var nextSetLenght = response.data.count;
var curSetOrders = [];
curSetOrders = $scope.homeOrders;

for (var i=0;i<nextSetLenght;i++){
curSetOrders.push(nextSetOrders[i]);
}
$scope.homeOrders = curSetOrders;
});
};
$scope.rightswiped = function(divId){
divId = "#"+divId;
  $(divId).animate({scrollLeft:$(divId).scrollLeft()-210},100);

};

$scope.ordersDetailclk = function(orderId){
$scope.CurrentRecordId = orderId;
$http.get('http://dlexwsbla007.na.ds.lexmark.com:8080/SiebelRestUI/rest/siebelpage?ioname=LXK SW Claim Detail Partner Portal&ss=[LXK SW Action Detail - Partner Portal.Id]%20LIKE%20%27'+$scope.CurrentRecordId+'%27&pagesize=5&startnum=1',{headers: {'token': token}}).then(function (response) {
$scope.ordersDetail = response.data.LXKSWClaimDetailPartnerPortal[0];
});
}


}])
.controller("srctrl", 
    ['$scope', '$cordovaBarcodeScanner','$timeout', '$ionicModal', 'Projects', '$ionicSideMenuDelegate', 
    '$state', '$cordovaCamera', '$http', 'ContactsService', '$ionicLoading', '$ionicNavBarDelegate', 
    '$ionicViewService', '$location', '$rootScope', 
    function ($scope, $cordovaBarcodeScanner, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $state, $cordovaCamera, $http, ContactsService, $ionicLoading, $ionicNavBarDelegate, $ionicViewService, $location, $rootScope) {
    
    $scope.goBack = function() {
                        console.log("go back")
                        $ionicNavBarDelegate.back();
                        }
    var userInfo;
    $scope.deviceSN = deviceSN;
    userInfo = JSON.parse(sessionStorage.userInfo);
    var token = userInfo.accessToken;
    
    $http.get("http://dlexwsbla007.na.ds.lexmark.com:8080/SiebelRestUI/rest/siebel?ioname=LXK MPS Service Request List&ss=[LXK C Service Request (EAI).Account Id]='1-WHYUC1'", {
                headers: {
                    'token': token
                }
            }).then(function (response) {
                console.log(response.data.LXKMPSServiceRequestList);
                $scope.srlist = response.data.LXKMPSServiceRequestList;
                        });

}])

.controller("activityctrl", 
    ['$scope', '$cordovaBarcodeScanner','$timeout', '$ionicModal', 'Projects', '$ionicSideMenuDelegate', 
    '$state', '$cordovaCamera', '$http', 'ContactsService', '$ionicLoading', '$ionicNavBarDelegate', 
    '$ionicViewService', '$location', '$rootScope', 
    function ($scope, $cordovaBarcodeScanner, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $state, $cordovaCamera, $http, ContactsService, $ionicLoading, $ionicNavBarDelegate, $ionicViewService, $location, $rootScope) {
    $scope.actidetail = function(actId){
            activityRowId = $scope.activitylist[actId].ActivityUID;
            $state.go('activitydetail');
            }
    $scope.goBack = function() {
                        console.log("go back")
                        $ionicNavBarDelegate.back();
                        }
    var userInfo;
    $scope.deviceSN = deviceSN;
    userInfo = JSON.parse(sessionStorage.userInfo);
    var token = userInfo.accessToken;
    
    $http.get("http://dlexwsbla007.na.ds.lexmark.com:8080/SiebelRestUI/rest/siebel?ioname=SM Action IO&ss=[Action.Created]>'11/11/2014'&pagesize=10&startnum=1", {
                headers: {
                    'token': token
                }
            }).then(function (response) {
                console.log(response.data.SMActionIO);
                $scope.activitylist = response.data.SMActionIO;
                        });

}])
.controller("activitydetailctrl", 
    ['$scope', '$cordovaBarcodeScanner','$timeout', '$ionicModal', 'Projects', '$ionicSideMenuDelegate', 
    '$state', '$cordovaCamera', '$http', 'ContactsService', '$ionicLoading', '$ionicNavBarDelegate', 
    '$ionicViewService', '$location', '$rootScope', '$q',
    function ($scope, $cordovaBarcodeScanner, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $state, $cordovaCamera, $http, ContactsService, $ionicLoading, $ionicNavBarDelegate, $ionicViewService, $location, $rootScope, $q)
     {
        
    $('#signpad').hide();
var signaturePad;
 $scope.goBack = function() {
                    $ionicNavBarDelegate.back();
                        }
$scope.showactiModal = function() {

        $('#signpad').show();
        var canvas = document.getElementById('signatureCanvas');
        signaturePad = new SignaturePad(canvas);
        sImgValue = window.sessionStorage.getItem(activityRowId);
        if (sImgValue != null)
        {
            signaturePad.fromDataURL(sImgValue);
        }       
        }
        
    $scope.clearCanvas = function() {
        signaturePad.clear();
        window.sessionStorage.removeItem(activityRowId);
        }
 
    $scope.saveCanvas = function() {
        var sigImg = signaturePad.toDataURL();
        console.log(sigImg);
        $scope.signature = sigImg;
        window.sessionStorage.setItem(activityRowId,sigImg);        
        $state.go('home.activity');
        }
                  
        
      }])
.controller("devicedetailctrl", 
    ['$scope', '$cordovaBarcodeScanner','$timeout', '$ionicModal', 'Projects', '$ionicSideMenuDelegate', 
    '$state', '$cordovaCamera', '$http', 'ContactsService', '$ionicLoading', '$ionicNavBarDelegate', 
    '$ionicViewService', '$location', '$rootScope', '$q',
    function ($scope, $cordovaBarcodeScanner, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $state, $cordovaCamera, $http, ContactsService, $ionicLoading, $ionicNavBarDelegate, $ionicViewService, $location, $rootScope, $q) {
    //alert(devicedet);
    $scope.srallclass = 'active'
    $scope.goBack = function() {
                        console.log("go back")
                        $ionicNavBarDelegate.back();
                        }
    var userInfo;
    $scope.deviceSN = deviceSN;
    userInfo = JSON.parse(sessionStorage.userInfo);
    var token = userInfo.accessToken;
    $http.get("http://dlexwsbla007.na.ds.lexmark.com:8080/SiebelRestUI/rest/siebel?ioname=LXK%20LBS%20Asset%20Detail&ss=[LXK%20LBS%20Asset%20Detail.LXK LBS Id]='"+devicedet+"'", {
                headers: {
                    'token': token
                }
            }).then(function (response) {
                console.log(response.data.LXKLBSAssetDetail[0])
                $scope.bardetail = response.data.LXKLBSAssetDetail[0];
                });
    $http.get("http://dlexwsbla007.na.ds.lexmark.com:8080/SiebelRestUI/rest/siebel?ioname=LXK MPS Service Request List&ss=[LXK C Service Request (EAI).Asset Id]='"+devicedet+"'", {
                headers: {
                    'token': token
                }
            }).then(function (response) {
                console.log(response.data.LXKMPSServiceRequestList);
                $scope.srlist = response.data.LXKMPSServiceRequestList;
                        });
        $scope.allsr = function(){$scope.srallclass = 'active';$scope.sropenclass = '';$scope.srclosedclass = '';  $scope.filterFunction = function(element) {
           return true ;
};};
        $scope.opensr = function(){$scope.srallclass = '';$scope.sropenclass = 'active';$scope.srclosedclass = ''; $scope.filterFunction = function(element) {
        return element.Status.match('Open') ? true : false;
};};
        $scope.closedsr = function(){$scope.srallclass = '';$scope.sropenclass = '';$scope.srclosedclass = 'active';$scope.filterFunction = function(element) {
           return element.Status.match('Closed') ? true : false;
};};
        $scope.filterFunction = function(element) {
            console.log(element.Status);
          return element.Status.match('Open') ? true : false;
};$ionicModal.fromTemplateUrl('newSRmodal.html', function(modal) {
                                                    $scope.SRModal = modal;                                                 
                                                    }, {
                                                    scope: $scope
                                                    });
        
        $scope.SaveSR = function(){
            console.log(devicedet);
            
               var deferred = $q.defer();
               
               var SRPriority = (document.getElementById("SRPriority").value);
               var SRSummary = (document.getElementById("SRSummary").value);
               var SRType = (document.getElementById("SRType").value);
               var SRArea = (document.getElementById("SRArea").value);
               var SRSubArea = (document.getElementById("SRSubArea").value);
               var randomId = ""+ Math.floor((Math.random() * 100000) + 1);
               
               console.log(SRPriority);
               
               var SRrecord =  {
                                 "SiebelMessage": {
                                 "IntObjectFormat": "Siebel Hierarchical",
                                 "IntObjectName": "LXK MPS Consumable Mgmt SR Creation IO",
                                 "MessageType": "Integration Object",
                                 "ListOfLXK MPS Consumable Mgmt SR Creation IO": {
                                 "LXK C Service Request (EAI)": {
                                 "Account Id" : "1-WHYUC1",
                                 "Id" : randomId,
                                 "SR Number": "1-" + randomId,
                                 "Asset Id": devicedet,
                                 "LXK MPS SR Type": SRType,
                                 "LXK MPS SR Area": SRArea,
                                 "LXK MPS SR Sub Area": SRSubArea
                                 }
                                 }
                                 }
                                 }; 
                                 
                $http({
                       method: 'POST',
                       url: url + "/SiebelRestUI/rest/order",
                       data: SRrecord,
                       headers: {
                       "Content-Type": "application/json",
                       'token' : token
                       }
                       })
                 .success(function(data,status,headers,config) {
                        console.log("success");
                        $scope.SRModal.hide();
                        $http.get('http://dlexwsbla007.na.ds.lexmark.com:8080/SiebelRestUI/rest/siebel?ioname=LXK MPS Service Request List&ss=[LXK C Service Request (EAI).Asset Id] LIKE %27'+devicedet+'%27&pagesize=10&startnum=1', {
                            headers: {
                                'token': token
                            }
                        }).then(function (response) {
                            console.log(response.data.LXKMPSServiceRequestList);
                            $scope.srlist = response.data.LXKMPSServiceRequestList;
                        });
                        
                          deferred.resolve(JSON.stringify(data));
                          })
                 .error(function(data,status,headers,config) {
                        console.log("error"+data+status+headers+config);
                        //console.log("error addContacts data is "+data);
                        //console.log("error addContacts status is "+status);
                        deferred.reject('error');
                        
                        })
                 return deferred.promise;
            
            
        }
        
        $scope.showSRModal = function() {
        console.log("SR modal");
        $scope.SRModal.show();
        }
        
        
        $scope.closeSRModal = function() {
        $scope.SRModal.hide();
        }
            
}
])
.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


    // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            controller: 'loginCtrl',
            templateUrl: "templates/login.html"
        })
        .state('home.aroundme', {
            url: "/aroundme",
            controller: 'TodoCtrl',
            views: {
                'menuContent': {
                    templateUrl: "templates/maps.html"
                }
            }
        })
        .state('home.device', {
            url: "/device",
            controller: 'TodoCtrl',
            views: {
                'menuContent': {
                    templateUrl: "templates/device.html"
                }
            }
        })
        .state('home.dash', {
            url: "/dash",
            controller: 'TodoCtrl',
            views: {
                'menuContent': {
                    templateUrl: "templates/dashboard.html"
                }
            }
        })
        .state('home.claims', {
            url: "/claims",
            controller: 'TodoCtrl',
            views: {
                'menuContent': {
                    templateUrl: "templates/claims.html"
                }
            }
        })

    .state('home', {
        url: "/home",
        controller: 'TodoCtrl',
        templateUrl: "templates/menu.html"
    })

        .state('home.contacts', {
               url: "/contacts",
               controller:'TodoCtrl',
               views:{
               'menuContent':{
               templateUrl: "templates/home.html",
               controller:'TodoCtrl'}}
               })

    .state('home.oppurtunity', {
        url: "/oppurtunity",
        controller: 'TodoCtrl',
        views: {
            'menuContent': {
                templateUrl: "templates/Oppurtunity-landing-page.html"
            }
        }
    })

    .state('home.sr', {
        url: "/sr",
        controller: 'TodoCtrl',
        views: {
            'menuContent': {
                templateUrl: "templates/servicerequest.html"
            }
        }
    })
    
    .state('home.activity', {
        url: "/activity",
        controller: 'TodoCtrl',
        views: {
            'menuContent': {
                templateUrl: "templates/activity.html"
            }
        }
    })  

    .state('contactdetailsedit', {
               url: "/contactdetailsedit",
               controller:'ContactDetailsCtrl',
               templateUrl: "templates/contact_details_edit.html"
               })

    .state('home.company', {
        url: "/company",
        controller: 'TodoCtrl',
        views: {
            'menuContent': {
                templateUrl: "templates/company-landing-page.html"
            }
        }
    })

    .state('home.contactStatic', {
        url: "/contactStatic",
        controller: 'TodoCtrl',
        views: {
            'menuContent': {
                templateUrl: "templates/contactStatic.html"
            }
        }
    })

    .state('home.scancard', {
        url: "/scancard",
        controller: 'ScancardCtrl',
        views: {
            'menuContent': {
                templateUrl: "templates/scan_card_page.html"
            }
        }
    })

        .state('savecontact', {
               url: "/savecontact",
               controller:'SaveContactCtrl',
               templateUrl: "templates/new_contact_retake.html"
               })
    .state('devicedetail', {
        url: "/devicedetail",
        controller: 'devicedetailctrl',
        templateUrl: "templates/devicedetail.html"
    })
    .state('activitydetail', {
        url: "/activitydetail",
        controller: 'activitydetailctrl',
        templateUrl: "templates/activitydetail.html"
    })

    .state('contactdetails', {
            url: "/contactdetails",
            controller: 'ContactDetailsCtrl',
            templateUrl: "templates/contact_details.html"
        })
        .state('contactStaticDetails', {
            url: "/contactStaticDetails",
            controller: 'ContactDetailsCtrl',
            templateUrl: "templates/contactStaticDetails.html"
        })

    .state('socialnetwork', {
        url: "/socialnetwork",
        controller: 'SocialNetworkCtrl',
        templateUrl: "templates/social_network_feeds.html"
    })

    .state('linkedin', {
        url: "/linkedin",
        controller: 'SocialNetworkCtrl',
        templateUrl: "templates/linkedin.html"
    })

    .state('companydetails', {
        url: "/companydetails",
        controller: 'CompanyDetailsCtrl',
        templateUrl: "templates/Company_detail.html"
    })

    .state('companynew', {
        url: "/companynew",
        controller: 'TodoCtrl',
        templateUrl: "templates/Company-new.html"
    })

    .state('oppurtunityreview', {
        url: "/oppurtunityreview",
        controller: 'OppurtunityCtrl',
        templateUrl: "templates/Oppurtunity-Review-page.html"
    })

    .state('opportunitynew', {
        url: "/opportunitynew",
        controller: 'OppurtunityCtrl',
        templateUrl: "templates/Oppurtunity-new.html"
    })

    .state('oppurtunityupdate', {
        url: "/oppurtunityupdate",
        controller: 'OppurtunityUpdateCtrl',
        templateUrl: "templates/Oppurtunity-Update-page.html"
    })

    .state('coverageteam', {
        url: "/coverageteam",
        controller: 'TodoCtrl',
        templateUrl: "templates/Coverage-team.html"
    })

    .state('emailedit', {
        url: "/emailedit",
        controller: 'ContactDetailsCtrl',
        templateUrl: "templates/Email-edit.html"
    })

    .state('emailcatagory', {
        url: "/emailcatagory",
        controller: 'ContactDetailsCtrl',
        templateUrl: "templates/Email-categoryview.html"
    })




    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab');

});