# Using Pkg
## Install Pkg

```console
$ npm install -g pkg
```

## In package.json add a 'bin' property
```json
{
    ....,
    "bin": {
        "ls" : "./lib/index.js"
    }
}
```
or if a single executable is to be created with the name of the package (in this case **ls**)
```json
{
    ....,
    "bin": "./lib/index.js"
}
```

            
## Run Pkg
Pkg will look for package.json in the specified directory and will follow 'bin' property of the 'package.json' inside it and use it as entry file.

```console
$ pkg .
```

# Using Nexe

# Install Nexe
```console
$ npm install -g nexe
```

## Run nexe
It just accepts an entry file.

```console
$ nexe lib/index.js
```
## If there are resources used by the program (for instance an Express server with static/public folder) then they can be packaged also -  a lot of options are available for Nexe