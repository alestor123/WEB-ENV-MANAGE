'use strict'
const pck = require('./package.json')
const { readFileSync, existsSync, statSync } = require('fs')
const { resolve, join, extname } = require('path')
const chalk = require('chalk')

module.exports = options => {
try {

  const opto = [{ arg: ['v', 'version'], out: pck.version, exit: 0 }, { arg: ['h', 'help'], out: readFileSync(resolve(join(__dirname, './assets/man/help.man')), 'utf8'), exit: 0 }, { arg: ['i', 'issue'], out: `\n      Issues at ${pck.bugs.url} \n    `, exit: 0 }, { arg: ['d', 'docs'], out: `\n      Docs at ${pck.homepage} \n    `, exit: 0 }]
  opto.forEach(aro => {
    if (options[aro.arg[0]] || options[aro.arg[1]]) {
      console.log(aro.out)
      process.exit(aro.exit)
    }
  })
  const envFilepth = options.f || options.file
  if((envFilepth)) if(!(existsSync(envFilepth) && statSync(envFilepth).isFile() && extname(envFilepth)==='.env')) throw new Error('Please enter a valid path')
  else return envFilepth || ''
  
//   if (optionFilePath || (existsSync(optionFilePath) && statSync(optionFilePath).isFile() && extname(optionFilePath)==='.env' )) return optionFilePath
//   else throw new Error('Please enter valid path')
} catch (e) {
    console.log(chalk.redBright.bold('Oops : ' + e.message))
    process.exit(1)
}
  
}
