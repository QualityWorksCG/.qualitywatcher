# qualitywatcher

[![Build Status](https://travis-ci.org/QualityWorksCG/qualitywatcher.svg)](https://travis-ci.org/QualityWorksCG/qualitywatcher)
[![npm Downloads](https://img.shields.io/npm/dt/qualitywatcher.svg)](https://www.npmjs.com/package/qualitywatcher)
[![Dependency Status](https://david-dm.org/qualityworkscg/qualitywatcher.svg)](https://david-dm.org/qualityworkscg/qualitywatcher)
[![npm](https://img.shields.io/npm/l/qualitywatcher.svg)](https://www.npmjs.com/package/qualitywatcher)

 QualityWatcher is a reporting module for various test frameworks. Once your tests are complete, results are sent to your QualityWatcher dashboard at [QualityWatcher Application](qualitywatcher.io). QualityWatcher currently supports **Mocha** and **TestNG** frameworks with more options coming soon.

---

## How it works

1. Sign up for an account at [QualityWatcher.io](http://qualitywatcher.io) using you BitBucket account. (Github coming soon)

2. Navigate to the repositories page, click on details for the project you wish to watch then ‘ADD TO WATCHLIST'

![Start watching your project]( http://res.cloudinary.com/dzddmm3a8/image/upload/v1468518316/addtowatchlist.png "Start watching your project")


3. Create a **.qualitywatcher.yml** in the root of your project and past your repo token as below
    
        repo_token: 12345 

### For JavaScript projects (Nightwatch)

4. Install the module
```
npm install qualitywatcher
```

5. Add this script to your package.json
```
"report": "./node_modules/nightwatch/bin/nightwatch | ./node_modules/qualitywatcher/dist/bin/qualitywatcher.js"
```

6. Use the following command to send your nightwatch test results to QualityWatcher.
```
npm run report
```

### For Java projects (TestNG)

4. Send us a message at [QualityWatcher.io](http://qualitywatcher.io) for help with configuring this setup.

---



