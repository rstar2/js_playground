## 1. Install Exodus 
See https://github.com/intoli/exodus
```
$ pip install --user exodus_bundler
```

For Linux add in '~/.bashrc':
```
export PATH="~/.local/bin/:${PATH}"
```

For Windows
```
PATH=%PATH%;C:\Users\rumen\AppData\Roaming\Python\Python36\Scripts
```

## 2. Install FFMPEG

## 3. Bundle FFMPEG with Exodus
In order to be able to access FFMPEG from the AWS Lambda container we have to upload the binary somehow

## 4. Init Serverless inside
```
$ serverless create -t aws-nodejs
```

Then update the 'serverless.yml' configuration



## Create a Bookmarklet