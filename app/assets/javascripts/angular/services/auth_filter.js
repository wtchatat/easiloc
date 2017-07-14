// angular.module('app')
//    .factory('Auth', ['$cookieStore', function ($cookieStore) {
//
//         var _user = {};
//
//         return {
//
//             user : _user,
//
//             set: function (_user) {
//                 // you can retrive a user setted from another page, like login sucessful page.
//                 existing_cookie_user = $cookieStore.get('current.user');
//                 _user =  _user || existing_cookie_user;
//                 $cookieStore.put('current.user', _user);
//             },
//
//             remove: function () {
//                 $cookieStore.remove('current.user', _user);
//             }
//         };
//     }])
