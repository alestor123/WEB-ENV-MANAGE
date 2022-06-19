const { readFileSync, writeFileSync,statSync, watch, existsSync } = require('fs')
const { parse } = require('dotenv');
const { resolve, basename,extname } = require('path');
const envFilePath = require('electron').remote.getGlobal('envFilePath');
const disabledIds = ['addVarin', 'addVarinn', 'updateButton', 'addButton', 'search']
let envPath = (existsSync(envFilePath) && statSync(envFilePath).isFile() && extname(envFilePath)==='.env' )? resolve(envFilePath) : false; 
let data = {}
window.addEventListener('DOMContentLoaded', () => {
  const file = document.getElementById('file-upload')
  const sinput = document.getElementById('search')
  const keyIn = document.getElementById('addVarin')
  const valIn = document.getElementById('addVarinn')
  const tableCon = document.getElementById('tableCon')
  if(envPath) {
  document.getElementById('fileName').innerHTML = basename(envPath)
  enableInputs()
  watch(envPath, () => refresh())
  refresh()
}
  sinput.addEventListener('input', (e) => displayItems(Object.keys(data).filter(key => key.toLowerCase().includes(e.target.value.toLowerCase()) || data[key].toLowerCase().includes(e.target.value.toLowerCase())).reduce((res, key) => (res[key] = data[key], res), {})))
  file.addEventListener('change', (e) => {
    const [file] = e.target.files
    const { name, path } = file
    envPath = path
    document.getElementById('fileName').innerHTML = name
    enableInputs()
    watch(path, () => refresh())
    refresh()
  })
  document.getElementById('addButton').addEventListener('click', () => {
    if (Validation()) {
      data[keyIn.value] = valIn.value
      updateEnv()
      refresh()
    }
  })

  document.getElementById('deleteButton').addEventListener('click', () => {
    if (confirm('Are you sure ?')) {
      const checkboxes = document.querySelectorAll('.checkbx')
      checkboxes.forEach(ckbox => {
        if (ckbox.checked) {
          delete data[ckbox.value]
          updateEnv()
          refresh()
        }
      })
    } else alert('Aborted')

    // remove value validation
  })

  document.getElementById('updateButton').addEventListener('click', () => {
    if (Validation()) {
      data[keyIn.value] = valIn.value
      updateEnv()
      refresh()
    }
    // remove value validation
  })

  function enableInputs() {
    disabledIds.forEach(id => document.getElementById(id).disabled = false)
  }
  function refresh () {
    data = parse(readFileSync(envPath, 'utf8'))
    displayItems(data)
  }
  function displayItems (jsdata) {
    const values = Object.values(jsdata)
    const keys = Object.keys(jsdata)
    tableCon.innerHTML = ''
    keys.forEach((item, index) => { tableCon.innerHTML += '<div>' + '<tr>' + '<td>' + '<input type="checkbox" class="checkbx" value="' + item + '" id="flexCheckDefault"/>' + '</td>' + '<td>' + Object.keys(data).indexOf(item) + '</td>' + '<td>' + item + '</td>' + '<td>' + values[index] + '</td> ' + '</tr>' + '</div>' })
    document.querySelectorAll("input[type='checkbox']").forEach(chkb => chkb.addEventListener('change', (e) => document.getElementById('deleteButton').disabled = !e.target.checked))
  }
  function Validation (isDelete) {
    if (!(isDelete ? keyIn.value.length > 0 : keyIn.value.length > 0 && valIn.value.length > 0)) {
      alert('please fill out input')
      return false
    }
    return true
  }
  function updateEnv () {
    writeFileSync(envPath, JSON.stringify(data).replace(/{|}|"/g, '').replace(/:|"/g, '=').replace(/,/g, '\n'))
  }
})
