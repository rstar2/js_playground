# This whole project also works as example of integrating CircleCI
So in order to be able to commit to the 'master' branch (which is push protected)all tests in __test__ folder must succeed in CircleCI, so all the work is done in 'pull_requests" branch. Only after successful commits the 'master' can be merged with the pull request.
