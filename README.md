# qualitywatcher

[![Build Status](https://travis-ci.org/QualityWorksCG/qualitywatcher.svg)](https://travis-ci.org/QualityWorksCG/qualitywatcher)
[![npm version](https://badge.fury.io/js/qualitywatcher.svg)](https://badge.fury.io/js/qualitywatcher)
[![npm Downloads](https://img.shields.io/npm/dt/qualitywatcher.svg)](https://www.npmjs.com/package/qualitywatcher)
[![Dependency Status](https://david-dm.org/qualityworkscg/qualitywatcher.svg)](https://david-dm.org/qualityworkscg/qualitywatcher)
[![npm](https://img.shields.io/npm/l/qualitywatcher.svg)](https://www.npmjs.com/package/qualitywatcher)

 qualitywatcher is a reporting module for various test frameworks. Once your tests are complete, results are sent to your dashboard on [qualitywatcher.io](http://qualitywatcher.io). qualitywatcher currently supports **Nightwatch** and **TestNG** frameworks with more options coming soon.

---

## How it works

* Sign up for an account at [qualitywatcher.io](http://qualitywatcher.io) using you BitBucket account. (Github coming soon)

* Navigate to the repositories page, click on details for the project you wish to watch then ‘ADD TO WATCHLIST'

![Start watching your project]( http://res.cloudinary.com/dzddmm3a8/image/upload/v1468518316/addtowatchlist.png "Start watching your project")

* Create a **.qualitywatcher.yml** in the root of your project and past your repo token as below
    
        repo_token: 12345 

### For JavaScript projects (Nightwatch)

* Install the module
```
npm install qualitywatcher --save-dev
```

* Add this script to your package.json
```
"report": "./node_modules/nightwatch/bin/nightwatch | ./node_modules/qualitywatcher/dist/bin/qualitywatcher.js"
```

* Use the following command to send your nightwatch test results to QualityWatcher.
```
npm run report
```

### For Java projects (TestNG)

* Send us a message at [qualitywatcher.io](http://qualitywatcher.io) for help with configuring this setup.

---



