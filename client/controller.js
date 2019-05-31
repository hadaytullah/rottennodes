angular.module('nodestats', ['tc.chartjs'])
.controller('ChatController',
      function ($scope,$http,$window) {
        $scope.message = "";
        $scope.libName = "";
        $scope.libData = {
            npm:{},
            github:{}
        };
        
        //chart settings
        $scope.chartType='horizontalBar';//''bar';
        $scope.chartWidth = 0.2;
        $scope.chartHeight = 0.2;
        $scope.chartOptions = {
            //responsive: true,
            //maintainAspectRatio: false,
            scales: {
                //height:$scope.chartWidth,
                //width:$scope.chartHeight
               //yAxes: [{
                //    type: 'myScale' // this is the same key that was passed to the registerScaleType function
                //}]
            },
            // Elements options apply to all of the options unless overridden in a dataset
            // In this case, we are setting the border of each horizontal bar to be 2px wide
            elements: {
                rectangle: {
                    borderWidth: 2,
                }
            },
            responsive: true,
            legend: {
                display:true
                //position: 'right',
            }
            //title: {
            //    display: true,
            //    text: 'Downloads from npm.com'
            //}
        };
                
        /*Chart.pluginService.register({
            afterDraw: function(chartInstance) {
                var ctx = chartInstance.chart.ctx;
        
                // render the value of the chart above the bar
                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
        
                chartInstance.data.datasets.forEach(function (dataset) {
                    for (var i = 0; i < dataset.data.length; i++) {
                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                        ctx.fillText(dataset.data[i], model.x, model.y);
                    }
                });
          }
        });*/ 
        
        $scope.getStats = function () {
            //console.log("called"+$scope.libName);
            //console.log(response);
            //$scope.libStats = response.data.library.stats;
            //  $scope.libData.npm=response.data.library.stats;
            $scope.message = "";
            $http({
                method:'GET',
                url:'/stats/'+$scope.libName
            }).then(function success(response){
                console.log(response);
                $scope.libDetails = response.data;
                $scope.libData = response.data;
                
                $scope.pushLibDataToCharts(response.data);
                 $scope.overviewChart.update();
                //$scope.drawOverviewChart();
                //$scope.drawDownloadChart();
                //$scope.drawForkChart();

            }, function error(error) {
                console.log(error);
                $scope.message = error.data.message;
            });
        };
        
        var color = Chart.helpers.color;
        $scope.overviewChartData = {
            labels: [],
            datasets: []
        };
        $scope.npmDownloadsChartData = {
            labels: ['Downloads'],
            datasets: []
        };
        $scope.githubForkChartData = {
            labels: ['Forks'],
            datasets: []
        };
        $scope.githubStarChartData = {labels: [], datasets: []};
        $scope.githubWatchChartData = {labels: [],datasets: []};
        $scope.stackoverflowQuestionsChartData = {labels: [],datasets: []};        
        $scope.chartColors = ['#70D3FF','#cc99ff','#99cc00', '#b300b3', '#ff8000', '#99b3e6'];
        $scope.colorIndex = 0;
        //$scope.pushDataSetsToChart();
        $scope.pushDataSetsToChart = function (){
            $scope.npmDownloadDataSet = {
                label: 'NPM Downloads',//$scope.libName,
                backgroundColor: color($scope.chartColors[0]).alpha(1).rgbString(),
                //'rgba(255, 159, 64, 0.2)',
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: []
            };
            
            $scope.overviewChartData.datasets.push($scope.npmDownloadDataSet);
            
             $scope.githubForkDataSet = {
                label: 'Github Forks', //$scope.libName,
                backgroundColor: color($scope.chartColors[1]).alpha(1).rgbString(),
                //'rgba(255, 159, 64, 0.2)',
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: []
            };
            
            $scope.overviewChartData.datasets.push($scope.githubForkDataSet);
            
            $scope.githubStarDataSet = {
                label: 'Github Stars', //$scope.libName,
                backgroundColor: color($scope.chartColors[2]).alpha(1).rgbString(),
                //'rgba(255, 159, 64, 0.2)',
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: []
            };
            
            $scope.overviewChartData.datasets.push($scope.githubStarDataSet);
            
            $scope.githubWatchDataSet = {
                label: 'Github Watch',//$scope.libName,
                backgroundColor: color($scope.chartColors[3]).alpha(1).rgbString(),
                //'rgba(255, 159, 64, 0.2)',
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: []
            };
            
            $scope.overviewChartData.datasets.push($scope.githubWatchDataSet);
            
            $scope.stackoverflowQuestionDataSet = {
                label: 'Stackoverflow Questions',//$scope.libName,
                backgroundColor: color($scope.chartColors[4]).alpha(1).rgbString(),
                //'rgba(255, 159, 64, 0.2)',
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: []
            };
            
            $scope.overviewChartData.datasets.push($scope.stackoverflowQuestionDataSet);
            
        }
        $scope.pushDataSetsToChart();
        $scope.pushLibDataToCharts= function(libData){
            //$scope.libData.github.fork
            //$scope.npmDownloadsChartData.datasets[0].labels.push($scope.libName);
            
            $scope.overviewChartData.labels.push($scope.libName);
            
            $scope.npmDownloadDataSet.data.push(parseInt(libData.npm.downloads ? $scope.libData.npm.downloads : 0));
            $scope.githubForkDataSet.data.push(parseInt(libData.github.fork ? $scope.libData.github.fork : 0));
            $scope.githubStarDataSet.data.push(parseInt(libData.github.star ? $scope.libData.github.star : 0));
            $scope.githubWatchDataSet.data.push(parseInt(libData.github.watch? $scope.libData.github.watch : 0));
            $scope.stackoverflowQuestionDataSet.data.push(parseInt(libData.stackoverflow.questions ? $scope.libData.stackoverflow.questions : 0));
            
        }
        $scope.pushLibDataToCharts_old= function(libData){
            //$scope.libData.github.fork
            //$scope.npmDownloadsChartData.datasets[0].labels.push($scope.libName);
            
            //$scope.overviewChartData.labels.push($scope.libName);
            
            $scope.overviewChartData.datasets.push({
                label: 'NPM Downloads',//$scope.libName,
                backgroundColor: color($scope.chartColors[0]).alpha(1).rgbString(),
                //'rgba(255, 159, 64, 0.2)',
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: [parseInt(libData.npm.downloads ? $scope.libData.npm.downloads : 0)]
            },
            {
                label: 'Github Forks', //$scope.libName,
                backgroundColor: color($scope.chartColors[1]).alpha(1).rgbString(),
                //'rgba(255, 159, 64, 0.2)',
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: [parseInt(libData.github.fork ? $scope.libData.github.fork : 0)]
            },
            {
                label: 'Github Stars', //$scope.libName,
                backgroundColor: color($scope.chartColors[2]).alpha(1).rgbString(),
                //'rgba(255, 159, 64, 0.2)',
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: [parseInt(libData.github.star ? $scope.libData.github.star : 0)]
            },
            {
                label: 'Github Watch',//$scope.libName,
                backgroundColor: color($scope.chartColors[3]).alpha(1).rgbString(),
                //'rgba(255, 159, 64, 0.2)',
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: [parseInt(libData.github.watch? $scope.libData.github.watch : 0)]
            },
            {
                label: 'Stackoverflow Questions',//$scope.libName,
                backgroundColor: color($scope.chartColors[4]).alpha(1).rgbString(),
                //'rgba(255, 159, 64, 0.2)',
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: [parseInt(libData.stackoverflow.questions ? $scope.libData.stackoverflow.questions : 0)]
            });
            
            //---------------------------
            $scope.npmDownloadsChartData.datasets.push({
                label: libData.libname, //$scope.libName,
                backgroundColor: color($scope.chartColors[$scope.colorIndex]).alpha(1).rgbString(),
                //'rgba(255, 159, 64, 0.2)',
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: [parseInt(libData.npm.downloads)]
            });
            
            //$scope.githubForkChartData.datasets[0].labels.push($scope.libName);
            $scope.githubForkChartData.datasets.push({
                label: libData.libname, //$scope.libName,
                backgroundColor: color($scope.chartColors[$scope.colorIndex]).alpha(1).rgbString(),
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: [parseInt(libData.github.fork)]
            });
            
            $scope.githubStarChartData.labels.push($scope.libName);
            $scope.githubStarChartData.datasets.push({
                label: libData.libname, //$scope.libName,
                backgroundColor: color($scope.chartColors[$scope.colorIndex]).alpha(1).rgbString(),
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: [parseInt(libData.github.star)]
            });
        
            $scope.githubWatchChartData.labels.push($scope.libName);
            $scope.githubWatchChartData.datasets.push({
                label: libData.libname, //$scope.libName,
                backgroundColor: color($scope.chartColors[$scope.colorIndex]).alpha(1).rgbString(),
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: [parseInt(libData.github.watch)]
            });
            
            $scope.stackoverflowQuestionsChartData.labels.push($scope.libName);
            $scope.stackoverflowQuestionsChartData.datasets.push({
                label: libData.libname, //$scope.libName,
                backgroundColor: color($scope.chartColors[$scope.colorIndex]).alpha(1).rgbString(),
                //color('#70D3FF').alpha(0.5).rgbString(),
                //borderColor: Chart.chartColors.red,
                borderWidth: 1,
                data: [parseInt(libData.stackoverflow.questions)]
            });
            $scope.colorIndex++;
        }
        
        $scope.drawOverviewChart= function(){
            var overviewContext = document.getElementById("chart_overview").getContext("2d");
            $scope.overviewChart = new Chart(overviewContext, {
                type: $scope.chartType,
                data: $scope.overviewChartData,
                options: $scope.chartOptions
            });
        }
        
        $scope.drawOverviewChart();
        $scope.drawDownloadChart= function(){
            var downloadsContext = document.getElementById("chart_downloads").getContext("2d");
            $scope.npmDownloadsChart = new Chart(downloadsContext, {
                type: $scope.chartType,
                data: $scope.npmDownloadsChartData,
                options: $scope.chartOptions
            });
        }
        
        $scope.drawForkChart= function(){
            var downloadsContext = document.getElementById("chart_fork").getContext("2d");
            $scope.npmForkChart = new Chart(downloadsContext, {
                type: $scope.chartType,
                data: $scope.githubForkChartData,
                options:$scope.chartOptions 
            });
        }
        
        
        
});