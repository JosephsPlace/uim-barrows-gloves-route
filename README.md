# uim-guide

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

##Modifying the route
In order to modify the route, edit the objects in src/assets/data/route.json. New steps / substeps need to be valid JSON and in the following format:
```
    {
      "unique_key": "",
      "step_name": "",
      "substeps": [
        {
          "unique_key": "",
          "text": "",
          "subtext": ""
        }
      ]
    }
```

The keys are currently generated using [this website](https://www.guidgenerator.com/online-guid-generator.aspx). Make sure the generated UUID is unique by searching for it with Control+F. If done correctly, the app should correctly update for the new data.