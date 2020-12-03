## Create a self-signed SSL certificate

### This command will create the pair-key the certificate signing request and the certificate chain itself

```bash
openssl req -newkey rsa:4096 \
            -x509 \
            -sha256 \
            -days 3650 \
            -out example.crt \
            -keyout example.key
```

add '-nodes' option if no passphrase is needed

Note!!! ServiceWorkers don't work with self-signed certificates, an in fact for local development on "localhost"/"127.0.0.1" HTTPS is actually not needed for the ServiceWorker,


## For testing outside the local machine (like on a phone) it's better to use NGROK

```bash
ngrok http 5000
```

This will make a tunnel to to localhost 5000 on some public http://xxxx.ngrok.io and thus the PWA can be tested on the phone without the need to install SSL Certificate
