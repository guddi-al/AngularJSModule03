(function () {
    'use strict';

    angular.module('MenuSearchApp', [])
        .controller('MenuSearchController', MenuSearchController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

    MenuSearchController.$inject = ['MenuSearchService'];
    function MenuSearchController(MenuSearchService) {
        var menu = this;
        menu.searchTerm = "";
        menu.found = [];
        menu.nothingFound = false;

        menu.narrowItDown = function () {
            if (menu.searchTerm === "") {
                menu.nothingFound = true;
                menu.found = [];
                return;
            }

            var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);

            promise.then(function (response) {
                menu.found = response;
                menu.nothingFound = menu.found.length === 0;
            })
                .catch(function (error) {
                    console.log(error);
                });
        };

        menu.removeItem = function (index) {
            menu.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            }).then(function (result) {
                var foundItems = [];
                var menuItems = result.data.menu_items;

                for (var i = 0; i < menuItems.length; i++) {
                    var description = menuItems[i].description;

                    if (description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                        foundItems.push(menuItems[i]);
                    }
                }

                return foundItems;
            });
        };
    }
})();
