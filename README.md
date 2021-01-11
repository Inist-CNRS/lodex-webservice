# A dedicated webservice for Lodex

with docker

    make build
    make run-debug

or with [ezmaster](https://github.com/Inist-CNRS/ezmaster)


## to test

```
cat local/sample.json|curl --proxy "" -X POST --data-binary @- "http://localhost:31976/expand?indent=true"
```

