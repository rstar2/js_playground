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
$ sls create -t aws-nodejs
```

1. Update the 'serverless.yml' configuration

2. Test configuration
```
$ sls config
```

3. Deploy
```
$ sls deploy
```

4. Test event
```
{
  "url": "https://r2---sn-hvcpauxa-nv4s.googlevideo.com/videoplayback?itag=140&pl=24&mime=audio%2Fmp4&fexp=23709359&c=WEB&keepalive=yes&pcm2cms=yes&mm=31%2C29&mn=sn-hvcpauxa-nv4s%2Csn-nv47ln7z&gir=yes&requiressl=yes&ei=WsYoW4KOFIS11gKt4p04&ms=au%2Crdu&mt=1529398734&mv=m&dur=198.089&expire=1529420474&ip=77.70.63.244&key=yt6&lmt=1508866017022484&id=o-ADZn8HIqqFLtaf1Ig5-7HwDw5HgpRu835UtwCVaMKgaj&fvip=2&source=youtube&initcwndbps=1551250&ipbits=0&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpcm2cms%2Cpl%2Crequiressl%2Csource%2Cexpire&clen=3146781&ratebypass=yes&signature=37B854A52E29F92FE15935D988D7F41E72BDD0B7.1E0B443FA2036ADB7FEFC457ED52FC70F3F66ADF",
  "filename": "Dan Auerbach - The Prowl.aac",
  "key": "1529398872917 - Dan Auerbach - The Prowl"
}
```




## Create a Bookmarklet