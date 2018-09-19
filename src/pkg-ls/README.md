# Install pkg

```console
$ npm install -g pkg
```

# In package.json add a 'bin' property
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

            
# Run pkg
Pkg will look for package.json in the specified directory and will follow 'bin' property of the 'package.json' inside it and use it as entry file.

```console
$ pkg .
```