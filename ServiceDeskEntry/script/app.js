// Initialize the Angular module
const app = angular.module('TicketApp', []);

// Define the controller logic
app.controller('TicketController', ['$scope', '$http', function($scope, $http) {
    // Model bindings for the ticket payload
    $scope.ticket = {
    title: '',
    description: ''
    };
    $scope.resolution = null;
    $scope.isProcessing = false;

    $scope.onSubmit = function() {
    $scope.resolution = 'Analyzing ticket details and checking knowledge base...';
    $scope.isProcessing = true;
    
    // When deployed within an Azure Static Web App framework, this relative URL 
    // routes directly to your nested Node.js backend api folder automatically.
    // For local development testing right now, make sure your func host is on port 7071
    const targetUrl = 'http://localhost:7071/api/ResolveTicket';

    $http.post(targetUrl, $scope.ticket)
        .then(function(response) {
        // Success: Display the synchronous resolution payload returned by the Node.js worker
        $scope.resolution = response.data.resolution;
        $scope.isProcessing = false;
        })
        .catch(function(error) {
        // Error handling for network drops or configuration/CORS issues
        console.error('Error contacting API:', error);
        $scope.resolution = 'Error communicating with the resolution engine. Ensure your backend function is running locally via "func start" and CORS is configured.';
        $scope.isProcessing = false;
        });
    };
}]);
