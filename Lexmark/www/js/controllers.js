angular.module('starter.controllers', ['uiGmapgoogle-maps', 'n3-pie-chart'])
.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})
.controller('loginCtrl', ['$scope', '$state','$ionicLoading','ContactsService','insideViewService','$ionicSideMenuDelegate', '$http','$window',function($scope, $state,$ionicLoading,ContactsService,InsideViewService,$ionicSideMenuDelegate, $http, $window) {                 
$scope.doLogin = function(user) {
console.log(user);
console.log($scope.loginPromise);
$scope.loginPromise = $http.get('http://dlexwsbla007.na.ds.lexmark.com:8080/SiebelRestUI/rest/login?uname='+user.uid+'&password='+user.pwd).then(function (response) {

console.log(response.data);
userInfo = {
       accessToken: response.data,
       userName: user.uid
     };
$window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
$window.sessionStorage["userName"] = user.uid;
if (userInfo.accessToken !="") {

$scope.LoginMsg = "contacts";
$state.go('home.dash');
} else {
$scope.LoginMsg = "User Id / Password entered is wrong..!!";
alert("Authentication Failed");
}
});
console.log($scope.loginPromise);
                          }
                          }])


.controller('AccountCtrl', function($scope) {
            
            
            })

.controller('ContactPopupCtrl',[ '$scope','ContactsService','$ionicLoading','$state', function($scope, ContactsService,$ionicLoading,$state) {
                                
                                $scope.contactDetails = ContactsService.getContactDetails();
                                $scope.getContacts = function() { 
                var response = ContactsService.getContacts();
                response.then(function(result){
                  console.log('response is '+result);
                  $ionicLoading.hide();
                  $state.go('home.contacts');
                  
                  }, function(reason) {
                  $ionicLoading.hide();
                //  alert("netwrok / server issue");
                  $state.go('home.contacts');
                  
                  });               
                }
                                }])

.controller('ScancardCtrl', [ "$scope", function($scope) {
                             
                             
                             }])


.controller("CompanyDetailsCtrl",["$scope", "$state", "$ionicNavBarDelegate",function($scope, $state, $ionicNavBarDelegate) {
                                  
                                  $scope.goBack = function() {
                                  $ionicNavBarDelegate.back();
                                  }
                                  
                                  $scope.showCreateOpportunity = function() {
                                  $state.go("opportunitynew");
                                  }
                                  
                                  $scope.showSocialNewtwork = function() {
                                  $state.go("socialnetwork");
                                  }
                                  
                                  }])



.controller("OppurtunityCtrl",["$scope", "$state", "$ionicNavBarDelegate", function($scope, $state, $ionicNavBarDelegate) {
                               
                               $scope.goBack = function() {
                               $ionicNavBarDelegate.back();
                               }
                               
                               $scope.editOppurtunityReview = function() {
                               $state.go("oppurtunityupdate");
                               }
                               
                               $scope.saveOpportunity = function() {
                               alert("to be implemented");
                               }
                               
                               $scope.showFilterDialog = function() {
                               $scope.modal.show();
                               }
                               
                               }])
.controller("OppurtunityUpdateCtrl",["$scope", "$state", "$ionicNavBarDelegate" , function($scope, $state, $ionicNavBarDelegate) {
                                     
                                     $scope.goBack = function() {
                                     
                                     $ionicNavBarDelegate.back();
                                     }
                                     
                                     
                                     $scope.save = function() {
                                     
                                     $ionicNavBarDelegate.back();
                                     }
                                     
                                     }])

.controller('SaveContactCtrl',['$scope','ContactsService','$ionicLoading','$ionicNavBarDelegate','$state',function($scope, ContactsService, $ionicLoading,$ionicNavBarDelegate,$state) {
                               
                               $scope.contact = ContactsService.getContact();
                               
                               
                               $scope.isTen = function($mobile){
                               console.log($mobile);
                               }
                               
                               $scope.goBack = function() {
                               $ionicNavBarDelegate.back();
                               }
                               
                               $scope.submitContact = function(isValid ) {
                               
                               var firstname = (document.getElementById("firstname").value);
                               var lastname = (document.getElementById("lastname").value);
                               var phone = (document.getElementById("phone").value);
                               var mobile = (document.getElementById("mobile").value);
                               var emailid = (document.getElementById("emailid").value);
                               var subaddress = (document.getElementById("subaddress").value);
                               var mainaddress = (document.getElementById("mainaddress").value);
                               var company = (document.getElementById("company").value);
                               var contactid= (document.getElementById("contactid").value);
                               var contact = {
                               "firstname":firstname,
                               "lastname":lastname,
                               "phone":phone,
                               "mobile":mobile,
                               "emailid":emailid,
                               "subaddress":subaddress,
                               "mainaddress":mainaddress,
                               "company":company,
                 "contactid":contactid
                               };
                               
                               $ionicLoading.show();
                               
                               var response = ContactsService.addContact(contact);
                               response.then(function(result){
                                             console.log('response is '+result);
                                             $ionicLoading.hide();
                                             alert("Contact saved successfully");
                                             $ionicLoading.show();

                                             // Refresh data
                                             
                                             var response = ContactsService.getContacts();
                                             response.then(function(result){
                                                           console.log('response is '+result);
                                                           $ionicLoading.hide();
                                                           $state.go('home.contacts');
                                                           
                                                           }, function(reason) {
                                                           $ionicLoading.hide();
                                                          // alert("netwrok / server issue");
                                                           $state.go('home.contacts');

                                                           });
                                             
                                             
                                             }, function(reason) {
                                             $ionicLoading.hide();
                                             alert("network / server issue");
                                             });
                               }
                               
                               $scope.reTask = function() {
                               alert("Retake to be implemented - Select back & Redo");
                               }
                               
                               
                               }])


.controller('ContactDetailsCtrl', ['$scope','$state','ContactsService','$ionicNavBarDelegate','$ionicModal',function($scope, $state, ContactsService, $ionicNavBarDelegate, $ionicModal) {
                                   
                                   $scope.contactdetails = ContactsService.getContactDetails();
                                   
                                   $scope.goBack = function() {
                                   $ionicNavBarDelegate.back();
                                   }
                                   
                                   
                                   $scope.alertDevelopment = function() {
                                   alert("To be developed");
                                   }
                                   
                                   $scope.editContact = function() {
                    $state.go("contactdetailsedit");
                                   }
                                   
                                   $scope.createOppurtunity = function() {
                                   $state.go("opportunitynew")
                                   }
                                   
                                   
                                   $scope.scheduleMeeting = function() {
                                   $scope.showScheduleModal();
                                   }
                                   
                                   $scope.deleteContact = function() {
                                   alert("To be implemented")
                                   }
                                   
                                   $ionicModal.fromTemplateUrl('contact_popup.html', function(modal) {
                                                               $scope.scheduleModal = modal;
                                                               }, {
                                                               scope: $scope
                                                               });
                                   
                                   
                                   $ionicModal.fromTemplateUrl('emailalert.html', function(modal) {
                                                               $scope.emailAlertModal = modal;
                                                               }, {
                                                               scope: $scope
                                                               });
                                   
                                   
                                   $scope.showScheduleModal = function() {
                                   $scope.scheduleModal.show();
                                   }
                                   
                                   $scope.hideScheduleModal = function() {
                                   $scope.scheduleModal.hide();
                                   }
                                   
                                   $scope.showEmailAlertModal = function() {
                                   $scope.emailAlertModal.show();
                                   }
                                   
                                   $scope.hideEmailAlertModal = function() {
                                   $scope.emailAlertModal.hide();
                                   }
                                   
                                   $scope.showMail = function() {
                                   //alert("show mail")
                                   $scope.hideScheduleModal();
                                   $state.go("emailcatagory");
                                   }
                                   
                                   $scope.showCalendar = function() {
                                   $scope.alertDevelopment();
                                   }
                                   
                                   
                                   $scope.listSocialNetwork = function() {
                                   $state.go("socialnetwork");
                                   
                                   }
                                   
                                   
                                   }])


.controller('SocialNetworkCtrl', ['$scope','$http','$state','ContactsService','$ionicNavBarDelegate','$ionicLoading','$ionicPopup','$rootScope',function($scope, $http, $state, ContactsService, $ionicNavBarDelegate, $ionicLoading,$ionicPopup,$rootScope) {
                                  
                                  $scope.goBack = function() {
                                  $ionicNavBarDelegate.back();
                                  }
                                  
                                  $scope.showUserProfile = function() {
                                  $state.go("linkedin");
                                  
                                  }
                                  
                                  $scope.showUserPro = function() {
                                  
                                  $scope.insideViewPostNameData = $rootScope.insideViewDataOne;
                                  $scope.insideViewPosteMailData = $rootScope.insideViewDataTwo;
                                  
                                  var insideViewPostName = $scope.insideViewPostNameData;
                                  var insideViewPosteMail = $scope.insideViewPosteMailData;
                                  
                                  $ionicLoading.show();
                                  
                                  console.log('Doing Insideview API Call 1');
                                  
                                  $http({
                                        
                                        url: 'https://login.insideview.com/Auth/login/v1/token',
                                        method: "POST",
                                        headers: {'Accept': 'application/json' ,'Content-Type': 'application/x-www-form-urlencoded'},
                                        transformRequest: function(obj) {
                                        var str = [];
                                        for(var p in obj)
                                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                        return str.join("&");
                                        },
                                        data: {
                                        clientId: '8lnveo5ddildubvjj62o' ,
                                        clientSecret: 'i67f95qbctdm4eaiduv2u37cddmh19d1h2o2hinj6acgfkkgpefl3242uk9p',
                                        grantType:'cred'
                                        }
                                        
                                        }).success(function (data, status, headers, config) {
                                                   
                                                   $ionicLoading.hide();
                                                   console.log('Inside View API Call Success');
                                                   console.log(data);
                                                   console.log(status);
                                                   console.log(headers);
                                                   console.log(config);
                                                   
                                                   
                                                   // JSON Parsing
                                                   
                                                   
                                                   var jsonOBJ = angular.fromJson(data.accessTokenDetails);
                                                   var accessTokenValue = jsonOBJ.accessToken;
                                                   console.log('Access Token Found :' + accessTokenValue);
                                                   
                                                   
                                                   
                                                   // Inside View API Call : 2
                                                   
                                                   console.log('Doing Insideview API Call 2');
                                                   
                                                   
                                                   $ionicLoading.show();
                                                   
                                                   
                                                   $http({
                                                         
                                                         url: 'https://api.insideview.com/api/v1/contacts',
                                                         method: "GET",
                                                         headers: {'accessToken': accessTokenValue ,'Accept': 'application/json' ,'Content-Type': 'application/x-www-form-urlencoded'},
                                                         transformRequest: function(obj) {
                                                         var str = [];
                                                         for(var p in obj)
                                                         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                                         return str.join("&");
                                                         },
                                                         params: {
                                                         email: insideViewPosteMail,
                                                         lastName: insideViewPostName
                                                         
                                                         }
                                                         
                                                         }).success(function (data, status, headers, config) {
                                                                    
                                                                    $ionicLoading.hide();
                                                                    console.log('Inside View API Call 2 Success');
                                                                    console.log('Status was :'+status);
                                                                    console.log(data);
                                                                    console.log(status);
                                                                    console.log(headers);
                                                                    console.log(config);
                                                                    
                                                                    
                                                                    // InsideView API Call 3
                                                                    
                                                                    
                                                                    $scope.insideviewContact = data.contacts[0];
                                                                    
                                                                    var insideContactId = $scope.insideviewContact.contactId;
                                                                    
                                                                    // var insideContactIdYahooCEO = '12251628';
                                                                    
                                                                    console.log("Contact Id is :"+insideContactId);
                                                                    
                                                                    
                                                                    var getContactSearchURL1 = 'https://api.insideview.com/api/v1/contact/';
                                                                    
                                                                    var getContactSearchURL2 = getContactSearchURL1+insideContactId;
                                                                    
                                                                    console.log("Contact URL is :"+getContactSearchURL2);
                                                                    
                                                                    
                                                                    
                                                                    $ionicLoading.show();
                                                                    
                                                                    
                                                                    
                                                                    $http({
                                                                          
                                                                          url: getContactSearchURL2,
                                                                          method: "GET",
                                                                          headers: {'accessToken': accessTokenValue ,'Accept': 'application/json' ,'Content-Type': 'application/x-www-form-urlencoded'},
                                                                          transformRequest: function(obj) {
                                                                          var str = [];
                                                                          for(var p in obj)
                                                                          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                                                          return str.join("&");
                                                                          },
                                                                          params: {
                                                                          companyId: insideContactId
                                                                          }
                                                                          
                                                                          }).success(function (data, status, headers, config) {
                                                                                     
                                                                                     $ionicLoading.hide();
                                                                                     console.log('Inside View API Call 3 Success');
                                                                                     console.log(data);
                                                                                     console.log(status);
                                                                                     console.log(headers);
                                                                                     console.log(config);
                                                                                     
                                                                                     
                                                                                     // Fetch fields from JSON
                                                                                     
                                                                                     var jsonOBJInside = angular.fromJson(data);
                                                                                     
                                                                                     var companyNameValue,descriptionValue,emailValue,facebookHandleValue,firstNameValue,imageUrlValue,lastNameValue,linkedinHandleValue,phoneValue,twitterHandleValue,contactTitleValue;
                                                                                     
                                                                                     firstNameValue = jsonOBJInside.firstName;
                                                                                     lastNameValue = jsonOBJInside.lastName;
                                                                                     companyNameValue = jsonOBJInside.companyName;
                                                                                     descriptionValue = jsonOBJInside.description;
                                                                                     emailValue = jsonOBJInside.email;
                                                                                     facebookHandleValue = jsonOBJInside.facebookHandle;
                                                                                     imageUrlValue = jsonOBJInside.imageUrl;
                                                                                     linkedinHandleValue = jsonOBJInside.linkedinHandle;
                                                                                     phoneValue = jsonOBJInside.phone;
                                                                                     twitterHandleValue = jsonOBJInside.twitterHandle;
                                                                                     contactTitleValue = jsonOBJInside.titles[0];
                                                                                     
                                                                                     console.log('Inside View API Single Contact Retrived');
                                                                                     
                                                                                     
                                                                                     console.log('firstNameValue Found :' + firstNameValue);
                                                                                     console.log('lastNameValue Found :' + lastNameValue);
                                                                                     console.log('companyNameValue Found :' + companyNameValue);
                                                                                     console.log('compandescriptionValueyName Found :' + descriptionValue);
                                                                                     console.log('emailValue Found :' + emailValue);
                                                                                     console.log('facebookHandleValue Found :' + facebookHandleValue);
                                                                                     console.log('imageUrlValue Found :' + imageUrlValue);
                                                                                     console.log('linkedinHandleValue Found :' + linkedinHandleValue);
                                                                                     console.log('phoneValue Found :' + phoneValue);
                                                                                     console.log('twitterHandleValue Found :' + twitterHandleValue);
                                                                                     console.log('contactTitleValue Found :'+contactTitleValue);
                                                                                     
                                                                                     // alert('Contact Matching :'+descriptionValue);
                                                                                     
                                                                                     // $state.go("insideView");
                                                                                     
                                                                                     
                                                                                     
                                                                                     // An alert dialog
                                                                                     
                                                                                     $ionicPopup.alert({
                                                                                                       title: 'Insideview',
                                                                                                       template: descriptionValue
                                                                                                       });
                                                                                     
                                                                                     
                                                                                     
                                                                                     }).error(function (data, status, headers, config) {
                                                                                              
                                                                                              $ionicLoading.hide();
                                                                                              console.log('Inside View API Call 3 Failed');
                                                                                              console.log(data);
                                                                                              console.log(status);
                                                                                              console.log(headers);
                                                                                              console.log(config);
                                                                                              
                                                                                              });
                                                                    
                                                                    
                                                                    
                                                                    
                                                                    
                                                                    }).error(function (data, status, headers, config) {
                                                                             
                                                                             $ionicLoading.hide();
                                                                             console.log('Inside View API Call 2 Failed');
                                                                             console.log(data);
                                                                             console.log(status);
                                                                             console.log(headers);
                                                                             console.log(config);
                                                                             
                                                                             });
                                                   
                                                   
                                                   }).error(function (data, status, headers, config) {
                                                            
                                                            $ionicLoading.hide();
                                                            console.log('Inside View API Call Failed');
                                                            console.log(data);
                                                            console.log(status);
                                                            console.log(headers);
                                                            console.log(config);
                                                            
                                                            alert('Service not found !!');
                                                            
                                                            });
                                  
                                  }
                                  
                                  }])

/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
.factory('Projects', function() {
         return{
         getLastActiveIndex: function() {
         return parseInt(window.localStorage['lastActiveProject']) || 0;
         },
         setLastActiveIndex: function(index) {
         window.localStorage['lastActiveProject'] = index;
         }
         }
         })



.controller('TodoCtrl', ['$scope','uiGmapGoogleMapApi', '$timeout', '$ionicModal', 'Projects', '$ionicSideMenuDelegate' ,'$state' ,'$cordovaCamera', '$http','ContactsService', '$ionicLoading', '$ionicNavBarDelegate',  '$ionicViewService','$location',
                        '$rootScope',function($scope, uiGmapGoogleMapApi,$timeout, $ionicModal, Projects, $ionicSideMenuDelegate ,$state , $cordovaCamera,  $http, ContactsService, $ionicLoading, $ionicNavBarDelegate,  $ionicViewService, $location,$rootScope, $cordovaBarcodeScanner) {
						
                        $scope.contacts = ContactsService.all();
						
                        $scope.chartTypes = [
    {"id": "line", "title": "Line"},
    {"id": "spline", "title": "Smooth line"},
    {"id": "area", "title": "Area"},
    {"id": "areaspline", "title": "Smooth area"},
    {"id": "column", "title": "Column"},
    {"id": "bar", "title": "Bar"},
    {"id": "pie", "title": "Pie"},
    {"id": "scatter", "title": "Scatter"}
  ];

  $scope.dashStyles = [
    {"id": "Solid", "title": "Solid"},
    {"id": "ShortDash", "title": "ShortDash"},
    {"id": "ShortDot", "title": "ShortDot"},
    {"id": "ShortDashDot", "title": "ShortDashDot"},
    {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
    {"id": "Dot", "title": "Dot"},
    {"id": "Dash", "title": "Dash"},
    {"id": "LongDash", "title": "LongDash"},
    {"id": "DashDot", "title": "DashDot"},
    {"id": "LongDashDot", "title": "LongDashDot"},
    {"id": "LongDashDotDot", "title": "LongDashDotDot"}
  ];

$scope.chartSeries = [
    {"name": "Best Buy Purchasing LLC", "data": [1, 2, 4, 7, 3]},
    {"name": "ADP Inc.", "data": [3, 1, null, 5, 2], connectNulls: true},
    {"name": "Walmart US", "data": [5, 2, 2, 3, 5], type: "column"},
    {"name": "AmeriCredit Corp", "data": [1, 1, 2, 3, 2], type: "column"},
  {"name": "Target Corporation", "data": [4, 4, 7, 5, 2], type: "column"}
  ];

  $scope.chartStack = [
    {"id": '', "title": "No"},
    {"id": "normal", "title": "Normal"},
    {"id": "percent", "title": "Percent"}
  ];

  $scope.chartConfig = {
    options: {
      chart: {
        type: 'areaspline'
      },
      plotOptions: {
        series: {
          stacking: ''
        }
      }
    },
     series: $scope.chartSeries,
    title: {
      text: 'Install Base'
    },
   xAxis: {
            categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN']
        },
   yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Installed Devices'
            }
        },
    credits: {
      enabled: true
    },
    loading: false,
    size: {}
  }
   $scope.chartConfig1 = {

  chart: {
                    type: 'pie'
                },
                title: {
                    text: 'Open Activities by Opportunity'
                },
                subtitle: {
                    text: 'Click the slices to view Activities'
                },
                plotOptions: {
                    series: {
              type: 'pie',
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}: {point.y:.1f}%'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                },

                series: [{
                    name: 'Open Activities',
          type: 'pie',
                    colorByPoint: true,
                    data: [['Best Buy Purchasing LLC',9],['ADP Inc.', 8], ['Walmart US', 1] ,['AmeriCredit Corp',7],['Target Corporation',3]]
                }]
  };

                        
                        var data = {list:[
                                          {
                                          "CompanyName":"Western Union",
                                          "ContactPerson":"Rossel L Warwick",
                                          "Type":"Insurance"
                                          },
                                          {
                                          "CompanyName":"General Electric",
                                          "ContactPerson":"Ronald Woodman",
                                          "Type":"Manufacturing"
                                          },
                                          {
                                          "CompanyName":"Shell",
                                          "ContactPerson":"Rebecca Lilly",
                                          "Type":"Energy Utility"
                                          },
                                          {
                                          "CompanyName":"General Electric",
                                          "ContactPerson":"Ronald Woodman",
                                          "Type":"Manufacturing"
                                          }
                                          
                                          ]
                        
                        };
                        $scope.data1 = [
  {label: "Open", value: 12.2, color: "red"}, 
  {label: "Closed", value: 45, color: "#00ff00"},
  {label: "Pending", value: 10, color: "rgb(0, 0, 255)"}
];
$scope.options = {thickness: 20};
                        
  //)
 // };
                        $scope.companyList = data.list;
                        
                        
                        // Static Contact Data
                        
                        var data = {list:[
                                          {
                                          "Data1":"Satya Nadella",
                                          "Data2":"satyan@microsoft.com",
                                          "Data3":"+1 425 882 8080",
                                          "Data4":"Director of Microsoft Corporation"
                                          },
                                          {
                                          "Data1":"Marissa Mayer",
                                          "Data2":"http://www.facebook.com/222632",
                                          "Data3":"(350) 983-4800",
                                          "Data4":"CEO"
                                          },
                                          {
                                          "Data1":"Mark Zuckerberg",
                                          "Data2":"mzuckerberg@fb.com",
                                          "Data3":"(415) 568-9840",
                                          "Data4":"Chairman of the Board"
                                          },
                                          {
                                          "Data1":"Larry Page",
                                          "Data2":"page@google.com",
                                          "Data3":"(650) 623-4000",
                                          "Data4":"Chief Executive Officer"
                                          },
                                          {
                                          "Data1":"Umberto Milletti",
                                          "Data2":"umberto@insideview.com",
                                          "Data3":"(415) 728-9300",
                                          "Data4":"Chief Executive Officer & Founder"
                                          }
                                          ]
                        
                        };
                        
                        $scope.staticContactList = data.list;
                        
                        //change in contacts
                        $scope.$watch(ContactsService.contacts,function(){
                                      $scope.contacts = ContactsService.all();
                                      // $scope.$apply();
                                      },true);
                        
                        $scope.contactBackslash = function(contact) {
                        
                        if(contact.WorkPhone && contact.CellularPhone){
                        return true;
                        } else {
                        return false;
                        }
                        
                        }
                        
                        
                        $scope.contactComma = function(contact) {
                        
                        if(contact.JobTitle && contact.AccountName){
                        return true;
                        } else {
                        return false;
                        }
                        
                        }
                        
                        $scope.logout = function() {
                        console.log("login screen")
                        // using the ionicViewService to hide the back button on next view
                        $ionicViewService.nextViewOptions({
                                                          disableBack: true
                                                          });
                        // Go back to home
                        $location.path('/');
                        }
                        
                        $scope.goBack = function() {
                        console.log("go back")
                        $ionicNavBarDelegate.back();
                        }
                        
                        
                        
                        // Create our modal
                        $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
                                                    $scope.taskModal = modal;
                                                    }, {
                                                    scope: $scope
                                                    });
                        
                        $ionicModal.fromTemplateUrl('opportunitymodal.html', function(modal) {
                                                    $scope.opportunityFilterModal = modal;
                                                    }, {
                                                    scope: $scope
                                                    });
                        
                        
                        $ionicModal.fromTemplateUrl('companymodal.html', function(modal) {
                                                    
                                                    $scope.companyModal = modal;
                                                    
                                                    }, {
                                                    scope: $scope
                                                    });
                        
                        $scope.newTask = function() {
                        $scope.taskModal.show();
                        };
                        
                        $scope.closeNewTask = function() {
                        $scope.taskModal.hide();
                        }
                        
                        
                        $scope.showOpportunityModal = function() {
                        $scope.opportunityFilterModal.show();
                        }
                        
                        
                        $scope.closeOpportunityModal = function() {
                        $scope.opportunityFilterModal.hide();
                        }
                        
                        
                        $scope.showCompanyModal = function() {
                        $scope.companyModal.show();
                        }
                        
                        
                        $scope.closeCompanyModal = function() {
                        $scope.companyModal.hide();
                        }
                        
                        
                        $scope.createCompany = function() {
                        $state.go("companynew");
                        }
                        
                        $scope.createOpportunity = function() {
                        $state.go("opportunitynew");
                        }
                        
                        $scope.toggleProjects = function() {
                        $ionicSideMenuDelegate.toggleLeft();
                        };
                        
                        $scope.showContactDetails = function(id) {
                        ContactsService.setContactDetails(id);
                        
                        
                        $state.go("contactdetails");
                        
                        $rootScope.insideViewDataOne = id.LastName;
                        $rootScope.insideViewDataTwo = id.EmailAddress;
                        
                        }
                        
                        $scope.showCompanyDetails = function() {
                        $state.go("companydetails");
                        }
                        
                        // Call static contactStaticDetails
                        
                        $scope.showStaticContactDetails = function() {
                        $state.go("contactStaticDetails");
                        }
                        
                        $scope.showOppurtunityReview = function() {
                        $state.go("oppurtunityreview");
                        }
                        
                        $scope.showCoverageTeam = function() {
                        $state.go("coverageteam");
                        }
                        
                        $scope.listPhoneContacts = function() {
                        
                        navigator.contacts.pickContact(function(contact){
                                                       console.log("contact is "+JSON.stringify(contact));
                                                       $scope.closeContactPopup();
                                                       
                                                       var firstname, lastname, phone, mobile, emailIds, address1, address2, company ="";
                                                       
                                                       if(contact.name) {
                                                       if(contact.name.givenName) {
                                                       firstname = contact.name.givenName;
                                                       } else {
                                                       firstname = "";
                                                       }
                                                       
                                                       if(contact.name.familyName) {
                                                       lastname = contact.name.familyName;
                                                       } else {
                                                       lastname="";
                                                       }
                                                       }else {
                                                       firstname = "";
                                                       lastname = "";
                                                       }
                                                       
                                                       if(contact.phoneNumbers) {
                                                       contact.phoneNumbers.forEach(function(entry) {
                                                                                    if(entry.type =="mobile") {
                                                                                    mobile = entry.value;
                                                                                    } else if(entry.type == "work") {
                                                                                    phone = entry.value;
                                                                                    } else {
                                                                                    phone = entry.value;
                                                                                    }
                                                                                    
                                                                                    });
                                                       
                                                       } else {
                                                       mobile="";
                                                       phone="";
                                                       }
                                                       
                                                       if(contact.emails) {
                                                       contact.emails.forEach(function(entry) {
                                                                              emailIds =entry.value + " ";
                                                                              })
                                                       } else {
                                                       emailIds = " ";
                                                       }
                                                       
                                                       if(contact.organizations) {
                                                       contact.organizations.forEach(function(entry) {
                                                                                     company = entry.name +" ";
                                                                                     })
                                                       }
                                                       
                                                       if(contact.addresses) {
                                                       
                                                       contact.addresses.forEach(function(entry){
                                                                                 if(entry.type == "work"){
                                                                                 address1 = entry.value;
                                                                                 address2 = entry.value;
                                                                                 } else{
                                                                                 address2="";
                                                                                 address1="";
                                                                                 }
                                                                                 })
                                                       
                                                       }
                                                       
                                                       
                                                       var contact = {
                                                       "firstname":firstname,
                                                       "lastname":lastname,
                                                       "phone":phone,
                                                       "mobile":mobile,
                                                       "emailid":emailIds,
                                                       "subaddress":address1,
                                                       "mainaddress":address2,
                                                       "company":company
                                                       };
                                                       ContactsService.setContact(contact);
                                                       $state.go('savecontact');
                                                       },function(err){
                                                       alert('contact fetching error');
                                                       });
                        
                        }
                        
                        $scope.alertDevelopment = function() {
                        alert("To be implemented");
                        }
                        
                        
                        $scope.scanCard = function() {
                        alert("scan card");
                        $scope.takePicture();
                        }
                        
                        
                        $scope.scanBusinessCard = function() {
                        $scope.closeContactPopup();
                        $scope.takePicture();
                        }
                        
                        $scope.enterBusinessContact = function() {
                        var record = {};
                        ContactsService.setContact(record);
                        $scope.closeContactPopup();
                        $state.go('savecontact');
                        }
                        
                        $scope.closeContactPopup = function() {
                        $scope.taskModal.hide();
                        }
                        
                        $scope.takePicture = function() {
                        console.log("take picture");
                        
                        var options = {
                        quality : 90,
                        destinationType : Camera.DestinationType.FILE_URL,
                        sourceType : Camera.PictureSourceType.CAMERA,
                        allowEdit : false,
                        encodingType: Camera.EncodingType.JPEG,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false,
                        targetHeight: 700,
                        targetWidth: 700
                        };
                        
                        $cordovaCamera.getPicture(options).then(function(imageUrl) {
                                                                console.log("image captured "+imageUrl);
                                                                $ionicLoading.show();
                                                                window.resolveLocalFileSystemURL(imageUrl, function(fileEntry){
                                                                                                 fileEntry.getMetadata(function(metadata){
                                                                                                                       console.log("size is "+metadata.size);
                                                                                                                       var camcardData = ContactsService.getCamcardData(imageUrl ,metadata.size);
                                                                                                                       camcardData.then(function(result){
                                                                                                                                        alert("Business Card decoded")
                                                                                                                                        $ionicLoading.hide();
                                                                                                                                        $state.go('savecontact');
                                                                                                                                        },function(error){
                                                                                                                                        alert("scan card error"+error);
                                                                                                                                        $ionicLoading.hide();
                                                                                                                                        $scope.errorOcrData(error);
                                                                                                                                        });
                                                                                                                       }, function(error){
                                                                                                                       console.log("Image path error");
                                                                                                                       $ionicLoading.hide();
                                                                                                                       $scope.errorOcrData(error);
                                                                                                                       })
                                                                                                 }, function(error){
                                                                                                 $ionicLoading.hide();
                                                                                                 $scope.errorOcrData(error);
                                                                                                 });
                                                                });
                        
                        }
                        
                        $scope.errorOcrData = function(reason) {
                        alert("Error in fetching ocr data. Enter contact manually"+reason);
                        var contact = {};
                        ContactsService.setContact(contact);
                        $state.go('savecontact');
                        }
                        
                        $scope.listContacts = function() {
                        console.log("list contacts");
                        }
                        }])

.controller("mapctrl", "uiGmapGoogleMapApi", ["$scope", "$state", "$ionicNavBarDelegate", '$ionicSideMenuDelegate', function($scope, $state, $ionicNavBarDelegate, $ionicSideMenuDelegate) {
    alert("I am inside");
   
 
                               }])