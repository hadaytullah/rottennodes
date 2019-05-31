var bluebird = require('bluebird'),
    apiNpm = require('api-npm'),
    cheerio = require("cheerio");
    
    
var apiNpmPromise = bluebird.promisifyAll(apiNpm),
    requestPromise = require('request-promise');
    //bluebird = require('bluebird');

module.exports = {
    getStats,
    getAllStats
}

function getStats(libName){
    console.log(libName);
    return new Promise(function(resolve, reject){
        apiNpm.getstat(libName,'2016-11-12','2016-12-09',function(npmData,npmError){
            if(npmError){
                console.log("Error:"+npmError);
                return reject(npmError);
            }
            console.log(npmData);
            return resolve(npmData);    
        });
        
        
        
    });
}

function getAllStats(libName){
    console.log(libName);
    return new Promise(function(resolve, reject){
        var libDetailsResponse = {
            libname:libName,
            npm:{
                downloads:0
            },
            github:{
                url:"",
                fork:0,
                star:0,
                watch:0
            },
            stackoverflow:{
                questions:0
            }
        };
        
        apiNpm.getstat(libName,'2016-11-12','2016-12-09',function(npmData,npmError){
            if(!npmData.error){
                 libDetailsResponse.npm.downloads=npmData.downloads;
            }
            apiNpm.getdetails(libName,function(npmData, npmError){
                if(npmError || !npmData || !npmData.repository){
                    console.log("Error:"+npmError);
                    return reject(npmError);
                }
                console.log(npmData);
                var forkUrl= getApiUrl(npmData.repository.url) +'/forks';
                var githubUrl = getGithubPageUrl(npmData.repository.url);
                console.log('Github'+npmData.repository.url);
                //console.log(forkUrl);
                libDetailsResponse.github.url = githubUrl;
    
                requestPromise({
                    uri:githubUrl,
                    // qs: {
                    //     access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
                    // },
                    headers: {
                        'User-Agent': 'Request-Promise'
                    }
                    //json: true // Automatically parses the JSON string in the response
                }).then(function(githubResponse) {
                    libDetailsResponse.github = parseGithubPageToInfo(githubResponse);
                }).catch( function(githubError) {
                    console.log(githubError);
                    //reject(githubError);
                }).then (function(){
                    var stackOverFlowUri = 'https://api.stackexchange.com/2.2/tags/'+libName+'/info?order=desc&sort=popular&site=stackoverflow';
                    console.log(stackOverFlowUri);
                    requestPromise({
                        uri:stackOverFlowUri,
                        gzip:true
                        //headers:{
                        //    'Accept-Encoding': 'gzip'
                        //}
                        //json: true 
                    }).then(function(stackOverFlowResponse){
                        console.log('original:'+stackOverFlowResponse);
                        //console.log('stringify:'+JSON.parse( JSON.stringify( stackOverFlowResponse )) );
                        //console.log('utf8:'+JSON.stringify(stackOverFlowResponse, null, 2));
                        var stackOverFlowRespObj = JSON.parse(stackOverFlowResponse);
                        libDetailsResponse.stackoverflow.questions = stackOverFlowRespObj.items[0].count;
                        resolve(libDetailsResponse);
                    }).catch(function(stackOverFlowError){
                        resolve(libDetailsResponse);
                        //reject(stackOverFlowError);
                    });
                });
        });
            
        });
        
        
    });
}

function getStats_(libName){
    console.log(libName);
    return new Promise(function(resolve, reject){
        apiNpmPromise.getstatAsync(libName,'2016-11-12','2016-12-09')
        .then(function(npmData){
            console.log(npmData);
            resolve(npmData);    
        }).catch(function(npmError){
            console.log("Error:"+npmError);
            reject(npmError);
        });
        
        
        
    });
}

function getDetails_(libName){
    console.log(libName);
    return new Promise(function(resolve, reject){
        apiNpmPromise.getdetailsAsync(libName)
        .then(function(npmData){
            resolve({
                github:{
                    repository_url:npmData.repository.url,
                    api_url:getApiUrl(npmData.repository.url)
                }
            });
        })
        .catch(function(npmError){
            console.log("Error:"+npmError);
            reject(npmError);
        });
        
    });
}

function getApiUrl(gitHubRepoUrl){
   return gitHubRepoUrl.replace("github.com","api.github.com/repos")
}

function getGithubPageUrl(repositoryUrl){
    var ownerAndRepo = repositoryUrl.split('github.com')[1];
    if(ownerAndRepo[0]!=='/'){
        ownerAndRepo = ownerAndRepo.replace(/:/, '/');   
    }
     return 'https://github.com'+ ownerAndRepo;
}

function parseGithubPageToInfo(githubPageHtml){
    var githubInfo = {
        fork:0,
        star:0,
        watch:0
    }
    var $libGitPage = cheerio.load(githubPageHtml);
    var libGithubDetails = $libGitPage('div.pagehead.repohead > .container.repohead-details-container > ul.pagehead-actions > li > a.social-count');
    libGithubDetails.each(function(detailIndex, detail){
        try{
            if(detail.attribs.href.includes('stargazers')){
                githubInfo.star = detail.attribs['aria-label'].split(' ')[0];
            }
        }catch(e){
            githubInfo.star = 0;
        }
        
        try{
            if(detail.attribs.href.includes('watchers')){
                githubInfo.watch = detail.attribs['aria-label'].split(' ')[0];
            }
        }catch(e){
            githubInfo.watch = 0;
        }   
        
        try{
            if(detail.attribs.href.includes('network')){ //forks
                githubInfo.fork = detail.attribs['aria-label'].split(' ')[0];
            }
        }catch(e){
            githubInfo.fork = 0;
        }
    });
    return githubInfo; 
}