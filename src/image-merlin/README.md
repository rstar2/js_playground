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
    Configure Git Hooks (using Husky for instance) in package.json

    ```json
     // Configure Git Hooks using Husky
    "husky": {
        "hooks": {
            // The --staged parameter triggers a mode that watches GIF, JPG and PNG files in git diff and only compresses those files.
            // That approach makes Merlin be quite efficient in operation.
            // Note that the folder parameter doesn’t work in staged mode.
            "pre-commit": "npm run imagemin -- --staged"
        }
    }
    ```
