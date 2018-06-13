See https://luetkemj.github.io/180505/netlify-lambdas-as-simple-as-possible/

Every root file in ./functions will become an endpoint with the following structure:
``` {your-site-root}/.netlify/functions/{filename} ```

In the end Netlify does surprising little with your project. It runs the build command you tell it to, publishes the production code from the directory you tell it to, and packages and deploys functions from the directory you tell it to. What happens in your build step is entirely up to you. Where you put your production ready code and Lambda functions is entirely up to you.
See README.md