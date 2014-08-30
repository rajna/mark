'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).
factory('Book', function ($resource) {
	 return $resource('/books/:user/:id', {id:'@id'}, {
          query: { method: 'GET', params: {id:'booklist'},isArray:true},
          queryself: { method: 'GET', params: {id:'selfbooklist'},isArray:true}
        });
}).
factory('User', function ($resource) {
		 return $resource('/user/:useremail/:id', {id:'@id'}, {
              query: { method: 'GET', params: {id:'userlist'},isArray:true},
              queryfellow: { method: 'GET', params: {id:'fellowlist'},isArray:true}
            });
})




