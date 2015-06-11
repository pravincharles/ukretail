var url = "http://dlexwsbla007.na.ds.lexmark.com:8080";
angular.module('starter.services', [])


.factory('ContactsService', ['$http','$q','$cordovaFileTransfer','$window','$ionicLoading',function($http, $q,$cordovaFileTransfer,$window,$ionicLoading) {
                             

    
                             /*
                              Contacts fetched from siebel server
                              */
                             var contacts = {};
                             
                             /*
                              contact used to transfer from phonebook/scancard to contact save form
                              */
                             
                             var contact = {};
                             
                             /*
                              contact details used in contact details view
                              */
                             var contactDetails = {};
                             
                             /*
                              business card data
                              */
                             var businessCard = {};
                             
                             return {
                             setContactDetails: function(record) {
                             contactDetails = record;
                             },
                             getContactDetails: function(){
                             return contactDetails;
                             },
                             setContact: function(record) {
                             console.log("set contact called");
                             contact = record;
                             },
                             getContact: function(){
                             return contact;
                             },
                             all: function() {
                             return contacts;
                             },
                             getContacts: function() {
                             console.log("FUNC CALL");
                             var userInfo;
                             userInfo = JSON.parse(sessionStorage.userInfo);
                             console.log(userInfo);
                             var token = userInfo.accessToken;
                             var deferred = $q.defer();
							 $ionicLoading.show();
                             $http.get(url + "/SiebelRestUI/rest/siebel?ioname=LXK Contact SCB&ss=[LXK Contact SCB.Account Id]='1-4GVCA'", {
                            headers: {'token': token}
                                    }
                                    )                                   
                             .success(function(data, status, headers, config) {
							 $ionicLoading.hide();
                                      console.log("success listcontacts data is "+JSON.stringify(data));
                                      var response = JSON.stringify(data);
                                      contacts = data.LXKContactSCB;
                                      console.log("CONTACT_ID:" +contacts[0].Id);
                                      deferred.resolve(contacts);
                                      })
                             .error(function(data, status, headers, config) {
							 $ionicLoading.hide();
                                    console.log("error listcontacts status is "+status);
                                    
                                    deferred.reject('error');
                                    })
                             return deferred.promise;
                             },
                             addContact: function(contact) {
                              var userInfo;
                             userInfo = JSON.parse(sessionStorage.userInfo);
                             console.log(userInfo);
                             var token = userInfo.accessToken;
                            var currentObj = this;
                             console.log("contact is "+JSON.stringify(contact));
                             var deferred = $q.defer();
                             var randomId = ""+ Math.floor((Math.random() * 100000) + 1)
                             if(contact.contactid == "") 
                             {
                                contact.contactid = randomId;
                             }

                             var record =  {
                             "SiebelMessage": {
                             "IntObjectFormat": "Siebel Hierarchical",
                             "IntObjectName": "LXK Contact SCB",
                             "MessageType": "Integration Object",
                             "ListOfLXK Contact SCB": {
                             "LXK Contact SCB": {
                             "First Name": contact.firstname,
                             "Last Name": contact.lastname,
                             //"Person UId": contact.contactid,
                             "Work Phone #":contact.phone,
                             //"Cellular Phone #":contact.mobile,
                             "operation":"upsert",
                             "Email Address": contact.emailid,
                             "Id":contact.contactid,
                             "Account Id": "1-4GVCA"
/*                                  "ListOfContact_Account": {
 "Contact_Account": {
 "operation":"upsert",
 //"Account Row Id": "1-6A73",
 
 "Account Row Id": "1-69QM",
 "operation":"upsert",
 "IsPrimaryMVG":"Y"
 }
 }, */
/*                                  "ListOfContact_INS Personal Address": {
 "Contact_INS Personal Address": {
 "operation":"upsert",
 "INS Personal City": contact.mainaddress,
 "INS Personal Street Address": contact.subaddress,
 "INS Personal State": "NY",
 "INS Personal Postal Code": "147856",
 "IsPrimaryMVG":"Y"
 
 }
 } */
                             }
                             }
                             }
                             };

                              console.log("contact is "+JSON.stringify(record));
                              console.log(token);
                             $http({
                                   method: 'POST',
                                   url: url + "/SiebelRestUI/rest/order",
                                   data: record,
                                   headers: {
                                   "Content-Type": "application/json",
                                   'token' : token
                                   }
                                   })
                             .success(function(data,status,headers,config) {
                                      console.log("success");
                                      currentObj.getContacts();
                                      console.log("success addContacts data is "+JSON.stringify(data));
                                      console.log("success addContacts status is "+status);
                                      deferred.resolve(JSON.stringify(data));
                                      })
                             .error(function(data,status,headers,config) {
                                    console.log("error"+data+status+headers+config);
                                    console.log("error addContacts data is "+data);
                                    console.log("error addContacts status is "+status);
                                    deferred.reject('error');
                                    
                                    })
                             return deferred.promise;
                             },
                             
                                                      
                             parseVcard: function(input) {
                             //Vcard to JSON
                             var Re1 = /^(version|fn|title|org):(.+)$/i;
                             var Re2 = /^([^:;]+);([^:]+):(.+)$/;
                             var ReKey = /item\d{1,2}\./;
                             var fields = {};
                             
                             input.split(/\r\n|\r|\n/).forEach(function (line) {
                                                               var results, key;
                                                               if (Re1.test(line)) {
                                                               results = line.match(Re1);
                                                               key = results[1].toLowerCase();
                                                               fields[key] = results[2];
                                                               } else if (Re2.test(line)) {
                                                               results = line.match(Re2);
                                                               key = results[1].replace(ReKey, '').toLowerCase();
                                                               
                                                               var meta = {};
                                                               results[2].split(';')
                                                               .map(function (p, i) {
                                                                    var match = p.match(/([a-z]+)=(.*)/i);
                                                                    if (match) {
                                                                    return [match[1], match[2]];
                                                                    } else {
                                                                    return ["TYPE" + (i === 0 ? "" : i), p];
                                                                    }
                                                                    })
                                                               .forEach(function (p) {
                                                                        meta[p[0]] = p[1];
                                                                        });
                                                               
                                                               if (!fields[key]) fields[key] = [];
                                                               
                                                               fields[key].push({
                                                                                meta: meta,
                                                                                value: results[3].split(';')
                                                                                })
                                                               }
                                                               });
                             
                             return fields;
                             },
                             setCamcardContact : function(dataJSON){
                             
                             
                             var contactData = dataJSON;
                             
                             console.log("contactData is "+contactData);
                             console.log("contactData version "+contactData.version);
                             
                             var thisObj = this;
                             var firstname, lastname, phone, mobile, emailIds, address1, address2, company = "";
                             // Contact name
                             var contactName = contactData.n;
                             
                             for(var data in contactName){
                             
                             console.log(" mobility names1 "+contactName[data].value[0]);
                             
                             console.log(" name"+contactName[data].value[0]);
                             firstname = contactName[data].value[1];
                             lastname = contactName[data].value[0];
                             }
                             
                             //contact primary email
                             var contactEmail = contactData.email;
                             for(var data in contactEmail){
                             if(contactEmail[data].value.length > 0) {
                             console.log(" email "+contactEmail[data].value[0])
                             emailIds = contactEmail[data].value[0];
                             }
                             }
                             
                             //contact Work & home phone numbers
                             var contactNumbers = contactData.tel;
                             
                             
                             for(var data in contactNumbers){
                             console.log(" data is "+data.length);
                             console.log("type "+contactNumbers[data].meta.TYPE)
                             
                             if(contactNumbers[data].value.length > 0) {
                             if(contactNumbers[data].meta.TYPE == "CELL"){
                             mobile = contactNumbers[data].value[0];
                             } else if (contactNumbers[data].meta.TYPE == "WORK") {
                             phone = contactNumbers[data].value[0];
                             }else {
                             phone = contactNumbers[data].value[0];
                             mobile = contactNumbers[data].value[0];
                             }
                             console.log("number "+contactNumbers[data].value[0])
                             }
                             
                             }
                             
                             //company name
                             var contactOrg = contactData.org
                             for(var data in contactOrg){
                             if(contactOrg[data].value.length > 0){
                             console.log(" company "+contactOrg[data].value[0])
                             company = contactOrg[data].value[0];
                             
                             }
                             }
                             
                             //company address
                             
                             var contactAddress = contactData.adr
                             var address="";
                             for(var data in contactAddress){
                             if(contactAddress[data].value.length > 0){
                             for(var index in contactAddress[data].value){
                             address = address + " " + contactAddress[data].value[index];
                             }
                             }
                             }
                             // address1 = address;
                             
                             // Split address
                             
                             var dummyAddress = address;
                             
                             var splitAddress1 = dummyAddress.split('.');
                             
                             var addressOne = splitAddress1[0];
                             var addressTwo = splitAddress1[1];
                             var addressThree = splitAddress1[2];
                             
                             console.log("SplitAddress1 is "+addressOne);
                             console.log("SplitAddress2 is "+addressTwo);
                             console.log("SplitAddress3 is "+addressThree);
                             
                             var originalSubAdd = addressOne.concat(","+addressTwo);
                             var originalMainAdd = (addressThree);
                             
                             console.log("originalSubAdd is "+originalSubAdd);
                             console.log("originalMainAdd is "+originalMainAdd);
                             
                             
                             console.log("first name"+firstname);
                             console.log("last name"+lastname);
                             console.log("phone "+phone)
                             console.log("mobile "+mobile)
                             console.log("company"+company)
                             console.log("address is "+address1);
                             
                             
                             var contact = {
                             "firstname":firstname,
                             "lastname":lastname,
                             "phone":phone,
                             "mobile":mobile,
                             "emailid":emailIds,
                             "subaddress":originalSubAdd,
                             "mainaddress":originalMainAdd,
                             "company":company
                             };
                             thisObj.setContact(contact);
                             console.log("final contact is "+JSON.stringify(contact));
                             },
                             getOcrData : function(imageData) {
                             var deferred = $q.defer();
                             $http({
                                   method: 'POST',
                                   url: 'http://localhost:25002/TestPost/rest/actpost',
                                   data: imageData,
                                   headers: {
                                   'Content-Type': 'text/plain'
                                   }
                                   })
                             .success(function(data, status, headers, config) {
                                      console.log("success json ocr data is "+JSON.stringify(data));
                                      console.log("success ocr data is "+data);
                                      console.log("success ocr status is "+status);
                                      var jsonData = JSON.stringify(data)
                                      deferred.resolve(data);
                                      })
                             .error(function(data, status, headers, config) {
                                    console.log("error ocr status is "+status);
                                    deferred.reject('error'+status);
                                    })
                             return deferred.promise;
                             },
                             getCamcardData: function(imageUrl, size) {
                             var thisObj = this;
                             var deferred = $q.defer();
                             console.log("get camcard data")
                             var myImg = imageUrl;//$scope.picData;
                             var options = new FileUploadOptions();
                             options.fileKey="post";
                             options.chunkedMode = false;
                             options.mimeType = "image/jpeg";
                             var url = "http://bcr1.intsig.net/BCRService/BCR_VCF2?PIN=&user=senthil.rajan2@wipro.com&pass=G3D6BNJFFS36YATK&lang=1&size="+size;
                             console.log("camcard url is "+url);
                             $cordovaFileTransfer.upload(url, imageUrl, options).then(function(success){
                                                                                  console.log("Code = " + success.responseCode);
                                                                                  console.log("Response = " + success.response);
                                                                                  console.log("Sent = " + success.bytesSent);
                                                                                  var vcardData = thisObj.parseVcard(success.response);
                                                                                  console.log("vcard data is "+JSON.stringify(vcardData));
                                                                                  thisObj.setCamcardContact(vcardData);
                                                                                  deferred.resolve(success.response);
                                                                                  }, function(error){
                                                                                  console.log("upload error source " + error.source);
                                                                                  console.log("upload error target " + error.target);
                                                                                  deferred.reject('Camcard error'+error.code);
                                                                                  });
                             return deferred.promise;
                             }
                             }
                             }])

.factory('CompanyService', ['$http','$q',function($http, $q) {
                            
                            var companies;
                            return {
                            all: function() {
                            return companies;
                            },
                            getCompanies: function() {
                            var deferred = $q.defer();
                            $http({
                                  method: 'get',
                                  url: "http://localhost:25002/SiebelRestWL/rest/act?ioname=Account%20IO&ss=[Account.Id] LIKE ‘*’"
                                  })
                            .success(function(data, status, headers, config) {
                                     console.log("success listcontacts data is "+JSON.stringify(data));
                                     companies = JSON.stringify(data);
                                     deferred.resolve(companies);
                                     })
                            .error(function(data, status, headers, config) {
                                   console.log("error listcontacts status is "+status);
                                   deferred.reject('error');
                                   })
                            return deferred.promise;
                            }
                            
                            }
                            }])


.factory('insideViewService', ['$http','$q',function($http, $q,$ionicLoading) {
                               
                               var insideViewServiceData;
                               return {
                               all: function() {
                               return insideViewServiceData;
                               },
                               getinsideViewServiceData: function() {
                               var deferred = $q.defer();
                               
                               
                               
                               $ionicLoading.show({
                                                  template: 'Validating API Call 1...'
                                                  });
                               
                               console.log('Doing Insideview API Call 1');
                               
                               
                               // Inside View API Call : 1
                               
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
                                                
                                                alert('Access Token Found : = ' + jsonOBJ.accessToken);
                                                
                                                var accessTokenValue = jsonOBJ.accessToken;
                                                console.log('Access Token Found :' + accessTokenValue);
                                                
                                                
                                                
                                                // Inside View API Call : 2
                                                
                                                console.log('Doing Insideview API Call 2');
                                                
                                                
                                                $ionicLoading.show({
                                                                   template: 'Validating API Call 2...'
                                                                   });
                                                
                                                
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
                                                      email: 'shivsuthanm@gmail.com' ,
                                                      lastName: 'M'
                                                      }
                                                      
                                                      }).success(function (data, status, headers, config) {
                                                                 
                                                                 $ionicLoading.hide();
                                                                 console.log('Inside View API Call 2 Success');
                                                                 console.log(data);
                                                                 console.log(status);
                                                                 console.log(headers);
                                                                 console.log(config);
                                                                 
                                                                 
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
                                                         
                                                         
                                                         
                                                         })
                               
                               return deferred.promise;
                               }
                               
                               }
                               }])


