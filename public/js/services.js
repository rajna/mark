'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).
	factory('Book', function ($resource) {
		 return $resource('/books/:id', {id:'@id'}, {
              query: { method: 'GET', params: {id:'booklist'},isArray:true}
            });
})




