angular.module('app')
 .controller('UsersController',[ '$scope' , '$state','$stateParams','$location', 'leafletData','$uibModal', 'Restangular','$filter' , 'osmOverpassAPI','$rootScope','$http','svrUser','svrLocation','svrOverPass','$compile', 'notify',function($scope , $state , $stateParams,$location, leafletData ,$uibModal,Restangular,$filter,osmOverpassAPI,$rootScope,$http,svrUser,svrLocation,svrOverPass,$compile,notify){

// CONFIG CONTROLLER PARAMETER
$scope.letters=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
$scope.active_letter = 0

$scope.cards = [
  {
  name:"Tchatat william",
  email:"wtchatat@gmail.com",
  telphone:"+237 588 858 499",
  onmap:true,
  location_id:1
},
{
name:"Nguetchou jovanny",
email:"jovanytch@gmail.com",
telephone:"+237 758 828 399",
onmap:false
}
]

$scope.config_gmail = {
  // .apps.googleusercontent.com'
  //   'client_id': "970874916755-oq67v0ci5edl1tcjf5nh77su0fpm4nc9",
  //   'scope': 'https://www.google.com/m8/feeds'
}

$scope.inviteContacts = function() {
  //
  // $auth.authenticate('google')
  //      .then(function(resp) {
  //        console(resp)
  //      })
  //      .catch(function(resp) {
  //        console(resp)
  //      });
  //
  //
  window.addEventListener('message', $scope.fetch, false);
  window.open('/users/auth/gmail','_blank', 'closebuttoncaption=Cancel')



}

$scope.fetch = function(auth) {
  console.log(auth)
  var token = auth['data']['credentials']['token']
  console.log(token)
    window.removeEventListener('message', $scope.fetch, false);

    $http.get("https://www.google.com/m8/feeds/contacts/default/full?access_token=" + token + "&alt=json").then(function(response) {
        console.log(response);
        console.log(response.data.feed.entry);
        //contacts = contacts_josn["feed"]["entry"].collect{|p| {name: p["title"]["$t"], email: p["gd$email"][0]["address"]} }
        $scope.contacts = _.collect(response.data.feed.entry,function(v){
          return {name: v["title"]["$t"], email: v["gd$email"][0]["address"]}
        }); // to assign data
        console.log($scope.contacts)
    });

}



$scope.aes = function(name){
  //CryptoJS.AES.encrypt(name, "wawa");
  return (name + "wawa");
}

$scope.iframe = function(name){
  var link = "http://localhost:3000/home/app" ;
  return link+"?p=" + $scope.aes(name)
}

$scope.applications = [
  {
    name: "zippy",
    addresse_name: "wpaip",
    zone_name:"zpaip",
    logo:"" ,
    iframe : $scope.iframe("zippy")
},
{
  name: "wawa",
  addresse_name: "atrtr",
  zone_name:"kioip",
  logo:"",
  iframe : $scope.iframe("wawa")
}
]


$scope.get_links = function(name){
  return "app/templates/users/templates/"+name+".html";

}



$scope.get_active_class = function(index){
    if($scope.active_letter == index){
      return "active";
    } ;
}

$scope.get_gmail_contacts = function(){
   var client_id = "970874916755-oq67v0ci5edl1tcjf5nh77su0fpm4nc9"
  //https://accounts.google.com/o/oauth2/auth?client_id=&scope=https%3A%2F%2Fwww.google.com%2Fm8%2Ffeeds+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo%23email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&access_type=online&approval_prompt=auto&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcontacts%2Fgmail%2Fcallback
}

$scope.set_active_page = function(name){
  $scope.active_page_url = $scope.get_links(name)
}
$scope.letters_filter = function(index){
  $scope.active_letter = index
}

$scope.create_appli = function(){
  $scope.active_app = {}
  $scope.set_active_page("third_part")

}
$scope.view = function(name){
  return "app/templates/views/"+name+".html";
}
$scope.view_app = function(){
   return $scope.view("app")
}
$scope.show_app = function(index){
  $scope.active_app = $scope.applications[index] ;
  $scope.ismodifiable = false ;
  $scope.set_active_page("show_app")
}

$scope.show_app_modifier = function(){
  $scope.ismodifiable = true
  $scope.set_active_page("show_app")
}

$scope.form = function(name){
  return "app/templates/forms/"+name+".html";
}
$scope.form_app = function(){
  return $scope.form("app");
}

$scope.users_settings = function(){
  $scope.set_active_page("profil_settings_3")
}
$scope.list_contacts = function(){
  $scope.set_active_page("list_contacts")
}

$scope.add_contact = function(){
  $scope.set_active_page("add_contact")
  $scope.active_contact = {}
   $scope.disable_email = false ;
  $scope.contact_form();
}
$scope.import_contacts = function(){
  console.log("click")
  $scope.set_active_page("import2_contacts")
}

$scope.contact_form = function(){
  $scope.modifier_contact_name_modal = $uibModal.open({
    templateUrl: 'app/templates/modals/contact_name_modifier.html',
    scope : $scope ,
    size : 'sm',
    windowClass : "partage" ,
    controller : "UsersController",
  })
}

$scope.modifier_contact_name = function(index){
   $scope.active_contact = $scope.cards[index];
   $scope.disable_email = true ;
  $scope.contact_form()

}
$scope.close_contact_name_modifier = function(){
  $scope.modifier_contact_name_modal.close()
}
$scope.contact_modifier_valider = function(){
    console.log($scope.active_contact)
    $scope.close_contact_name_modifier()
}


/* CHART */

$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
 $scope.series = ['Series A', 'Series B'];
 $scope.data = [
   [65, 59, 80, 81, 56, 55, 40],
   [28, 48, 40, 19, 86, 27, 90]
 ];
 $scope.onClick = function (points, evt) {
   console.log(points, evt);
 };
 $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
 $scope.options = {
   scales: {
     yAxes: [
       {
         id: 'y-axis-1',
         type: 'linear',
         display: true,
         position: 'left'
       },
       {
         id: 'y-axis-2',
         type: 'linear',
         display: true,
         position: 'right'
       }
     ]
   }
 };




$scope.list_contacts();
}])
