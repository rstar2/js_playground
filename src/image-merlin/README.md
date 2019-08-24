# Good package for optimizing images - LOSSLESSLY, for GPG, GIF, PNG
 
 It's a wrapper around _imagemin-cli_, which can be used on it's own

## Install

```bash
npm i -D @sum.cumo/imagemin-merlin
```

1. Manual optimization - Put in package.json scripts and manually call when needed
    For instance can be set to optimize certain folder only.
    Dry is to inspect the optimized images, otherwise they are overwritten.

    ```json
    "scripts": {
        "imagemin": "imagemin-merlin --folder=static",
        "imagemin:dry": "imagemin-merlin --dry --folder=static",
    }
    ```

2. Automatic optimization on Git commit
    Configure Git Hooks (using Husky for instance)

    ```json
    "husky": {
      "hooks": {
        "pre-commit": "npm run imagemin -- --staged"
      }
    }
    ```
