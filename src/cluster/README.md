# 1. Run server in both modes:
```bash
$ npm run start:server
```

and

```bash
$ npm run start:cluster
```

# 2. Then test with

```bash
$ loadtest -c 10 -n 10 http://localhost:3000
```