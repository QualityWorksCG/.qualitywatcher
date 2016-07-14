# qualitywatcher

[![Build Status](https://travis-ci.org/QualityWorksCG/qualitywatcher.svg)](https://travis-ci.org/QualityWorksCG/qualitywatcher)
[![npm Downloads](https://img.shields.io/npm/dt/qualitywatcher.svg)](https://www.npmjs.com/package/qualitywatcher)
[![npm](https://img.shields.io/npm/l/qualitywatcher.svg)](https://www.npmjs.com/package/qualitywatcher)

 QualityWatcher is a reporting module for various test frameworks. Once your tests are complete, results are sent to your QualityWatcher dashboard at [QualityWatcher Application](qualitywatcher.io). QualityWatcher currently supports **Mocha**, **nightwatch.js** and **TestNG** frameworks with more options coming soon.

---

## How it works

1. Sign up for an account at [QualityWatcher.io](qualitywatcher.io) using you BitBucket account. (Github coming soon)

2. Navigate to the repositories page and start 'watching your project'

3. Create a **.qualitywatcher.yml** in the root of your project and past your repo token as below
    
        repo_token: 12345 

### For JavaScript projects

4. Install the module
```
npm install qualitywatcher
```

5. Add this script to your package.json
```
"report": "./node_modules/nightwatch/bin/nightwatch | ./node_modules/qualitywatcher/bin/qualitywatcher.js"
```

6. Use the following command to send your nightwatch test results to QualityWatcher.
```
npm run report
```

### For Java projects (TestNG)

4. Send us a message at [QualityWorks Consulting Group](qualityworkcg.com) for help with configuring this setup.

---

## Test Command
```
npm test
```



