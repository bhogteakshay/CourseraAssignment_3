(function() {
  'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);


function FoundItemsDirective() {

  var ddo = {
    templateUrl: 'menuItem.html',
    scope:{
        found:'<',
        onRemove : '&',
    },
    controller: MenuServiceDirectiveController,
    controllerAs:'menu',
    bindToController:true
  };

  return ddo;

}

function MenuServiceDirectiveController() {
console.log("dirController",this);
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService){
  var menu = this;
  menu.found;

  menu.searchMenuItem = function(){

    var promise = MenuSearchService.getMatchedMenuItems();

          promise.then(function (response){

                menu.found  = MenuSearchService.CheckIfExists(menu.SearchTerm, response.data)
          })
          .catch(function(error){
            console.log('Something terribly went wrong!!');
          })
    }

    menu.removeItem =function(index){
       MenuSearchService.remove(index);
   }

}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http){

  var service = this;
  var found = [];
  var itemCounter = 0;

  service.getMatchedMenuItems = function (searchTerm) {

      var response = $http({
        method:"GET",
        url:("https://davids-restaurant.herokuapp.com/menu_items.json"),
      });



      return response;
  };


  service.CheckIfExists = function(searchItem, MenuList){

      found.length = 0;

      if(searchItem !== ""){
      for(var i = 0; i< MenuList.menu_items.length; i++){

        if(MenuList.menu_items[i].description.indexOf(searchItem) !== -1)
            found.push(MenuList.menu_items[i]);
      }
}
      return found;
  };

  service.remove = function (index)
  {
      found.splice(index,1);
  }

}



})();
